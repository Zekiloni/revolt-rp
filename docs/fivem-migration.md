# FiveM migracija — arhitektonski plan

> Status: **zaključan plan, spreman za izvršenje** (M0 nije započet)
> Obuhvata: migraciju `rage-server` + `rage-client` → FiveM, ujedinjeni API servis, platform-neutralni core

---

## 1. Cilj

- Prelazak sa RageMP-a na FiveM.
- **Core (domen, kernel, perzistencija) potpuno odvojen od platforme** (FiveM/Rage). Kada se pojavi nova platforma (npr. GTA VI multiplayer), integracija = novi `platform-*` adapter, bez izmjena u domenu, kernelu, API-ju ili bazi.
- `rage-server` / `rage-client` paketi služe kao referenca tokom porta i **brišu se na parity** — nema RageMP naslijeđa u finalnom kodu.

## 2. Strategija

- **Čisti portovi od starta** — bez `mp` shim-a, bez facade sloja, bez `rage-rpc` aliasa.
- Port se radi u **wavama po domenu**; svaka wava zamjenjuje rage module i ima acceptance criteria.
- `RageEnums` i GTA V content podaci sele se u `common/gta5` (generisano iz GTA V podataka, ne RageMP oblika).

## 3. Zaključane odluke

| Tema | Odluka |
|---|---|
| Strategija porta | Čisti portovi; RageMP kod je referenca, briše se na parity |
| Resursi | 11 resursa, single-writer po kolekciji (vidi §5) |
| Kernel vs domen | `revolt-core` = kernel binding (session store, gateway); `revolt-player` = domen (account, character, ban, kick, chat, admin) |
| Perzistencija | **MongoDB samo u `api` servisu**; FXServer nikad ne dodiruje bazu |
| Transport game ↔ api | **REST: native HTTP (`PerformHttpRequest`) + JSON** preko HTTPS na privatnoj mreži (VPN). Bez gRPC-a, bez protobuf-a, bez thread-hop-a |
| API oblik | **Per-domen moduli sa CRUD-om** (`/api/property`, `/api/vehicle`, ...) — jedan set ruta za web i game, actor-aware auth |
| Contract | **Zod-first** šeme + izvedeni TS tipovi; OpenAPI export iz šema (za docs/klijente) |
| Write politika | **Hibrid**: write-through za kritično (cash, item transfer, vozila); write-behind queue (100–250 ms) za statistiku/poziciju/health |
| Session store | **S1 write-tracking Proxy** nad `player.character`/`player.account`; vlasnik je `game-kernel` (RAM) |
| Identitet | **`identifiers` mapa (type → {value, label, ...})** + `identifierKeys` unique index; **auto-login na match** vezanog identifiera; claim flow za nove; license-first |
| Konzistencija | `rev` optimistic lock; idempotency ključevi na mutacijama |
| NUI | Prod: Angular build ugrađen u resource (`ui_page 'ui/index.html'`); dev: `ui_page 'http://localhost:4200'` |
| Node runtime | `node_version '22'` u svakom server resource manifestu (fallback Node 16 ako artifact ne podržava) |
| Redoslijed rada | **Infrastruktura prvo**; port wavе po domenu; brisanje rage paketa na parity |

## 4. Arhitektura slojeva

```
PLATFORM-FREE (nula FiveM/Rage importa)
  common/gta5         GTA V content podaci (modeli, hash-evi, komponente) — bivši RageEnums
  core                mongoose modeli + repository interfejsi
  api-contract        zod šeme po domenu + TS tipovi + OpenAPI export
  game-abstraction    portovi: IPlayer, IVehicle, IPed, IObject, IEntity, IBlip,
                      IMarker, ICheckpoint, ICamera, IEvents, IRpc, IInput, INui,
                      IStorage, IWorld, IDimension, ITick, IGame (kurirane grupe native API-ja)
  game-kernel         session store + write-tracking Proxy + write queue + service registry
                      + RPC dispatcher (koristi game-abstraction, nikad platformu direktno)
  api-client          retry/queue/batching/idempotency logika + transport PORT
  *-domain            poslovna logika po domenu (player, inventory, vehicle, ...)
  api (servis)        Express + per-domen moduli + Mongo

PLATFORM ADAPTER
  platform-fivem      implementira SVE portove: nativi, statebags, routing bucket,
                      NUI/DUI, input mapiranje, render tick; daje api-client transport
                      (PerformHttpRequest)

RESOURCE ENTRY (composition root)
  resources/revolt-*  spaja kernel + domen + platform-fivem; fxmanifest
```

