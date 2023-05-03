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

npx hardhat node --fork "https://rpc.tenderly.co/fork/b7bee232-6e3a-4b60-9ed0-6cf92a3296ed"
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