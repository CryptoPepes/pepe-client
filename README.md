# CryptoPepe Client

(See Trello & Telegram for dev status)

This is the client-side code; a React-Babel6-Webpack powered codebase, outputting HTML/JS/CSS.


## Get started

```lang:bash
# Download a ton of deps (React/Webpack/Babel6/more)
npm install

# Start dev server (watches changes, webpack development mode)
npm run start:dev

# Optional: force build
npm run build:dev
```

## Development

1) In the `src/api/api.js` there is a constant that points to the API address,
 one for dev, one for production. Switch this for local development with API dev server.
1) Run `npm run start:dev`, this starts a watcher and compiles automatically.
1) Open browser, `localhost:8080`

## Production

Step 1: run build locally:
```lang:bash
npm run build:prod
```

Step 2: commit changes in `dist-prod` repo. (git-submodule)

Step 3: Ready to deploy, see deploy instructions

Note: The production server consists of two Nginx servers:
 the outer one manages the VHOSTs + letsencrypt for dokku, 
 the inner one is the app with the nginx configuration found in the git-submodule.


## Structure

`src` is were code is written; React components (`src/js/components`) (container/presentationals).

`dist-*` is were webpack outputs its build, `dist-prod/build` for production. `dist-dev/build` for development.
  
`package.json` is were dependencies are added, PLEASE DO NOT BLOAT IT,
 picking dependencies should be done carefully; ask the others on Telegram.

`webpack.development.config.js` is the dev build config, this does rarely change, but can affect a lot.
 Again, discuss before changing. Dev config provides source-maps etc.

`webpack.production.config.js` is the prod build config, this does rarely change, but can affect a lot.
 Again, discuss before changing. Production config optimizes things.

`contracts` is data used by the `src/api/infra.js` file, which loads the web3 bindings.
Generate abi files with: `solc --abi -o contracts/abi my/path/to/contract.sol`.


## Deploy instructions

1) Generate the dist-prod.
1) Push to dist-prod repo
1) Pull into `public` folder of GCF repo.
1) Firebase deploy using GCF repo setup. (Refer to other README)