### Pravila importa (lint-enforced)

- `common`, `core`, `api-contract`, `game-abstraction`, `game-kernel`, `api-client`, `*-domain`:
  **nula** `@citizenfx/*`, nula nativnih poziva, nula `PerformHttpRequest`.
- Samo `platform-fivem` dodiruje FiveM specifiku.
- `resources/*` su jedini composition root (spajaju domen + platformu).

### Kako izgleda GTA VI (ili bilo koja buduća platforma) port

1. Novi paket `platform-gta6` implementira iste portove (session replikacija, entity model, NUI ekvivalent, input, tick, transport).
2. Resource entry-ji se rebinduju na novi adapter.
3. `api`, Mongo, `core` modeli, `game-kernel`, `*-domain` — **netaknuti**.
4. `platform-fivem` se briše ili zadržava ako FiveM koegzistira.

## 5. Resursi i ownership

| Resource | Uloga | Kolekcije (single writer) |
|---|---|---|
| `revolt-core` | Kernel/gateway: session store + tracking Proxy, persistence gateway (character/account), patch queue, retry, service registry, flush trigeri | — |
| `revolt-player` | Account, character, ban, kick, login/claim, deferral, chat/commands, admin/moderation | `accounts`, `characters`*, `bans`, `kicks` |
| `revolt-inventory` | Itemi, oružja, attachments, phone, radio, boombox, TV item | `items`, `baseitems` |
| `revolt-vehicle` | Vozila, ključevi, garaže, dealership/rent, driving test | `vehicles` |
| `revolt-property` | Property, doors/objects, furniture, stores, DMV | `properties`, `propertyobjects` |
| `revolt-organization` | Organizacije, rankovi, law (warrant, sobriety, records, prison) | org kolekcije |
| `revolt-job` | Job base, sanitation, fishing, garbage | job config |
| `revolt-banking` | Računi, ATM, transakcije, porez, payday | `bankaccounts`, `transactions` |
| `revolt-world` | Weather/time sync, plants, world state | `plants` |
| `revolt-ui` | Jedan Angular NUI (rage-ui) + bridge + focus/cursor | — |
| `revolt-stream` | Asset streaming (game_resources konverzija) | — |

\* `character` dokument piše isključivo kroz `revolt-core` gateway (Proxy → patch → api).

- Svi resursi zavisni od `revolt-core` (fxmanifest `dependency`, core starta prvi).
- Cross-resource race nad karakterom: ownership matrica po poljima + atomske operacije (`$set`/`$inc`/`$push`).

## 6. API servis

Rename: `packages/web-api` → **`packages/api`** (isti proces, isti Mongo, isti `core` modeli).

```
packages/api/src/
  main.ts
  core/                  actor-aware auth, validacija, error format, paginacija, audit
  modules/
    player/       /api/player, /api/character, /api/account, /api/ban, /api/kick
    property/     /api/property
    vehicle/      /api/vehicle
    inventory/    /api/inventory
    organization/ /api/organization
    job/          /api/job
    banking/      /api/banking
    world/        /api/world
    whitelist/    /api/whitelist        (postojeće, ostaje)
    image/, audio-stream/, status/      (postojeće, ostaju)
  assets/, uploads/                     (static, postojeće)
```

Modul = `controller.ts` (rute) + `service.ts` (logika) + validatori (iz `api-contract`).

### CRUD konvencija (svaki modul)

```
GET    /api/property                lista (filter + limit/offset — postojeća konvencija)
GET    /api/property/:id
POST   /api/property                create
PATCH  /api/property/:id            update (rev-locked)
DELETE /api/property/:id
POST   /api/property/:id/<akcija>   domenske akcije (transfer, impound, ...)
POST   /api/character/:id/commit    hot-path patch (rev + now/batched mod)
```

### Auth — jedan set ruta, actor-aware

- Middleware prihvata JWT (user/admin) **ili** service token (game) → `req.actor = { kind: 'user' | 'admin' | 'service', id }`.
- Svaka ruta deklariše dozvoljene aktere (`allowService`, `allowUser`, `allowAdmin` kombinacije).
- Ownership provjere u modul servisu (user samo svoje; service gameplay polja; admin sve).
- CI test: service token nikad ne prolazi na user-only rutama i obrnuto.

