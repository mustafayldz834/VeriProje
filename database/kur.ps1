# VERIPROJE VERITABANI KURULUM SCRIPTI (PowerShell)

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "VERIPROJE VERITABANI KURULUM SCRIPTI" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# SQL Server bilgilerini buraya girin
$SQL_SERVER = "localhost"
$SQL_USER = ""  # Boş bırakılırsa Windows Authentication kullanılır
$SQL_PASSWORD = ""

# Script dosyasının yolu
$SCRIPT_PATH = Join-Path $PSScriptRoot "create_database.sql"

if (-not (Test-Path $SCRIPT_PATH)) {
    Write-Host "HATA: create_database.sql dosyasi bulunamadi!" -ForegroundColor Red
    Write-Host "Lutfen script dosyasinin bu klasorde oldugundan emin olun." -ForegroundColor Red
    pause
    exit 1
}

Write-Host "SQL Server'a baglaniliyor: $SQL_SERVER" -ForegroundColor Yellow
Write-Host ""

# Windows Authentication kullan
if ([string]::IsNullOrEmpty($SQL_USER)) {
    Write-Host "Windows Authentication kullanilarak baglaniliyor..." -ForegroundColor Green
    try {
        sqlcmd -S $SQL_SERVER -E -i $SCRIPT_PATH
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "============================================" -ForegroundColor Green
            Write-Host "VERITABANI BASARIYLA OLUSTURULDU!" -ForegroundColor Green
            Write-Host "============================================" -ForegroundColor Green
        } else {
            Write-Host ""
            Write-Host "============================================" -ForegroundColor Red
            Write-Host "HATA OLUSTU!" -ForegroundColor Red
            Write-Host "============================================" -ForegroundColor Red
        }
    } catch {
        Write-Host "HATA: $_" -ForegroundColor Red
    }
} else {
    Write-Host "SQL Server Authentication kullanilarak baglaniliyor..." -ForegroundColor Green
    try {
        sqlcmd -S $SQL_SERVER -U $SQL_USER -P $SQL_PASSWORD -i $SCRIPT_PATH
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "============================================" -ForegroundColor Green
            Write-Host "VERITABANI BASARIYLA OLUSTURULDU!" -ForegroundColor Green
            Write-Host "============================================" -ForegroundColor Green
        } else {
            Write-Host ""
            Write-Host "============================================" -ForegroundColor Red
            Write-Host "HATA OLUSTU!" -ForegroundColor Red
            Write-Host "============================================" -ForegroundColor Red
        }
    } catch {
        Write-Host "HATA: $_" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Cikmak icin bir tusa basin..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

