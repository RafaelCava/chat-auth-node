#!/bin/bash

npx prisma migrate deploy

node ./dist/src/main/server.js