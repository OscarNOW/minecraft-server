@echo off
title Generate docs
cls

xcopy ..\..\assets\*.* ..\..\docs\assets\ /E /H /C /I

cls
node transformAfter
cls

echo Successfully generated docs