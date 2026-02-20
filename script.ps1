function Get-Tree {
    param (
        [string]$Path = ".",
        [string[]]$ExcludeDirs = @("node_modules","dist",".git")
    )

    Get-ChildItem -Path $Path | Where-Object {
        ($_.PSIsContainer -and ($ExcludeDirs -notcontains $_.Name)) -or -not $_.PSIsContainer
    } | ForEach-Object {
        if ($_.PSIsContainer) {
            Write-Output $_.FullName.Replace((Get-Location).Path, ".")
            Get-Tree -Path $_.FullName -ExcludeDirs $ExcludeDirs
        }
        else {
            Write-Output $_.FullName.Replace((Get-Location).Path, ".")
        }
    }
}

Get-Tree -Path "." -ExcludeDirs @("node_modules","dist",".git") > arborescence_sans_dossiers_generatifs.txt
