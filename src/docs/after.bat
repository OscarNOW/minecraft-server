@echo off
title Generate docs
cls

xcopy ..\..\assets\*.* ..\..\docs\assets\
node transformAfter
cls
echo Successfully generated docs