[CmdletBinding()]
param()

$publicUrlFile = "D:\Portfolio\runtime\public-url.txt"
if (Test-Path -LiteralPath $publicUrlFile) {
  $publicUrl = (Get-Content -LiteralPath $publicUrlFile -Raw).Trim()
  if ($publicUrl -match "^https://[a-z0-9-]+\.trycloudflare\.com$") {
    Write-Output "Portfolio Public URL:"
    Write-Output $publicUrl
    exit 0
  }
}

Write-Output "Portfolio Public URL:"
Write-Output "Tunnel not ready"
