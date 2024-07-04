# PrintDirectoryWithExclusions.ps1
param (
    [string]$Path = ".",
    [string[]]$ExcludePatterns = @("node_modules", "dist", ".git", ".env", "package-lock.json")
)

function Get-DirectoryTree {
    param (
        [string]$Path,
        [string[]]$ExcludePatterns,
        [string]$Indent = ""
    )

    $items = Get-ChildItem -Path $Path -Force

    foreach ($item in $items) {
        if ($item.PSIsContainer) {
            Write-Output "$Indent|-- $($item.Name)"
            if ($ExcludePatterns -notcontains $item.Name) {
                Get-DirectoryTree -Path $item.FullName -ExcludePatterns $ExcludePatterns -Indent "$Indent|   "
            }
        } else {
            $exclude = $false
            foreach ($pattern in $ExcludePatterns) {
                if ($item.FullName -like "*$pattern*") {
                    $exclude = $true
                    break
                }
            }
            if (-not $exclude) {
                Write-Output "$Indent|-- $($item.Name)"
            }
        }
    }
}

Write-Output $Path
Get-DirectoryTree -Path $Path -ExcludePatterns $ExcludePatterns
