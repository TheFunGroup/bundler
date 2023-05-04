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

npx hardhat node --fork "https://rpc.tenderly.co/fork/613ac0a0-390b-4805-99ab-6f16d528d9b1"
```

## Deploy bundler [in a separate terminal tab]

Starting point: `/bundler`
```
cd localfork 
chmod +x setup.sh
./setup.sh
```

Expected output: 
Should show ```running on http://localhost:3000/rpc``` in terminal