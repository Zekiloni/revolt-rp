FROM docker.io/node:lts-alpine

WORKDIR /app

RUN addgroup --system discord-bot && \
          adduser --system -G discord-bot discord-bot

COPY dist/packages/discord-bot discord-bot/
RUN chown -R discord-bot:discord-bot .

RUN npm --prefix discord-bot --omit=dev -f install

CMD [ "node", "discord-bot" ]
