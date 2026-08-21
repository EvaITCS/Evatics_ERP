# Installs the AWS CLI v2 on Windows. Prefers winget or Chocolatey if
# available; falls back to the official AWS .msi installer otherwise.
#
# Usage (PowerShell, run as Administrator):
#   .\scripts\aws\install\windows.ps1

$ErrorActionPreference = "Stop"

if (Get-Command winget -ErrorAction SilentlyContinue) {
    Write-Host "winget detected - installing AWS CLI via Amazon.AWSCLI."
    winget install --id Amazon.AWSCLI -e --accept-source-agreements --accept-package-agreements
    aws --version
    exit 0
}

if (Get-Command choco -ErrorAction SilentlyContinue) {
    Write-Host "Chocolatey detected - installing AWS CLI."
    choco install awscli -y
    aws --version
    exit 0
}

Write-Host "No package manager found - using the official AWS .msi installer."

$tmpDir = Join-Path $env:TEMP ([System.Guid]::NewGuid().ToString())
New-Item -ItemType Directory -Path $tmpDir | Out-Null

try {
    $msiPath = Join-Path $tmpDir "AWSCLIV2.msi"
    Invoke-WebRequest -Uri "https://awscli.amazonaws.com/AWSCLIV2.msi" -OutFile $msiPath
    Start-Process msiexec.exe -ArgumentList "/i `"$msiPath`" /qn" -Wait
    Write-Host "Installed AWS CLI - restart your terminal for PATH changes to take effect."
    & "$env:ProgramFiles\Amazon\AWSCLIV2\aws.exe" --version
}
finally {
    Remove-Item -Recurse -Force $tmpDir
}
