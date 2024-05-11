FROM node:20

WORKDIR /usr/chat-auth-node/app

RUN apt-get update && apt-get install -y \
    curl \
    git

USER node

CMD ["tail", "-f", "/dev/null"]