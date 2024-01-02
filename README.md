## Description

This project serves as DEX backend by wrapping common uniswap functions, like token balance check/ price quote/ swap, as common RESTFUL api. This can also provide functions for cross DEX/CEX arbitrage purpose.


## prerequisite

```bash
1 start your local node by cloning mainnet with ganache
ganache -f [your rpc url, alchemy mainnet url for example] --deterministic

2 change wallet info in src/config/index.ts as you wish
for demo purpose only, there's no need to change anything in the index.ts
```

## Running the app

```bash
# installation
$ yarn

# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```


## try it out

```bash
open swagger  http://localhost:3000/api to try the following functions:
- get token balance
- get token pair price
- deposit weth
- swap tokens
```