### Granica logike

- **Gameplay pravila** (kad/zašto) ostaju u game resursima — real-time odluke.
- **Integritet invarijante** (novac, vlasništvo, item transfer dozvoljenost, rev konflikti, audit) enforce-uju se u `api` modul servisima — zadnja linija odbrane.

## 7. Perzistencija, session cache i write politika

### Tok

```
FXServer (resources/revolt-*)                 api (Express)                MongoDB
  api-client ──HTTPS/JSON──►  /api/<domen> (service token)  ──►  mongoose (core modeli)
  (PerformHttpRequest,                     
   retry, write queue)                     
web-ui ───────────HTTP─────►  /api/<domen> (JWT user/admin)
```

### Session store (RAM-first)

- Connect: 1 API poziv (deferral) → `POST /api/player/session { identifiers }`.
- Character select: 1 API poziv → hydriranje karaktera u session store.
- Tokom igre: **sva čitanja iz RAM-a** (session store), 0 API poziva.
- Mutacije: RAM mirror + dirty tracking (Proxy).
  - Kritično (cash, itemi, vozila): **write-through** — odmah HTTP.
  - Statistika/pozicija/health: **batched flush 100–250 ms** (coalesced patch).
  - Flush trigeri: logout, death, spawn, `onResourceStop`, periodično.
- Cross-resource čitanja: `exports['revolt-core'].session.get(src)` (sync, RAM).
- Nije TTL keš — autoritativna radna kopija dok je igrač online; konzistentnost kroz rev + patch protokol.

### Konflikti (game ↔ web)

- Svaki dokument ima `rev`; commit sa stale rev → api vraća 409 + trenutni dokument.
- Policy: gameplay polja → last-write-wins kroz atomske `$inc`/`$set`; admin/osjetljiva polja (ban, whitelist, account status) → refetch + primijeni pri konfliktu.
- Online refresh flagova: `GET /api/player/:id/flags` (mali payload) na join + periodicno (60 s) + pri osjetljivim akcijama; web ban se primijeni najkasnije za refresh interval, in-game admin akcije rade trenutno.
- **Idempotency-Key** header na svim mutacijama (retry queue mora biti siguran za ponovni poziv).

### RAM budžet (procjena, lean objekti — ne mongoose docovi)

| Keš | Sadržaj | Ukupno @ 1000 online |
|---|---|---|
| Session store (character + account + stats) | samo online | ~50–200 MB |
| Inventory online (~30–80 itema/igrač) | POJO | ~30–80 MB |
| Lookup indeksi (plate→vehId, propertyPos→propId, dnaId, org) | 100–300 B/entitet | < 10 MB |
| Katalozi (baseitemi, modeli, cijene, job config) | statično | 1–10 MB |
| **Ukupno naši keševi** | | **~100–300 MB** |

Pravila:
- Nikad mongoose dokument u keš — hydrirati u POJO.
- Itemi: u RAM-u samo itemi online igrača + world-dropped (spatial/on-demand), ne svi (100k+).
- Vozila: spawnovana/aktivna + garaža po vlasniku on-demand; lookup indeks (plate) minimalan.
- Property: on-demand + lagani indeks (id, pozicija, vlasnik ~200 B) za vrata/kolšejpove.
- Ful-keširanje velikih kolekcija je zabranjeno (procjena: 230–790 MB + GC pritisak).

## 8. Identitet (platform-agnostic)

### Model

```ts
// common
export interface IAccountIdentifier {
  value: string;   // normalizovano (lowercase, bez 'type:' prefiksa)
  label?: string;  // display u trenutku linkovanja (Discord tag, Steam persona)
  linkedAt: Date;
  source?: 'claim' | 'oauth' | 'import' | 'admin' | 'auto';
}

export interface IAccountIdentifiers {
  [type: string]: IAccountIdentifier | undefined;
  // 'license' | 'steam' | 'discord' | 'xbl' | 'live' | 'hwid'
  // legacy: 'socialClub'
  // buduće platforme: 'rockstar', ... — otvoren string, api ne zna platformu
}
```

```ts
// core — Account
identifiers: Record<string, IAccountIdentifier>;   // mapa type → identifikator
identifierKeys: string[];                          // ['license:abc', 'discord:123']; unique multikey index
// legacy polja (socialClubId, socialClubUsername, discordId, discordUsername): required → optional, read-only (audit)
```

