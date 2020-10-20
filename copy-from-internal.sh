#!/bin/bash

set -e 
set -o pipefail

SRC=../mosaic-website-intern

THIS=`pwd`

cd $SRC
git checkout main
git pull
cd $THIS

#git checkout staging
#git pull
#git reset --hard

rm -rf ./.idea

for DIR in assets config content data layouts resources public scripts static themes
do
    rm -rf ./$DIR
    cp -R $SRC/$DIR ./$DIR
done


git add .
git commit -s -m "Update website from internal repository."
git push

