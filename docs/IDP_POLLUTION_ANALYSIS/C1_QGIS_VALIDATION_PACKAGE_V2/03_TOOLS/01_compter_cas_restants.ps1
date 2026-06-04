$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$csvPath = Join-Path $root "final_review_decision_template_enriched.csv"
if (-not (Test-Path $csvPath)) {
    $csvPath = Join-Path $root "final_review_decision_template.csv"
}

if (-not (Test-Path $csvPath)) {
    throw "Fichier introuvable: $csvPath"
}

$rows = Import-Csv $csvPath
$remaining = @($rows | Where-Object { [string]::IsNullOrWhiteSpace($_.reviewer_decision) }).Count
$done = @($rows | Where-Object { -not [string]::IsNullOrWhiteSpace($_.reviewer_decision) }).Count

Write-Host "total=$($rows.Count)"
Write-Host "traite=$done"
Write-Host "restant=$remaining"
