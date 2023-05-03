./.platform/hooks/prebuild/yarn.sh
yarn && yarn preprocess
cd localfork && ./setup.sh