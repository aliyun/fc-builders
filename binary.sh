#!/bin/bash
set -e

rm -rf node_modules  && npm install

PKG_VERSION=`node -p "require('./package').version"`

## package to binary
pkg -t node8-linux-x64 --out-path -o ./output/fun-install-linux-64 .

## rename and zip output files
cd output

for f in fun-install-*;
do
	filename=fun-install-v${PKG_VERSION}${f##*fun-install}
	mv $f $filename
	zip $filename.zip $filename
	rm $filename
done
