param(
  [string]$TaskName = "WQDSS_MV_Refresh_6h",
  [string]$PythonExe = "C:\micromamba\envs\sad_backend\python.exe",
  [string]$RepoRoot = "C:\dev\WQDSS\repo_git"
)

$scriptPath = Join-Path $RepoRoot "backend\scripts\refresh_mviews.py"
$note = "scheduled_6h_task"

if (-not (Test-Path $PythonExe)) {
  throw "Python executable not found: $PythonExe"
}
if (-not (Test-Path $scriptPath)) {
  throw "Refresh script not found: $scriptPath"
}

$taskRun = "`"$PythonExe`" `"$scriptPath`" --note $note"

schtasks /Create /F /TN $TaskName /SC HOURLY /MO 6 /TR $taskRun | Out-Null

Write-Output "Scheduled task '$TaskName' registered (every 6 hours)."
Write-Output "Run now: schtasks /Run /TN $TaskName"
