const { docClient } = require('./aws')
const { HARDHAT_FORK_CHAIN_ID, RPC_URL } = require("./ForkUtils")
const axios = require("axios");

// Mapping function to map forkConfig
function mapForkConfig(forkConfig) {
    const requiredFields = [
        "entryPointAddress",
        "factoryAddress",
        "feePercentOracleAddress",
        "verificationAddress",
        "eoaAaveWithdrawAddress",
        "gaslessPaymasterAddress",
        "tokenPriceOracleAddress",
        "paymasterAddress",
        "approveAndExecAddress",
        "tokenSwapAddress",
        "poolFactoryAddress",
        "quoterContractAddress",
        "uniswapV3RouterAddress",
    ];
    console.log("forkConfig: ", forkConfig["entryPointAddress"])
    for (const field of requiredFields) {
        if (!forkConfig[field]) {
            throw new Error(`Error: ${field} is missing or null in forkConfig.`);
        }
    }
    
    return {
        chain: HARDHAT_FORK_CHAIN_ID.toString(),
        aaData: {
            entryPointAddress: forkConfig.entryPointAddress,
            factoryAddress: forkConfig.factoryAddress,
            feeOracle: forkConfig.feePercentOracleAddress,
            verificationAddress: forkConfig.verificationAddress,
        },
        currency: "ETH",
        key: "fun-testnet",
        moduleAddresses: {
            eoaAaveWithdraw: {
                eoaAaveWithdrawAddress: forkConfig.eoaAaveWithdrawAddress,
            },
            paymaster: {
                gaslessSponsorAddress: forkConfig.gaslessPaymasterAddress,
                oracle: forkConfig.tokenPriceOracleAddress,
                tokenSponsorAddress: forkConfig.paymasterAddress,
            },
            tokenSwap: {
                approveAndExecAddress: forkConfig.approveAndExecAddress,
                tokenSwapAddress: forkConfig.tokenSwapAddress,
                univ3factory: forkConfig.poolFactoryAddress,
                univ3quoter: forkConfig.quoterContractAddress,
                univ3router: forkConfig.uniswapV3RouterAddress,
            },
        },
        rpcdata: {
            bundlerUrl: "http://34.221.214.161:3000/rpc",
            rpcUrl: RPC_URL,
        },
    };
}

// Upload the mapped data to DynamoDB
function uploadToDynamoDB(mappedData) {
    const params = {
        TableName: "chain_info",
        Item: mappedData,
    };
    docClient.put(params, (error, data) => {
        if (error) {
            console.error("Error uploading data to DynamoDB:", JSON.stringify(error, null, 2));
        } else {
            console.log("Data uploaded successfully:", JSON.stringify(params, null, 2));
        }
    });
}

async function uploadForkConfig(forkConfig) {
    // Map the forkConfig
    const mappedForkConfig = mapForkConfig(forkConfig);

    // Call the upload function
    uploadToDynamoDB(mappedForkConfig);
}


// Main function to test the script
async function main() {
    let forkConfig;

    try {
        forkConfig = require('./forkConfig.json');
    } catch (error) {
        console.error("Error: forkConfig.json file not found.");
        return;
    }
    await uploadForkConfig(forkConfig);
}
  
main();

module.exports = { uploadForkConfig };