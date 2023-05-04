const { ethers } = require("hardhat")
const fs = require("fs");

const { ContractFactory } = ethers
const { FunWallet, FunWalletConfig } = require('@fun-wallet/sdk')
const { TokenSwap, TokenTransfer } = require("@fun-wallet/sdk").Modules
const CryptoJS = require("crypto-js")

const { HARDHAT_FORK_CHAIN_ID, API_KEY, RPC_URL, PRIV_KEY, PKEY, AVAX_RPC_URL, USDC_ADDR, CHAINLINK_TOKEN_AGGREGATOR_ADDRESS, logUserPaymasterBalance, timeout, transferAmt } = require("./ForkUtils")

const ERC20 = require("./abis/ERC20.json")
const entryPoint = require("./abis/EntryPoint.json")
const authContract = require("./abis/UserAuthentication.json")
const aaveWithdraw = require("./abis/AaveWithdraw.json")
const approveAndSwap = require("./abis/ApproveAndSwap.json")
const factory = require("./abis/FunWalletFactory.json")
const paymasterdata = require("./abis/TokenPaymaster.json")
const priceOracle = require("./abis/TokenPriceOracle.json")
const approveAndExec = require("./abis/ApproveAndExec.json")
const gaslessPaymaster = require("./abis/GaslessPaymaster.json")
const feePercentOracle = require("./abis/FeePercentOracle.json")

const ROUTER_ADDR = "0xE592427A0AEce92De3Edee1F18E0157C05861564"
const WETH_MAINNET = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"

const PREFUND_AMT = 0.3
const USDCETHAMT = ethers.utils.parseUnits((1600 * 10).toString(), 6)

const forkConfigPath = "./forkConfig.json"

const generateSha256 = (action) => {
    return CryptoJS.SHA256(JSON.stringify(action)).toString(CryptoJS.enc.Hex)
}


// -b
const generateBundlerCallScript = () => {
    const entryPointAddress = require(forkConfigPath).entryPointAddress
    console.log(`yarn run bundler --network ${RPC_URL} --entryPoint "${entryPointAddress}" --unsafe`)

}

// -d
const deployForFork = async () => {
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL)
    const wallet = new ethers.Wallet(PKEY, provider)
    await loadNetwork(wallet)
}

const loadNetwork = async (wallet) => {
    const entryPointAddress = await deployEntryPoint(wallet)
    console.log(`const entryPointAddress = "${entryPointAddress}"`)
    await timeout(1000)

    const verificationAddress = await deployAuthContract(wallet)
    console.log(`const verificationAddr = "${verificationAddress}"`)
    await timeout(1000)

    const factoryAddress = await deployFactory(wallet)
    console.log(`const factoryAddress = "${factoryAddress}"`)
    await timeout(1000)

    const tokenSwapAddress = await deployApproveAndSwap(wallet)
    console.log(`const tokenSwapAddress = "${tokenSwapAddress}"`)
    await timeout(1000)

    const tokenPriceOracleAddress = await deployPriceOracle(wallet)
    console.log(`const tokenPriceOracleAddress = "${tokenPriceOracleAddress}"`)
    await timeout(1000)

    const approveAndExecAddress = await deployApproveAndExec(wallet)
    console.log(`const approveAndExecAddress = "${approveAndExecAddress}"`)
    await timeout(1000)

    const gaslessPaymasterAddress = await deployGaslessPaymaster(wallet, entryPointAddress)
    console.log(`const gaslessPaymasterAddress = "${gaslessPaymasterAddress}"`)
    await timeout(1000)

    const feePercentOracleAddress = await deployfeePercentOracle(wallet)
    console.log(`const feePercentOracleAddress = "${feePercentOracleAddress}"`)
    await timeout(1000)

    const eoaAaveWithdrawAddress = await deployAaveWithdraw(wallet)
    console.log(`const eoaAaveWithdrawAddress = "${eoaAaveWithdrawAddress}"`)

    const poolFactoryAddress = "0x1F98431c8aD98523631AE4a59f267346ea31F984"
    const quoterContractAddress = "0x61fFE014bA17989E743c5F6cB21bF9697530B21e"
    const uniswapV3RouterAddress = "0xE592427A0AEce92De3Edee1F18E0157C05861564"

    const config = {
        entryPointAddress,
        verificationAddress,
        factoryAddress,
        tokenSwapAddress,
        poolFactoryAddress,
        quoterContractAddress,
        uniswapV3RouterAddress,
        tokenPriceOracleAddress,
        approveAndExecAddress,
        gaslessPaymasterAddress,
        feePercentOracleAddress,
        eoaAaveWithdrawAddress
    }
    fs.writeFileSync(forkConfigPath, JSON.stringify(config))
}

