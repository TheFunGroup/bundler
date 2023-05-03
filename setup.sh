#!/bin/bash
./.platform/hooks/prebuild/yarn.sh
yarn && yarn preprocess

cd localfork && ./setup.sh

# Read entryPointAddress from forkConfig.json
cd .. && entryPointAddress=$(jq -r '.entryPointAddress' ./localfork/forkConfig.json)

echo "Running bundler with entryPoint: ${entryPointAddress}"
yarn run bundler --network "https://rpc.tenderly.co/fork/db38d879-8617-4b0c-b142-ba40b41dc776" --entryPoint "${entryPointAddress}" --unsafe 2>&1 | tee bundler.log &
