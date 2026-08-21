# Installs Terraform on Windows. Prefers winget, then Chocolatey, if
# available; falls back to downloading the official HashiCorp release zip
# directly and adding it to the current user's PATH.
#
# Usage (PowerShell):
#   .\scripts\terraform\install\windows.ps1 [-Version 1.7.5] [-InstallDir "$env:LOCALAPPDATA\terraform"]
#
# Default version matches infrastructure/terraform/*/versions.tf and
# .github/workflows/terraform.yml.

param(
    [string]$Version = "1.7.5",
    [string]$InstallDir = "$env:LOCALAPPDATA\terraform"
)

$ErrorActionPreference = "Stop"

if (Get-Command winget -ErrorAction SilentlyContinue) {
    Write-Host "winget detected - installing Terraform via Hashicorp.Terraform."
    winget install --id Hashicorp.Terraform -e --accept-source-agreements --accept-package-agreements
    terraform version
    exit 0
}

if (Get-Command choco -ErrorAction SilentlyContinue) {
    Write-Host "Chocolatey detected - installing Terraform."
    choco install terraform --version $Version -y
    terraform version
    exit 0
}

Write-Host "No package manager found - downloading Terraform $Version directly."

$arch = if ([Environment]::Is64BitOperatingSystem) { "amd64" } else { "386" }
$zipName = "terraform_${Version}_windows_${arch}.zip"
$baseUrl = "https://releases.hashicorp.com/terraform/$Version"
$tmpDir = Join-Path $env:TEMP ([System.Guid]::NewGuid().ToString())
New-Item -ItemType Directory -Path $tmpDir | Out-Null

try {
    $zipPath = Join-Path $tmpDir $zipName
    $sumsPath = Join-Path $tmpDir "SHA256SUMS"

    Invoke-WebRequest -Uri "$baseUrl/$zipName" -OutFile $zipPath
    Invoke-WebRequest -Uri "$baseUrl/terraform_${Version}_SHA256SUMS" -OutFile $sumsPath

    Write-Host "Verifying checksum..."
    $expected = (Select-String -Path $sumsPath -Pattern ([regex]::Escape($zipName))).Line.Split(" ")[0]
    $actual = (Get-FileHash -Path $zipPath -Algorithm SHA256).Hash.ToLower()
    if ($expected -ne $actual) {
        throw "Checksum mismatch for ${zipName}: expected $expected, got $actual"
    }

    New-Item -ItemType Directory -Path $InstallDir -Force | Out-Null
    Expand-Archive -Path $zipPath -DestinationPath $InstallDir -Force

    $userPath = [Environment]::GetEnvironmentVariable("Path", "User")
    if ($userPath -notlike "*$InstallDir*") {
        [Environment]::SetEnvironmentVariable("Path", "$userPath;$InstallDir", "User")
        Write-Host "Added $InstallDir to your user PATH - restart your terminal for it to take effect."
    }

    Write-Host "Installed Terraform $Version to $InstallDir"
    & "$InstallDir\terraform.exe" version
}
finally {
    Remove-Item -Recurse -Force $tmpDir
}