// -dp
const deployFullPaymaster = async () => {
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL)
    const wallet = new ethers.Wallet(PKEY, provider)

    const token = USDC_ADDR;
    const aggregator = CHAINLINK_TOKEN_AGGREGATOR_ADDRESS;
    const entryPointAddress = require(forkConfigPath).entryPointAddress
    const tokenPriceOracleAddress = require(forkConfigPath).tokenPriceOracleAddress
    const params = [entryPointAddress]

    const paymasterAddress = await deployPaymaster(wallet, params)
    console.log(`const paymasterAddress = "${paymasterAddress}"`)
    await timeout(1000)

    const olddata = require(forkConfigPath)
    const forkConfig = { ...olddata, tokenPriceOracleAddress, paymasterAddress }

    fs.writeFileSync(forkConfigPath, JSON.stringify(forkConfig))
}


const deploy = async (signer, obj, params = []) => {
    const factory = new ContractFactory(obj.abi, obj.bytecode, signer);
    const contract = await factory.deploy(...params);
    return contract.address
}

const deployEntryPoint = (signer) => {
    return deploy(signer, entryPoint)
}

const deployAuthContract = (signer) => {
    return deploy(signer, authContract)
}

const deployAaveWithdraw = (signer) => {
    return deploy(signer, aaveWithdraw)
}

const deployApproveAndSwap = (signer) => {
    return deploy(signer, approveAndSwap, [WETH_MAINNET])
}

const deployFactory = (signer) => {
    return deploy(signer, factory)
}

const deployPaymaster = (signer, params) => {
    return deploy(signer, paymasterdata, params)
}

const deployPriceOracle = (signer) => {
    return deploy(signer, priceOracle)
}

const deployApproveAndExec = (signer) => {
    return deploy(signer, approveAndExec)
}

const deployGaslessPaymaster = (signer, params) => {
    return deploy(signer, gaslessPaymaster, [params])
}

const deployfeePercentOracle = (signer) => {
    return deploy(signer, feePercentOracle)
}

// -da
const deployForAvax = async () => {
    const provider = new ethers.providers.JsonRpcProvider(AVAX_RPC_URL)
    const wallet = new ethers.Wallet(PRIV_KEY, provider)
    await loadNetwork(wallet)
}

// -sp
const setupPaymaster = async () => {
    const paymasterAddr = require(forkConfigPath).paymasterAddress
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL)
    const eoa = new ethers.Wallet(PRIV_KEY, provider)
    const walletConfig = new FunWalletConfig(eoa, HARDHAT_FORK_CHAIN_ID, API_KEY, PREFUND_AMT, "", "caleb")
    const wallet = new FunWallet(walletConfig)
    await wallet.init()
    await getUsdcWallet(wallet, amount)
    await walletTransferERC(wallet, eoa.address, USDCETHAMT, USDC_ADDR)
    await fundUserUSDCPaymaster(eoa, paymasterAddr, wallet.address, amount)
    await fundPaymasterEth(eoa, paymasterAddr, amount)
}

const getBalance = async (wallet) => {
    const balance = await wallet.provider.getBalance(wallet.address);
    return ethers.utils.formatUnits(balance, 18)
}

const createErc = (addr, provider) => {
    return new ethers.Contract(addr, ERC20.abi, provider)
}

const getUserBalanceErc = async (sender, addr) => {
    const contract = createErc(addr, sender.provider)
    const decimals = await contract.decimals()
    const balance = await contract.balanceOf(sender.address)
    return ethers.utils.formatUnits(balance, decimals)
}

const getUsdcWallet = async (wallet, amount = 10) => {
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL)
    const funder = new ethers.Wallet(PKEY, provider)
    const swapModule = new TokenSwap(ROUTER_ADDR)
    await wallet.addModule(swapModule)
    await wallet.deploy()

    await transferAmt(funder, wallet.address, amount)
    const USDCETHAMT = ethers.utils.parseUnits((1600 * amount).toString(), 6)
    console.log("Wallet Eth Start Balance: ", await getBalance(wallet))

    const startWalletDAI = await getUserBalanceErc(wallet, USDC_ADDR)

    const tokenIn = { type: TokenTypes.ETH, symbol: "weth", chainId: HARDHAT_FORK_CHAIN_ID }
    const tokenOut = { type: TokenTypes.ERC20, address: USDC_ADDR }
    const tx = await swapModule.createSwapTx(tokenIn, tokenOut, amount, wallet.address, 5, 100)
    await wallet.deployTx(tx)

    const endWalletDAI = await getUserBalanceErc(wallet, USDC_ADDR)

    console.log("swapped for ", (endWalletDAI - startWalletDAI), " USDC")
}

