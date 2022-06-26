@echo off
title Generate docs
cls

xcopy ..\..\assets\*.* ..\..\docs\assets\

cls
node transformAfter
pause
cls

echo Successfully generated docs