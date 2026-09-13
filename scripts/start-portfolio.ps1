[CmdletBinding()]
param()

$ErrorActionPreference = "Stop"
$projectRoot = "D:\Portfolio"
$logDirectory = Join-Path $projectRoot "logs"
$startupLog = Join-Path $logDirectory "startup.log"
$stdoutLog = Join-Path $logDirectory "portfolio-out.log"
$stderrLog = Join-Path $logDirectory "portfolio-error.log"

New-Item -ItemType Directory -Force -Path $logDirectory | Out-Null

function Write-StartupLog {
  param([string]$Message)
  Add-Content -LiteralPath $startupLog -Value "$((Get-Date).ToString('o')) [portfolio] $Message"
}

try {
  $health = Invoke-RestMethod -Uri "http://127.0.0.1:3000/api/health" -TimeoutSec 3
  if ($health.ok -eq $true) {
    Write-StartupLog "Already healthy; duplicate start skipped."
    exit 0
  }
} catch {
  # A failed health check is expected when the server has not started yet.
}

$occupied = Get-NetTCPConnection -State Listen -LocalPort 3000 -ErrorAction SilentlyContinue
if ($occupied) {
  Write-StartupLog "Port 3000 is occupied but the portfolio health check failed."
  exit 1
}

$serverEntry = Join-Path $projectRoot "server-dist\index.js"
if (-not (Test-Path -LiteralPath $serverEntry)) {
  Write-StartupLog "Production build is missing. Run npm run build before starting."
  exit 1
}

$nodePath = (Get-Command node -ErrorAction Stop).Source
Set-Location -LiteralPath $projectRoot
Set-Item -Path Env:NODE_ENV -Value "production"
Set-Item -Path Env:OLLAMA_BASE_URL -Value "http://127.0.0.1:11434"
Set-Item -Path Env:OLLAMA_MODEL -Value "qwen3:1.7b"
Set-Item -Path Env:OLLAMA_TIMEOUT_MS -Value "20000"

Write-StartupLog "Starting portfolio on 127.0.0.1:3000."
& $nodePath $serverEntry 1>> $stdoutLog 2>> $stderrLog
$exitCode = $LASTEXITCODE
Write-StartupLog "Portfolio process exited with code $exitCode."
exit $exitCode
