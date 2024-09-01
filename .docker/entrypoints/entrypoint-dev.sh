#!/bin/bash

npm install

npm run build

npx prisma migrate dev

npx prisma generate

git config --global --add safe.directory /usr/chat-auth-node/app

npm run build:compile -- --watch &

npm run start:debug