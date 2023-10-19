# Pantos Transfer Automation Script

## Setup
### Requirements
* latest Node.js version https://nodejs.org/en
* private key of a wallet with Pantos or any other PANDAS asset
### Instructions
* Copy `.env.example` to `.env`
* Enter `PRIVATE_KEY` and `SOURCE_ADDRESS` in `.env` file
* Enter all values in `index.js`
  * `SERVICE_NODE_URL` = a list of all service node URLs can be found at [panscan.info](https://testnet.panscan.info/chains)
  * `SERVICE_NODE_ADDRESS` = a list of all service node addresses can be found at [panscan.info](https://testnet.panscan.info/chains)
  * `SOURCE_CHAIN_ID` = can be found [here](#chains)
  * `SOURCE_TOKEN_ADDRESS` = the address of the token on your given source chain
  * `DESTINATION_CHAIN_ID` = can be found [here](#chains)
  * `DESTINATION_ADDRESS` = the address, where you want to transfer your assets to
  * `DESTINATION_TOKEN_ADDRESS` = the address of the token on your given destination chain
* run `npm install`
* run `npm start` which initiates the transfer

### Chains
Currently, Pantos supports 7 different chains:

| Chain                     | ID |
|---------------------------|----|
| Ethereum (ETH)            | 0  |
| Binance Smart Chain (BSC) | 1  |
| Avalanche (AVAX)          | 3  |
| Polygon                   | 5  |
| Cronos (CRO)              | 6  |
| Fantom (FTM)              | 7  |
| Celo                      | 8  |