Zašto `identifierKeys`: Mongo ne dopušta unique compound index preko dva polja istog array-a; sintetički niz `type:value` sa unique multikey indexom garantuje 1 identifier = 1 account i lookup jednim upitom:

```ts
AccountModel.findOne({ identifierKeys: { $in: ['license:abc', 'discord:123', 'steam:...'] } })
```

Sync `identifierKeys` u `@pre('save')` hook-u i service metodama (add/remove identifier).

### Login tokovi

| Situacija | Ponašanje |
|---|---|
| Match + license vezan | **Auto-login** (bez lozinke) |
| Match, bez trenutnog identifiera | Claim: username/password ili Discord OAuth → vezuju se identifieri |
| Nema matcha | Registracija (username/password/email) → identifieri se vežu automatski |
| Discord OAuth | Lookup po `identifierKeys: 'discord:<id>'`; `label` = tag u trenutku linka |

### Migracija (api skripta, M0)

- `identifiers.socialClub` ← `socialClubId` / `socialClubUsername` (`source: 'import'`)
- `identifiers.discord` ← `discordId` / `discordUsername`
- Generisanje `identifierKeys` za sve accounte.
- Legacy polja ostaju popunjena i read-only; `lastIpAddress` ostaje (audit).
- `serial`: provjeriti upotrebu → `identifiers.serial` ako je identitet, inače audit polje.

### Touchpointi za ažuriranje

- `core`, `common` — model/interface
- `rage-server`: `account.service.ts`, `oauth2.service.ts`, `moderation.service.ts`
- `web-api` → `api`: `service/account.service.ts`
- `web-ui`: `account-overview.component.ts` (prikaz → `identifiers.discord.label`)
- Game: `platform-fivem` adapter skuplja `GetPlayerIdentifiers` → `IPlayerIdentity` port → `POST /api/player/session`

### Sigurnost

- FiveM identifieri su server-verified → spoofing s klijenta nemoguć.
- Unlink/relink identifiera samo kroz web uz re-auth (password ili Discord) + audit; admin može forced unlink.
- Ban se veže na `identifierKeys` (license primarno); alt-detekcija po dijeljenim identifierima.
- Claim sa kredencijalima je jedini put da se identifier doda na postojeći account.

## 9. Komunikacija i UI

- **Service registry u `revolt-core`**: `core.provide('inventory.give', fn, version)` / `core.call(...)` — imenovan, verzionisan, kolizije detektovane u build-u; fizički preko FiveM exports.
- **RPC**: čist tipizirani ugovor (client ↔ server ↔ NUI), correlation ID, timeouti; nema `rage-rpc`.
- **Statebags**: replikacija hot vrijednosti (server → client) — ime, org, job, cuffed, flagovi.
- **Routing bucket**: `dimension` port.
- **NUI**: samo `revolt-ui` ima NUI stranicu; ostali resursi šalju preko globalnog client eventa `revolt:ui:send` → `revolt-ui` prosljeđuje u NUI; callback nazad istim putem.
- **Dev/prod UI**: prod `ui_page 'ui/index.html'` (Angular build u resource); dev `ui_page 'http://localhost:4200'`.
- **DUI** (`CreateDui` + runtime texture) zamjenjuje headless browsere; screenshot pipeline kroz DUI/screenshot-basic.

## 10. Rename lista

- `packages/web-api` → `packages/api` (folder, `project.json`, `package.json`)
- `game-api-contract` → `api-contract`; `game-api-client` → `api-client`
- `.github/workflows/web-api.yml` → `api.yml`
- `packages/web-api/Dockerfile` putanja; `README.md`, `CONTRIBUTING.md` reference
- `web-ui` environmenti: **bez izmjena** (`apiUrl: http://localhost:3000/api`)
- `rage-server` `API_URL` env: ostaje, pokazuje na isti servis
- `.idea/*` — regeneriše se, ignorisati

## 11. Milestones

