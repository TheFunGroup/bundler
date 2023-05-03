## How to set up Fork Enviroment

Starting point: `/bundler`

## Install packages

```
yarn && yarn preprocess
```

## Start hardhat fork
```
cd localfork

yarn install 

npx hardhat node --fork "http://fun-alchemy-fork-eb-2-dev.us-west-2.elasticbeanstalk.com"
```

## Deploy bundler [in a separate terminam tab]

Starting point: `/bundler`
```
cd localfork 
chmod +x setup.sh
./setup.sh
```

Expected output: 
Should show ```running on http://localhost:3000/rpc``` in terminal