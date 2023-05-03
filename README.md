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

npx hardhat node --fork "https://rpc.tenderly.co/fork/db38d879-8617-4b0c-b142-ba40b41dc776"
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