| M | Deliverable | Acceptance criteria |
|---|---|---|
| **M0** | Dev okruženje (FXServer + Mongo), `api` rename, modul skeleton + actor-aware auth, **vehicle modul end-to-end kao referenca**, `api-contract` v0 (zod), `api-client` (PerformHttpRequest), `game-abstraction` portovi v0, `game-kernel` skeleton, `platform-fivem` primitivi, prazni resursi bootuju | Svi resursi se dižu; vehicle CRUD radi iz igre i web-a |
| **M1** | Vertical slice port na čistim portovima: deferral → login NUI → character select → spawn → HUD/chat; perzistencija kroz `/api/character` commit | Igra se spaja i spawnuje; `cash += x` vidljiv u Mongo |
| **M2** | Wavе 1: player/account/session (claim flow, chat/admin) + inventory + banking; rage moduli brisani; batching/rev/restart resilience | Parity tih modula; servis restart bez posljedica |
| **M3** | Wavе 2: vehicle + property + organization + job | Parity |
| **M4** | Wavе 3: world + UI/HUD + sve preostalo; **`rage-server`/`rage-client` obrisani** | Nula RageMP zavisnosti; feature parity |
| **M5** | `revolt-stream` asseti, deploy (`api` + FXServer), CI, monitoring, platform adapter guide | Produkcija |

## 12. Spikes

| # | Spike | Cilj |
|---|---|---|
| 0 | Session proxy + kernel | Write-tracking Proxy prototip; S2 fallback ako zapne |
| 1 | PerformHttpRequest | Main-thread callback potvrda, latencija, concurrency, keep-alive, TLS + token, idempotency |
| 2 | IGame port dizajn | Semantičke grupe (ne 1:1 native preslikavanje) — prije M1 |
| 3 | render → tick | Draw semantika bez render eventa (bez blokiranja) |
| 4 | Keys mapping | VK kodovi → RegisterKeyMapping + control indeksi (hibrid) |
| 5 | DUI screenshot | Headless → DUI pipeline (green-screen util) |
| 6 | Batching / rev | Latency mjerenje, coalescing, konflikt policy |
| 7 | NUI / Angular routing | Hash routing na `cfx-nui`, dev iframe, focus stack |
| 8 | Memory profiler | 1000 sesija + 100k itema — realni RSS/heap FXServera |

## 13. Rizici

| # | Rizik | Mitigacija |
|---|---|---|
| 1 | Obim porta (16.5k LOC) | Wavе po domenu + AC po wavi + rage kod kao referenca |
| 2 | IGame port površina | Semantičke grupe, spike #2 prije M1 |
| 3 | Shared process blast radius (web restart = game API pauza) | Retry/queue u api-clientu + deploy u mirnom periodu; kasnije opcija dva procesa istog koda |
| 4 | Auth separacija (service vs user) | CI testovi: token nikad na pogrešnoj ruti |
| 5 | Rev konflikti game ↔ web | Optimistic lock + refetch policy po tipu polja |
| 6 | Transport (PerformHttpRequest limiti) | Spike #1; dokumentovan fallback (Node HTTP + tick pump) |
| 7 | Write-behind gubitak (crash/mreža) | Flush trigeri + idempotentni upsert + bounded queue + alert |
| 8 | SPOF api servisa | Supervizija + health; game nastavlja iz RAM-a dok se ne vrati |

## 14. Referentne FiveM činjenice (verifikovano iz docs)

- **Thread affinity**: Node I/O callback-ovi (mongoose, fs, fetch, grpc) izvršavaju se na libuv thread-u; nativi samo na main thread-u ('No current resource manager'). `setImmediate` = hop. **Native HTTP (`PerformHttpRequest`) callback dolazi na main thread → nula hop-ova.**
- **Node 22**: `node_version '22'` u resource manifestu (default 16). Ne mijenja thread affinity.
- **Statebags**: `Player(src).state` / `Entity(e).state` / `GlobalState`; `AddStateBagChangeHandler`; `sv_stateBagStrictMode true`.
- **Routing buckets**: `SetPlayerRoutingBucket` / `SetEntityRoutingBucket` (OneSync, ne legacy). Interijeri se ne rade bucketima.
- **Deferrals**: `playerConnecting` + `deferrals.defer/update/presentCard/done` — async provjere prije ulaska (ban/whitelist/auth).
- **NUI**: `ui_page` može biti **eksterni URL** (dev) ili lokalni fajl (prod); `SendNUIMessage` + `SetNuiFocus`; asset-i preko `cfx-nui-<res>`.
- **DUI**: `CreateDui`, `CreateRuntimeTextureFromDuiHandle`, `SendDuiMessage` — zamjena za headless browsere.
- **JS runtime**: natives kao globalne funkcije (camelCase, `@citizenfx/client|server` tipovi); exports preko `exports.resourceName.exportName`.
