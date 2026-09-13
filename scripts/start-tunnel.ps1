[CmdletBinding()]
param()

$ErrorActionPreference = "Stop"
$projectRoot = "D:\Portfolio"
$logDirectory = Join-Path $projectRoot "logs"
$runtimeDirectory = Join-Path $projectRoot "runtime"
$startupLog = Join-Path $logDirectory "startup.log"
$tunnelLog = Join-Path $logDirectory "cloudflared.log"
$publicUrlFile = Join-Path $runtimeDirectory "public-url.txt"
$originUrl = "http://127.0.0.1:3000"
$cloudflaredPath = "C:\Program Files (x86)\cloudflared\cloudflared.exe"

New-Item -ItemType Directory -Force -Path $logDirectory, $runtimeDirectory | Out-Null

function Write-StartupLog {
  param([string]$Message)
  Add-Content -LiteralPath $startupLog -Value "$((Get-Date).ToString('o')) [tunnel] $Message"
}

$existingTunnel = Get-CimInstance Win32_Process -Filter "Name = 'cloudflared.exe'" |
  Where-Object {
    $_.CommandLine -and
    $_.CommandLine -match [regex]::Escape("tunnel") -and
    $_.CommandLine -match [regex]::Escape($originUrl)
  }
if ($existingTunnel) {
  Write-StartupLog "Existing portfolio Quick Tunnel detected; duplicate start skipped."
  exit 0
}

if (-not (Test-Path -LiteralPath $cloudflaredPath)) {
  Write-StartupLog "cloudflared executable was not found."
  exit 1
}

$serverReady = $false
for ($attempt = 1; $attempt -le 20; $attempt++) {
  try {
    $health = Invoke-RestMethod -Uri "$originUrl/api/health" -TimeoutSec 3
    if ($health.ok -eq $true) {
      $serverReady = $true
      break
    }
  } catch {
    if ($attempt -lt 20) {
      Start-Sleep -Seconds 3
    }
  }
}
if (-not $serverReady) {
  Write-StartupLog "Portfolio did not become healthy within the startup window."
  exit 1
}

Remove-Item -LiteralPath $publicUrlFile -Force -ErrorAction SilentlyContinue
Write-StartupLog "Starting anonymous Quick Tunnel to $originUrl."
$recordedUrl = ""
$previousErrorPreference = $ErrorActionPreference
$ErrorActionPreference = "Continue"
& $cloudflaredPath tunnel --no-autoupdate --url $originUrl 2>&1 |
  ForEach-Object {
    $line = $_.ToString()
    Add-Content -LiteralPath $tunnelLog -Value $line
    $match = [regex]::Match($line, "https://[a-z0-9-]+\.trycloudflare\.com")
    if ($match.Success -and $match.Value -ne $recordedUrl) {
      $recordedUrl = $match.Value
      Set-Content -LiteralPath $publicUrlFile -Value $recordedUrl
      Write-StartupLog "Quick Tunnel URL updated."
    }
  }
$exitCode = $LASTEXITCODE
$ErrorActionPreference = $previousErrorPreference
Write-StartupLog "cloudflared exited with code $exitCode."
exit $exitCode
