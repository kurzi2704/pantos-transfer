const {transfer} = require('./transfer');
const dotenv = require('dotenv')
dotenv.config()

/**
 * ***************************************************************************************************
 * DEFINE YOUR CONSTANTS HERE
 * ***************************************************************************************************
 */
// this can be automated one day
const SERVICE_NODE_URL = 'https://sn1.testnet.pantos.io';
const SERVICE_NODE_ADDRESS = '0x726265A9e352F2e9f15F255957840992803cED7d';

const SOURCE_CHAIN_ID = 6;
const SOURCE_TOKEN_ADDRESS = '0x5538e600dc919f72858dd4D4F5E4327ec6f2af60';

const DESTINATION_CHAIN_ID = 7;
const DESTINATION_ADDRESS = 'DEFINE YOUR ADDRESS HERE';
const DESTINATION_TOKEN_ADDRESS = '0x5538e600dc919f72858dd4D4F5E4327ec6f2af60';

const QUANTITY = 1;

// PRIVATE_KEY is key from SOURCE_ADDRESS to sign transfers something like '0x12345324234...2342342';
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const SOURCE_ADDRESS = process.env.SOURCE_ADDRESS;

/**
 * ***************************************************************************************************
 * ***************************************************************************************************
 * ***************************************************************************************************
 */



transfer(SERVICE_NODE_URL, SERVICE_NODE_ADDRESS, QUANTITY, SOURCE_CHAIN_ID, SOURCE_ADDRESS,
    SOURCE_TOKEN_ADDRESS, DESTINATION_TOKEN_ADDRESS, DESTINATION_CHAIN_ID, DESTINATION_ADDRESS, PRIVATE_KEY);
