$ErrorActionPreference = "Stop"

$packageRoot = Split-Path -Parent $PSScriptRoot
$repoRoot = Split-Path -Parent (Split-Path -Parent (Split-Path -Parent $packageRoot))
$csvPath = Join-Path $packageRoot "final_review_decision_template_enriched.csv"
if (-not (Test-Path $csvPath)) {
    $csvPath = Join-Path $packageRoot "final_review_decision_template.csv"
}
$scriptPath = Join-Path $repoRoot "scripts\idp_pollution\load_cartographic_decisions.py"

if (-not (Test-Path $csvPath)) {
    throw "Fichier introuvable: $csvPath"
}

if (-not (Test-Path $scriptPath)) {
    throw "Script introuvable: $scriptPath"
}

Write-Host "Verification dry-run du CSV..."
$output = & python $scriptPath --input $csvPath 2>&1
$exitCode = $LASTEXITCODE
$output | ForEach-Object { Write-Host $_ }
if ($exitCode -ne 0) {
    Write-Host ""
    Write-Host "Le CSV contient au moins une decision invalide ou un format incorrect."
    Write-Host "Verifier en priorite :"
    Write-Host "- les valeurs de reviewer_decision"
    Write-Host "- la coherence entre review_bucket et decision"
    Write-Host "- l'absence de modification des autres colonnes"
    exit $exitCode
}
