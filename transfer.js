const axios = require("axios");
const {Web3} = require("web3");
const chainData = require("./Chains.json");
const {ethers} = require("ethers");
const https = require('https');
const hubAbi = require('./hubAbi.json');
const httpsAgent = new https.Agent({keepAlive: true});

exports.transfer = async(serviceNodeUrl, serviceNodeAddress, quantity, decimals, sourceChainId, sourceAddress,
                              sourceTokenAddress, destinationTokenAddress, destinationChainId, destinationAddress,
                              privateKey) => {

    const response = await axios.get(
        `${serviceNodeUrl}/bids?source_blockchain=${sourceChainId}&destination_blockchain=${destinationChainId}`,
        {httpsAgent, headers:{}}
    ).catch((error) => {
        console.log(error);
    });

    const web3 = new Web3(new Web3.providers.HttpProvider(chainData.chains[sourceChainId].url));
    const contract = new web3.eth.Contract(hubAbi.abi, chainData.chains[sourceChainId].hub);
    const forwarder = await contract.methods.getPantosForwarder().call();
    const pantos = await contract.methods.getPantosToken().call();

    if(response.data && Array.isArray(response.data) && response.data.length > 0) {
        const bid = response.data[0];
        const transferQuantity = (quantity * Math.pow(10, decimals)).toString(10);

        const parsedFee = bid.fee;

        let typesValues = {
            types: ["uint256", "address", "address", "address", "uint256", "address", "uint256", "uint256", "uint256", "address", "address", "address"],
            values: [
                sourceChainId,
                web3.utils.toChecksumAddress(sourceAddress),
                web3.utils.toChecksumAddress(destinationAddress),
                web3.utils.toChecksumAddress(sourceTokenAddress),
                transferQuantity,
                web3.utils.toChecksumAddress(serviceNodeAddress),
                parsedFee.toString(10),
                new Date().getTime(),//nonce
                Math.floor((new Date().getTime()) / 1000) + 14400, // valid_until
                web3.utils.toChecksumAddress(chainData.chains[sourceChainId].hub),
                web3.utils.toChecksumAddress(forwarder),
                web3.utils.toChecksumAddress(pantos),
            ]
        }

        if(sourceChainId !== destinationChainId) {
            typesValues = {
                types: ["uint256", "uint256", "address", "string", "address", "string", "uint256", "address", "uint256", "uint256", "uint256", "address", "address", "address"],
                values: [
                    sourceChainId,
                    destinationChainId,
                    web3.utils.toChecksumAddress(sourceAddress),
                    web3.utils.toChecksumAddress(destinationAddress),
                    web3.utils.toChecksumAddress(sourceTokenAddress),
                    web3.utils.toChecksumAddress(destinationTokenAddress),
                    transferQuantity,
                    web3.utils.toChecksumAddress(serviceNodeAddress),
                    parsedFee.toString(10),
                    new Date().getTime(), //nonce
                    Math.floor((new Date().getTime()) / 1000) + 14400, // valid until in seconds
                    web3.utils.toChecksumAddress(chainData.chains[sourceChainId].hub),
                    web3.utils.toChecksumAddress(forwarder),
                    web3.utils.toChecksumAddress(pantos),
                ]
            }
        }
        const signer = await web3.eth.accounts.privateKeyToAccount(privateKey);

        let message = ethers.solidityPackedKeccak256(typesValues.types, typesValues.values);

        let signature = signer.sign(message);
        let data = {
            "source_blockchain_id": sourceChainId,
            "destination_blockchain_id": destinationChainId,
            "sender_address": web3.utils.toChecksumAddress(sourceAddress),
            "recipient_address": web3.utils.toChecksumAddress(destinationAddress),
            "source_token_address": web3.utils.toChecksumAddress(sourceTokenAddress),
            "destination_token_address": web3.utils.toChecksumAddress(destinationTokenAddress),
            "valid_until": sourceChainId === destinationChainId ? typesValues.values[8] : typesValues.values[10],
            "amount": sourceChainId === destinationChainId ? typesValues.values[4] : typesValues.values[6],
            "nonce": sourceChainId === destinationChainId ? typesValues.values[7] : typesValues.values[9],
            "signature": signature.signature,
            "bid": bid
        }
        try {
            const config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `${serviceNodeUrl}/transfer`,
                headers: {
                    'Content-Type': 'application/json',
                },
                data: JSON.stringify(data)
            };
            axios.request(config)
                .then(async (response) => {
                    console.log(`${serviceNodeUrl}/transfer/${response.data.task_id}/status`);
                })
                .catch((error) => {
                    console.log(error);
                });
        }catch(e){
            console.log(e);
        }
    }
}


