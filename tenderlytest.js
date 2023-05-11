const { TENDERLY_USER, TENDERLY_PROJECT, TENDERLY_ACCESS_KEY } = process.env;
const TENDERLY_FORK_API = `https://api.tenderly.co/api/v1/account/pandaxu/project/Project/fork`
const { 
  HARDHAT_FORK_CHAIN_ID
} = require("./localfork/ForkUtils")

const body = {
  "network_id": "1", // network you wish to fork
  "chain_config": {
    "chain_id": HARDHAT_FORK_CHAIN_ID // chain_id used in the forked environment
  }
}

async function fork() {
  try {
    const resp = await axios.post(TENDERLY_FORK_API, body, opts);
    console.log(resp.data);
  } catch (error) {
    console.error(error);
  }
}

fork();