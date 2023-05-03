#!/bin/bash
./.platform/hooks/prebuild/yarn.sh
yarn && yarn preprocess

cd localfork && ./setup.sh

# Read entryPointAddress from forkConfig.json
cd .. && entryPointAddress=$(jq -r '.entryPointAddress' ./localfork/forkConfig.json)

echo run bundler --network "http://fun-alchemy-fork-eb-2-dev.us-west-2.elasticbeanstalk.com" --entryPoint "${entryPointAddress}" --unsafe
yarn run bundler --network "http://fun-alchemy-fork-eb-2-dev.us-west-2.elasticbeanstalk.com" --entryPoint "${entryPointAddress}" --unsafe