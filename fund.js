const ethers = require('ethers')
const WALLETS = [
    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
];
const main = async () => {
    const provider = new ethers.providers.JsonRpcProvider('http://bundler-eb-dev.us-west-2.elasticbeanstalk.com')
    const result = await provider.send("tenderly_setBalance", [
        WALLETS,
        //amount in wei will be set for all wallets
        ethers.utils.hexValue(ethers.utils.parseUnits("100000000", "ether").toHexString()),
    ]);
    console.log(result)
    const newBalances = await Promise.all(
        WALLETS.map(async (wallet) => ({
            wallet,
            balance: await provider.send("eth_getBalance", [wallet, "latest"]),
        }))
    );

    console.log("New balances", newBalances);
}

main()


