#!/bin/bash
./.platform/hooks/prebuild/yarn.sh
rm -rf node_modules yarn.lock
yarn install
yarn && yarn preprocess

cd localfork && ./setup.sh

# Read entryPointAddress from forkConfig.json
cd .. && entryPointAddress=$(jq -r '.entryPointAddress' ./localfork/forkConfig.json)
# entryPointAddress=$(jq -r '.entryPointAddress' ./localfork/forkConfig.json)
# Set the desired port number
port=3000
forkUrl=https://fun-alchemy-fork-eb-2-dev.us-west-2.elasticbeanstalk.com

echo "Running bundler with entryPoint: ${entryPointAddress} on port ${port}"
yarn run bundler --network "${forkUrl}" --entryPoint "${entryPointAddress}" --port "${port}" --unsafe 2>&1 | tee bundler.log &