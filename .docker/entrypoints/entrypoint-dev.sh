#!/bin/bash

npm install

npm run build

git config --global --add safe.directory /usr/chat-auth-node/app

npm run start:debug