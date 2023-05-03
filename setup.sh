#!/bin/bash
./.platform/hooks/prebuild/yarn.sh
yarn && yarn preprocess

cd localfork && ./setup.sh

# Read entryPointAddress from forkConfig.json
cd .. && entryPointAddress=$(jq -r '.entryPointAddress' ./localfork/forkConfig.json)

# Set the desired port number
port=3000

echo "Running bundler with entryPoint: ${entryPointAddress} on port ${port}"
yarn run bundler --network "http://fun-alchemy-fork-eb-2-dev.us-west-2.elasticbeanstalk.com" --entryPoint "${entryPointAddress}" --port "${port}" --unsafe 2>&1 | tee bundler.log &
