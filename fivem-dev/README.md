# FiveM dev server (revolt-rp)

Ovaj folder je lokalno FXServer okruženje. FXServer binarni artefakti se **ne commituju**.

## Setup (jednokratno)

1. Skini FXServer artefakte (Windows): https://runtime.fivem.net/artifacts/fivem/build_server_windows/master/
2. Raspakuj u ovaj folder tako da postoji `FXServer.exe` (npr. `fivem-dev/FXServer.exe` + `citizen/` itd.)
3. `server.cfg` već sadrži `ensure` linije za revolt resurse i convar-e (`revolt_api_url`, `revolt_service_token`)
4. Postavi `revolt_service_token` na istu vrijednost kao `SERVICE_TOKEN` u `packages/api/.env.development`

## Build i pokretanje

```powershell
# build resursa u dist/fivem + kopija u fivem-dev/resources
npm run fivem:build:dev

# pokreni server
.\FXServer.exe +exec server.cfg
```

## Struktura

```
fivem-dev/
  server.cfg            # konfiguracija servera (ensure, convari)
  resources/            # build output resursa (generisano, ne commitovati sadržaj)
  (FXServer.exe, citizen/, ...)   # artefakti — ručno preuzeti, nisu u gitu
```

## API

Game resursi pričaju sa `api` servisom preko `PerformHttpRequest` (native, main-thread callback — bez thread-hop-a).
Za lokalni rad pokreni `api` (`npx nx serve api`) i Mongo.
