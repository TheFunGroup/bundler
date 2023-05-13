#!/bin/bash
./.platform/hooks/prebuild/yarn.sh
rm -rf node_modules yarn.lock
yarn install
yarn && yarn preprocess

cd localfork && ./setup.sh

# Read entryPointAddress from forkConfig.json
cd ..
entryPointAddress=$(jq -r '.entryPointAddress' ./localfork/forkConfig.json)

# Set the desired port number
port=3000

echo "Running bundler with entryPoint: ${entryPointAddress} on port ${port}"
yarn run bundler --network "http://fun-alchemy-fork-eb-2-dev.us-west-2.elasticbeanstalk.com" --entryPoint "${entryPointAddress}" --port "${port}" --unsafe 2>&1 | tee bundler.log &
# yarn run bundler --network "http://fun-alchemy-fork-eb-2-dev.us-west-2.elasticbeanstalk.com" --entryPoint "0xC7B0261c8e65b1d5fFA2eacd5529E583609c1EdF" --port "3000" --unsafe