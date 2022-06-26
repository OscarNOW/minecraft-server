@echo off
title Generate docs
cls

xcopy ..\..\assets\*.* ..\..\docs\assets\

cls
node transformAfter
cls

echo Successfully generated docs