# pull-updates.ps1
# Corre este script cuando tus compañeros pusheen cambios a M2 o M3
# Uso: ./pull-updates.ps1

$root = $PSScriptRoot

Write-Host "`n[M2] agentstudio-board — pulling..." -ForegroundColor Cyan
Set-Location "$root\agentstudio-board"
git pull
npm run build

Write-Host "`n[M3] agentstudio-actions — pulling..." -ForegroundColor Cyan
Set-Location "$root\agentstudio-actions"
git pull
npm run build

Write-Host "`n[dist] Copiando archivos compilados a node_modules de M1..." -ForegroundColor Yellow
$nm = "$root\agentstudio-core\node_modules\@agentstudio"
Copy-Item -Path "$root\agentstudio-board\dist\*" -Destination "$nm\board\dist" -Force
Copy-Item -Path "$root\agentstudio-actions\dist\*" -Destination "$nm\actions\dist" -Force

Write-Host "`n[M1] agentstudio-core — pulling..." -ForegroundColor Cyan
Set-Location "$root\agentstudio-core"
git pull

Write-Host "`nTodo listo. Reinicia el dev server si los cambios no aparecen." -ForegroundColor Green
Set-Location $root
