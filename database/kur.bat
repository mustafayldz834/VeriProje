@echo off
echo ============================================
echo VERIPROJE VERITABANI KURULUM SCRIPTI
echo ============================================
echo.

REM SQL Server bilgilerini buraya girin
set SQL_SERVER=localhost
set SQL_USER=
set SQL_PASSWORD=

REM Windows Authentication kullan
if "%SQL_USER%"=="" (
    echo Windows Authentication kullanilarak baglaniliyor...
    sqlcmd -S %SQL_SERVER% -E -i create_database.sql
) else (
    echo SQL Server Authentication kullanilarak baglaniliyor...
    sqlcmd -S %SQL_SERVER% -U %SQL_USER% -P %SQL_PASSWORD% -i create_database.sql
)

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ============================================
    echo VERITABANI BASARIYLA OLUSTURULDU!
    echo ============================================
) else (
    echo.
    echo ============================================
    echo HATA OLUSTU! Lutfen SQL Server'in calistigindan emin olun.
    echo ============================================
)

pause

