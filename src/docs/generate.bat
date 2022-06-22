@echo off
title Generate docs
cls

copy ..\..\index.d.ts .\index.d.ts
copy ..\..\Readme.md .\Readme.md

cd docs
for /F "delims=" %%i in ('dir /b') do (rmdir "%%i" /s/q || del "%%i" /s/q)
cd ..

cls
pause
cls

echo Generating documentation...
typedoc --readme ./Readme.md ./index.d.ts