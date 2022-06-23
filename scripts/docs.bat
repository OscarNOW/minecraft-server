@echo off
title Generate docs
cls

cd ..\src\docs\
generate.bat && xcopy ..\..\assets\*.* ..\..\docs\assets\