const walletTransferERC = async (wallet, to, amount, tokenAddr) => {
    const transfer = new TokenTransfer()
    const start = await getUserBalanceErc(wallet, tokenAddr)
    console.log("Starting Wallet ERC Amount: ", start)
    await wallet.addModule(transfer)
    const transferActionTx = await transfer.createTransferTx(to, amount, { address: tokenAddr })
    await wallet.deployTx(transferActionTx)
    const end = await getUserBalanceErc(wallet, tokenAddr)
    console.log("End Wallet ERC Amount: ", end)
}

const loadPaymaster = (address, provider) => {
    return new ethers.Contract(address, paymasterdata.abi, provider)
}

const execContractFunc = async (eoa, data) => {
    const tx = await eoa.sendTransaction(data)
    return await tx.wait()
}

const fundUserUSDCPaymaster = async (eoa, paymasterAddr, walletaddr, amount) => {
    const usdcContract = createErc(USDC_ADDR, eoa)
    const paymasterContract = loadPaymaster(paymasterAddr, eoa)
    const approvedata = await usdcContract.populateTransaction.approve(paymasterAddr, USDCETHAMT)
    const depositData = await paymasterContract.populateTransaction.addDepositFor(walletaddr, USDCETHAMT)

    await execContractFunc(eoa, approvedata)
    await execContractFunc(eoa, depositData)
    await logUserPaymasterBalance(paymasterContract, walletaddr)
}

const fundPaymasterEth = async (eoa, paymasterAddr, value) => {
    const paymasterContract = loadPaymaster(paymasterAddr, eoa)

    const depositData = await paymasterContract.populateTransaction.deposit()
    const tx = { ...depositData, value: ethers.utils.parseEther(value.toString()) }
    await execContractFunc(eoa, tx)

    const postBalance = await paymasterContract.getDeposit()
    console.log("paymasterBalance: ", postBalance.toString())
}


// -l
const loadAbis = () => {
    const entryPointPath = "eip-4337/EntryPoint.sol/EntryPoint.json"
    const authContractPath = "validations/UserAuthentication.sol/UserAuthentication.json"
    const approveAndSwapPath = "modules/actions/ApproveAndSwap.sol/ApproveAndSwap.json"
    const aaveWithdrawPath = "modules/actions/AaveWithdraw.sol/AaveWithdraw.json"
    const factoryPath = "deployer/FunWalletFactory.sol/FunWalletFactory.json"
    const walletPath = "FunWallet.sol/FunWallet.json"
    const tokenPaymasterpath = "paymaster/TokenPaymaster.sol/TokenPaymaster.json"
    const gaslessPaymasterpath = "paymaster/GaslessPaymaster.sol/GaslessPaymaster.json"
    const tokenOracle = "oracles/TokenPriceOracle.sol/TokenPriceOracle.json"
    const feePercentOracle = "oracles/FeePercentOracle.sol/FeePercentOracle.json"
    const module = "modules/Module.sol/Module.json"
    const approveAndExec = "modules/actions/ApproveAndExec.sol/ApproveAndExec.json"
    const abis = [entryPointPath, authContractPath, approveAndSwapPath, factoryPath, walletPath, tokenPaymasterpath, gaslessPaymasterpath, tokenOracle, aaveWithdrawPath, feePercentOracle, module, approveAndExec]

    abis.forEach(moveFile)
}

const moveFile = (path) => {
    const dirs = Array.from(path.split("/"))
    const fileName = dirs.at(-1)
    const newPath = `./abis/${fileName}`
    const basePath = "../../fun-wallet-smart-contract/artifacts/contracts/"
    try {
        const data = require(basePath + path)
        let olddata;
        olddata = require(newPath)
        const fileHash = generateSha256(data.bytecode)
        if (olddata.fileHash == fileHash) {
            return;
        }
        fs.writeFileSync(newPath, JSON.stringify({ ...data, fileHash }))
        console.log("SUCCESS: ", fileName)
    }
    catch (e) {
        console.log(e)
        console.log("ERROR: ", fileName)
    }
}

// default
const main = async () => {

    const provider = new ethers.providers.JsonRpcProvider(RPC_URL)
    const wallet = new ethers.Wallet(PKEY, provider)
    const aaveWithdrawAddress = await deployAaveWithdraw(wallet)
    console.log(`const aaveWithdrawAddress = "${aaveWithdrawAddress}"`)
    const olddata = require(forkConfigPath)
    fs.writeFileSync(forkConfigPath, JSON.stringify({ ...olddata, aaveWithdrawAddress }))
}

if (typeof require !== 'undefined' && require.main === module) {

    switch (process.argv[2]) {
        case "-b": {
            generateBundlerCallScript()
            return;
        }
        case "-l": {
            loadAbis();
            return;
        }
        case "-d": {
            deployForFork();
            return;
        }
        case "-da": {
            deployForAvax();
            return;
        }
        case "-sp": {
            setupPaymaster();
            return;
        }
        case "-dp": {
            deployFullPaymaster();
            return;
        }
        default: {
            main()
        }
    }
}