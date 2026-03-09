# download-from-sharepoint-url: Download a SharePoint/OneDrive file via Graph shares API.
# Resolves URL -> drive item metadata, then downloads /content.

param(
    [Parameter(Mandatory=$true)]
    [string]$SharePointUrl,

    [Parameter(Mandatory=$true)]
    [string]$OutputFile,

    [Parameter(Mandatory=$false)]
    [int]$TimeoutSec = 600
)

$ErrorActionPreference = "Stop"

function Convert-ToGraphShareId {
    param([Parameter(Mandatory=$true)][string]$Url)

    $bytes = [System.Text.Encoding]::UTF8.GetBytes($Url)
    $base64 = [System.Convert]::ToBase64String($bytes)
    $base64Url = $base64.TrimEnd('=').Replace('+', '-').Replace('/', '_')
    return "u!$base64Url"
}

try {
    $azPath = Get-Command az -ErrorAction SilentlyContinue
    if (-not $azPath) {
        Write-Warning "Azure CLI (az) is not installed or not on PATH."
        Write-Warning "Install: https://learn.microsoft.com/cli/azure/install-azure-cli"
        exit 1
    }

    Write-Host "Obtaining Graph API access token..."
    $token = az account get-access-token --resource https://graph.microsoft.com --query accessToken -o tsv 2>&1
    if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($token)) {
        Write-Warning "Failed to obtain access token. Run 'az login' and retry."
        Write-Warning $token
        exit 1
    }

    $headers = @{ "Authorization" = "Bearer $token" }
    $shareId = Convert-ToGraphShareId -Url $SharePointUrl

    $metaUrl = "https://graph.microsoft.com/v1.0/shares/$shareId/driveItem?`$select=id,name,size,parentReference,webUrl"
    Write-Host "Resolving shared item metadata..."
    $meta = Invoke-RestMethod -Uri $metaUrl -Headers $headers -Method GET -TimeoutSec $TimeoutSec

    if (-not $meta.id -or -not $meta.parentReference.driveId) {
        Write-Warning "Unable to resolve driveId/itemId from URL. Ensure this is a file link and you have access."
        exit 1
    }

    $driveId = $meta.parentReference.driveId
    $itemId = $meta.id
    $resolvedName = $meta.name

    $finalOutputPath = $OutputFile
    if (Test-Path $OutputFile -PathType Container) {
        $finalOutputPath = Join-Path $OutputFile $resolvedName
    }

    $outputDir = Split-Path -Parent $finalOutputPath
    if ($outputDir -and -not (Test-Path $outputDir)) {
        New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
    }

    $downloadUrl = "https://graph.microsoft.com/v1.0/drives/$driveId/items/$itemId/content"
    Write-Host "Downloading file content..."
    Write-Host "  Name:   $resolvedName"
    Write-Host "  Drive:  $driveId"
    Write-Host "  Item:   $itemId"
    Write-Host "  Output: $finalOutputPath"

    Invoke-WebRequest -Uri $downloadUrl -Headers $headers -OutFile $finalOutputPath -TimeoutSec $TimeoutSec

    if (-not (Test-Path $finalOutputPath -PathType Leaf)) {
        Write-Warning "Download failed - output file was not created."
        exit 1
    }

    $saved = Get-Item $finalOutputPath
    $sizeMB = [math]::Round($saved.Length / 1MB, 2)

    Write-Host "Download complete: $finalOutputPath ($sizeMB MB)"

    $result = @{
        sourceUrl = $SharePointUrl
        name = $resolvedName
        size = $saved.Length
        driveId = $driveId
        itemId = $itemId
        outputFile = $saved.FullName
        webUrl = $meta.webUrl
    }
    $result | ConvertTo-Json -Compress
    exit 0

} catch {
    Write-Warning "Download failed: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        try {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $errorBody = $reader.ReadToEnd()
            Write-Warning "Response: $errorBody"
        } catch { }
    }
    exit 1
}