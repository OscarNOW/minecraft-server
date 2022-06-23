@echo off
title Generate docs
cls

copy ..\..\index.d.ts .\index.d.ts
copy ..\..\Readme.md .\Readme.md

cd ..
cd ..
cd docs
for /F "delims=" %%i in ('dir /b') do (rmdir "%%i" /s/q || del "%%i" /s/q)
cd ..
cd src
cd docs

cls
node transformBefore
cls

echo Generating documentation...
typedoc ./index.d.ts --readme ./Readme.md --out ../../docs/ --plugin ../../node_modules/typedoc-theme-hierarchy/dist/index.js --theme hierarchy --name "minecraft-server" --disableSources --sort visibility --sort static-first --sort alphabetical --gitRemote origin --hideGenerator