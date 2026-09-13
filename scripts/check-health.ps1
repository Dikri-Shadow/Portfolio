[CmdletBinding()]
param()

$projectRoot = "D:\Portfolio"
$publicUrlFile = Join-Path $projectRoot "runtime\public-url.txt"

try {
  $health = Invoke-RestMethod -Uri "http://127.0.0.1:3000/api/health" -TimeoutSec 5
  if ($health.ok -eq $true) {
    Write-Output "Portfolio: ONLINE"
    Write-Output "Assistant: $($health.assistant)"
  } else {
    Write-Output "Portfolio: OFFLINE"
    Write-Output "Assistant: unavailable"
  }
} catch {
  Write-Output "Portfolio: OFFLINE"
  Write-Output "Assistant: unavailable"
}

if (Test-Path -LiteralPath $publicUrlFile) {
  $publicUrl = (Get-Content -LiteralPath $publicUrlFile -Raw).Trim()
  if ($publicUrl -match "^https://[a-z0-9-]+\.trycloudflare\.com$") {
    Write-Output "Tunnel URL: $publicUrl"
  } else {
    Write-Output "Tunnel URL: Tunnel not ready"
  }
} else {
  Write-Output "Tunnel URL: Tunnel not ready"
}
