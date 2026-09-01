<#
.SYNOPSIS
Starts the EcoPlay backend and frontend on Windows.

.DESCRIPTION
Validates the required tools, optionally installs dependencies and runs checks,
then starts FastAPI on port 8000 and Next.js on port 9000 in separate
PowerShell windows. Press Ctrl+C in this window to stop both services.

.PARAMETER Setup
Installs backend and frontend dependencies from their lockfiles before startup.

.PARAMETER RunChecks
Runs backend tests and frontend type/lint checks before startup.

.PARAMETER ForcePortCleanup
Stops existing processes listening on ports 8000 or 9000 before startup.

.EXAMPLE
.\start-windows.ps1 -Setup -RunChecks

.EXAMPLE
.\start-windows.ps1 -ForcePortCleanup
#>

[CmdletBinding()]
param(
    [switch]$Setup,
    [switch]$RunChecks,
    [switch]$ForcePortCleanup
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendDirectory = Join-Path $repoRoot "backend"
$frontendDirectory = Join-Path $repoRoot "frontend"
$nodeVersionFile = Join-Path $repoRoot ".nvmrc"
$frontendPackageFile = Join-Path $frontendDirectory "package.json"
$frontendEnvironmentFile = Join-Path $frontendDirectory ".env.local"
$backendCredentialFile = Join-Path $backendDirectory "secret\ecoplay.json"

function Write-Step {
    param([Parameter(Mandatory = $true)][string]$Message)

    Write-Host "`n==> $Message" -ForegroundColor Cyan
}

function Assert-CommandAvailable {
    param(
        [Parameter(Mandatory = $true)][string]$Name,
        [Parameter(Mandatory = $true)][string]$InstallHint
    )

    if ($null -eq (Get-Command $Name -ErrorAction SilentlyContinue)) {
        throw "Required command '$Name' was not found. $InstallHint"
    }
}

function Invoke-InDirectory {
    param(
        [Parameter(Mandatory = $true)][string]$Path,
        [Parameter(Mandatory = $true)][scriptblock]$Action
    )

    Push-Location $Path
    try {
        & $Action
        if ($LASTEXITCODE -ne 0) {
            throw "Command failed in '$Path' with exit code $LASTEXITCODE."
        }
    }
    finally {
        Pop-Location
    }
}

function Get-ListeningProcessIds {
    param([Parameter(Mandatory = $true)][int]$Port)

    return @(
        Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue |
            Select-Object -ExpandProperty OwningProcess -Unique
    )
}

function Assert-PortAvailable {
    param(
        [Parameter(Mandatory = $true)][int]$Port,
        [Parameter(Mandatory = $true)][string]$ServiceName
    )

    $listenerProcessIds = @(Get-ListeningProcessIds -Port $Port)
    if ($listenerProcessIds.Count -eq 0) {
        return
    }

    $listenerDescriptions = foreach ($listenerProcessId in $listenerProcessIds) {
        $listenerProcess = Get-Process -Id $listenerProcessId -ErrorAction SilentlyContinue
        if ($null -ne $listenerProcess) {
            "{0} (PID {1})" -f $listenerProcess.ProcessName, $listenerProcessId
        }
        else {
            "PID $listenerProcessId"
        }
    }

    if (-not $ForcePortCleanup) {
        $joinedDescriptions = $listenerDescriptions -join ", "
        throw "Port $Port for $ServiceName is already in use by $joinedDescriptions. Stop it manually or rerun with -ForcePortCleanup."
    }

    foreach ($listenerProcessId in $listenerProcessIds) {
        $listenerProcess = Get-Process -Id $listenerProcessId -ErrorAction SilentlyContinue
        if ($null -ne $listenerProcess) {
            Write-Host "Stopping $($listenerProcess.ProcessName) (PID $listenerProcessId) on port $Port..." -ForegroundColor Yellow
            Stop-Process -Id $listenerProcessId -Force
        }
    }

    Start-Sleep -Milliseconds 500
    if (@(Get-ListeningProcessIds -Port $Port).Count -gt 0) {
        throw "Port $Port could not be released. Try running PowerShell as Administrator."
    }
}

function ConvertTo-PowerShellEncodedCommand {
    param([Parameter(Mandatory = $true)][string]$Command)

    $commandBytes = [System.Text.Encoding]::Unicode.GetBytes($Command)
    return [Convert]::ToBase64String($commandBytes)
}

function ConvertTo-SingleQuotedLiteral {
    param([Parameter(Mandatory = $true)][string]$Value)

    return "'{0}'" -f $Value.Replace("'", "''")
}

function Stop-ProcessTree {
    param([AllowNull()][System.Diagnostics.Process]$Process)

    if ($null -eq $Process) {
        return
    }

    $Process.Refresh()
    if ($Process.HasExited) {
        return
    }

    & taskkill.exe /PID $Process.Id /T /F 2>$null | Out-Null
}

if ([System.Environment]::OSVersion.Platform -ne [System.PlatformID]::Win32NT) {
    throw "start-windows.ps1 must be run on Windows. Use ./start.sh on macOS or Linux."
}

Write-Step "Validating prerequisites"
Assert-CommandAvailable -Name "node" -InstallHint "Install Node.js 22.17.0 (or use nvm-windows)."
Assert-CommandAvailable -Name "pnpm" -InstallHint "Run 'corepack enable' and 'corepack prepare pnpm@10.4.1 --activate'."
Assert-CommandAvailable -Name "uv" -InstallHint "Install uv from https://docs.astral.sh/uv/getting-started/installation/."
Assert-CommandAvailable -Name "Get-NetTCPConnection" -InstallHint "Use Windows PowerShell 5.1 or PowerShell 7 on a supported Windows version."

$expectedNodeVersion = (Get-Content -Raw $nodeVersionFile).Trim()
$activeNodeVersion = (& node --version).Trim().TrimStart("v")
$activeNodeMajorVersion = [int]($activeNodeVersion.Split(".")[0])
if ($activeNodeMajorVersion -ne 22) {
    throw "EcoPlay requires Node.js 22.x, but Node.js $activeNodeVersion is active. The repository pins $expectedNodeVersion in .nvmrc."
}
if ($activeNodeVersion -ne $expectedNodeVersion) {
    Write-Warning "Node.js $activeNodeVersion is active; the repository pins $expectedNodeVersion."
}

$frontendPackage = Get-Content -Raw $frontendPackageFile | ConvertFrom-Json
$expectedPnpmVersion = (($frontendPackage.packageManager -split "\+")[0] -replace "^pnpm@", "")
$activePnpmVersion = (& pnpm --version).Trim()
if ($activePnpmVersion -ne $expectedPnpmVersion) {
    Write-Warning "pnpm $activePnpmVersion is active; the repository pins pnpm $expectedPnpmVersion."
}

Write-Host "Node.js $activeNodeVersion, pnpm $activePnpmVersion, and $(& uv --version) are available."

if ($Setup) {
    Write-Step "Installing locked dependencies"
    Invoke-InDirectory -Path $backendDirectory -Action {
        & uv sync --frozen
    }
    Invoke-InDirectory -Path $frontendDirectory -Action {
        & pnpm install --frozen-lockfile
    }
}
else {
    if (-not (Test-Path (Join-Path $backendDirectory ".venv"))) {
        throw "Backend dependencies are not installed. Rerun with -Setup."
    }
    if (-not (Test-Path (Join-Path $frontendDirectory "node_modules"))) {
        throw "Frontend dependencies are not installed. Rerun with -Setup."
    }
}

if ($RunChecks) {
    Write-Step "Running backend tests"
    Invoke-InDirectory -Path $backendDirectory -Action {
        & uv run pytest
    }

    Write-Step "Running frontend checks"
    Invoke-InDirectory -Path $frontendDirectory -Action {
        & pnpm typecheck
        if ($LASTEXITCODE -ne 0) {
            return
        }
        & pnpm lint
    }
}

if (-not (Test-Path $frontendEnvironmentFile)) {
    throw "Missing frontend\.env.local. Copy frontend\.env.example to frontend\.env.local and fill in the Firebase values before starting EcoPlay."
}
if (-not (Test-Path $backendCredentialFile)) {
    Write-Warning "backend\secret\ecoplay.json was not found. The health endpoint may work, but Firebase-backed features require Application Default Credentials or this local service-account file."
}

Write-Step "Checking service ports"
Assert-PortAvailable -Port 8000 -ServiceName "backend"
Assert-PortAvailable -Port 9000 -ServiceName "frontend"

$currentPowerShellPath = (Get-Process -Id $PID).Path
$backendDirectoryLiteral = ConvertTo-SingleQuotedLiteral -Value $backendDirectory
$frontendDirectoryLiteral = ConvertTo-SingleQuotedLiteral -Value $frontendDirectory

$backendCommand = @"
`$Host.UI.RawUI.WindowTitle = 'EcoPlay Backend'
Set-Location -LiteralPath $backendDirectoryLiteral
`$env:ENVIRONMENT = 'development'
`$env:CORS_ORIGINS = 'http://localhost:9000'
& uv run uvicorn main:app --reload --port 8000
exit `$LASTEXITCODE
"@

$frontendCommand = @"
`$Host.UI.RawUI.WindowTitle = 'EcoPlay Frontend'
Set-Location -LiteralPath $frontendDirectoryLiteral
& pnpm dev
exit `$LASTEXITCODE
"@

$backendProcess = $null
$frontendProcess = $null

try {
    Write-Step "Starting EcoPlay"
    $backendProcess = Start-Process `
        -FilePath $currentPowerShellPath `
        -ArgumentList @(
            "-NoLogo",
            "-NoProfile",
            "-ExecutionPolicy", "Bypass",
            "-EncodedCommand", (ConvertTo-PowerShellEncodedCommand -Command $backendCommand)
        ) `
        -PassThru

    $frontendProcess = Start-Process `
        -FilePath $currentPowerShellPath `
        -ArgumentList @(
            "-NoLogo",
            "-NoProfile",
            "-ExecutionPolicy", "Bypass",
            "-EncodedCommand", (ConvertTo-PowerShellEncodedCommand -Command $frontendCommand)
        ) `
        -PassThru

    Write-Host ""
    Write-Host "EcoPlay is running:" -ForegroundColor Green
    Write-Host "  Backend:  http://localhost:8000"
    Write-Host "  Frontend: http://localhost:9000"
    Write-Host ""
    Write-Host "Press Ctrl+C in this window to stop both services."

    while ($true) {
        Start-Sleep -Seconds 1
        $backendProcess.Refresh()
        $frontendProcess.Refresh()

        if ($backendProcess.HasExited) {
            throw "The backend process exited with code $($backendProcess.ExitCode)."
        }
        if ($frontendProcess.HasExited) {
            throw "The frontend process exited with code $($frontendProcess.ExitCode)."
        }
    }
}
finally {
    Write-Host "`nStopping EcoPlay services..." -ForegroundColor Yellow
    Stop-ProcessTree -Process $frontendProcess
    Stop-ProcessTree -Process $backendProcess
    Write-Host "EcoPlay services stopped."
}
