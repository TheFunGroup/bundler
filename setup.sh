#!/bin/bash
./.platform/hooks/prebuild/yarn.sh
rm -rf node_modules yarn.lock
yarn install
yarn && yarn preprocess

cd localfork && ./setup.sh

# Read entryPointAddress from forkConfig.json
cd .. && entryPointAddress=$(jq -r '.entryPointAddress' ./localfork/forkConfig.json)

# Set the desired port number
port=3000

echo "Running bundler with entryPoint: ${entryPointAddress} on port ${port}"
yarn run bundler --network "https://rpc.tenderly.co/fork/613ac0a0-390b-4805-99ab-6f16d528d9b1" --entryPoint "${entryPointAddress}" --port "${port}" --unsafe 2>&1 | tee bundler.log &
