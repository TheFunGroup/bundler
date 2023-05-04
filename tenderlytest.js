const { TENDERLY_USER, TENDERLY_PROJECT, TENDERLY_ACCESS_KEY } = process.env;
const TENDERLY_FORK_API = `https://api.tenderly.co/api/v1/account/pandaxu/project/Project/fork`

const body = {
  "network_id": "1", // network you wish to fork
  "block_number": 14386016,
  "chain_config": {
    "chain_id": 3 // chain_id used in the forked environment
  }
}

const resp = await axios.post(TENDERLY_FORK_API, body, opts);