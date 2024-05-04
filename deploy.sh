#!/bin/bash

export PATH=$PATH:/home/ubuntu/.nvm/versions/node/v20.5.0/bin

cd docollab
git pull origin main
cd server
tsc -b
pm2 kill
pm2 start ./dist/src/index.js
