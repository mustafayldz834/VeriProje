@echo off
echo ============================================
echo VERIPROJE BACKEND SERVER BASLATILIYOR
echo ============================================
echo.

cd /d %~dp0

REM .env dosyası var mı kontrol et
if not exist .env (
    echo UYARI: .env dosyasi bulunamadi!
    echo Lutfen backend klasorunde .env dosyasi olusturun.
    echo .env.example dosyasini referans alabilirsiniz.
    echo.
    pause
)

echo Backend server baslatiliyor...
echo Port: 4000
echo.

npm start

pause

