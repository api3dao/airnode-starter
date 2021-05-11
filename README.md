# Airnode starter

> A starter project for deploying an Airnode and making requests to it

This project is composed of two steps:
1. Deploy an Airnode on a supported chain
1. Make a request to the deployed Airnode in a contract

Currently supported chains:
- Ropsten
- Rinkeby
- Goerli
- Kovan
- xDai
- Fantom

You can skip the first step and use the Airnode that we have deployed on **Ropsten** as well.
You are recommended to read the contents of the scripts as you run them, and read the entire readme before starting.

## Setup

First, you need to create a wallet and fund it.

1. Clone this repo
2. Run the following to install the dependencies
```sh
npm install
```
3. Run the following to build the contracts
```sh
npm run build
```
4. Run the following to generate a wallet, whose mnemonic phrase will be displayed on the terminal and recorded in a `.env` file at the project root.
```sh
npm run generate-wallet
```
5. Install [Metamask](https://metamask.io/) to your web browser
6. Import the mnemonic phrase to Metamask
7. Use the [faucet](https://faucet.metamask.io/) to get some Ropsten ETH, or use any other appropriate source for the chain you will be working on

Then, you need to get a provider URL.
This will be used both by the deployed Airnode and by you while interacting with contracts.
If you will be working on Ropsten:
1. Go to [Infura](https://infura.io/), create an account and get a Ropsten provider URL
2. Replace `https://ropsten.infura.io/v3/{YOUR_KEY}` in your `.env` file with the URL you got from Infura

Adapt the steps above if you will be using another chain.
Note that you can use any other provider or your own node.
However, if you will be deploying your own Airnode, the provider endpoint must be publicly accessible (i.e., `127.0.0.1:8545` will not work).

*(You only need cloud credentials if you will not be skipping Step 1.)*

Follow the [docs](https://docs.api3.org/next/grp-providers/guides/provider/deploying-airnode.html#creating-cloud-credentials) to create your cloud credentials.
Place them at `/config/secrets.env`, similar to [`/config/secrets.example.env`](/config/secrets.example.env).
Do not confuse this `.env` file with the one in the project root that keeps your mnemonic phrase and provider URL.
Also place your mnemonic phrase and provider url here if you already haven't.

**Following these instructions to deploy an Airnode on AWS is [free](https://aws.amazon.com/free/) at the time this is being written.**

## Step 1: Deploy an Airnode

Normally, you would need to do two things before you deploy an Airnode:
1. [Specify the API integration](https://docs.api3.org/next/grp-providers/guides/provider/api-integration.html)
1. [Configure your Airnode](https://docs.api3.org/next/grp-providers/guides/provider/configuring-airnode.html)

For this project, we specified a minimal integration to the popular and free [CoinGecko API](https://www.coingecko.com/en/api), and prepared the configuration files.
We only integrated a single API operation, `GET` for `/coins/{id}`, which you can see below.
The `localization`, `tickers`, `community_data`, `developer_data` and `sparkline` parameters are [fixed](https://docs.api3.org/next/grp-providers/guides/provider/api-integration.html) as `"false"`, while `market_data` is fixed as `"true"`.
The `id` parameter will be provided by the requester (e.g., `"ethereum"`) under the name `coinId`.
You can make test calls over the [CoinGecko API docs](https://www.coingecko.com/en/api) to see the response format.

<p align="center">
  <img src="https://user-images.githubusercontent.com/19530665/103151070-be14ea00-478b-11eb-9608-a967c4282d9f.png" width="1024" />
</p>

See [config.example.json](/config/config.example.json) for how this integration is achieved.
We fixed the [reserved parameters](https://docs.api3.org/next/grp-providers/guides/provider/api-integration.html) to read the value from `market_data.current_price.usd`, cast it as an `int256` and multiply it by `1,000,000` before returning.
No security scheme (i.e., API key) is defined in `config.json` or [`secrets.env`](/config/secrets.example.env) because the CoinGecko API is publicly accessible.

### Customize your `config.json`

Run the following to insert the contents of `.env` to `config/config.example.json` and save it as `config/config.json`
```sh
npm run customize-config
```

### Deploy

Now your `/config` directory should have the required `config.json` and `secrets.env` files.

To deploy the airnode, we first need to setup the airnode deployer from the airnode package.
In a different root directory run the following:

```sh
git clone https://github.com/api3dao/airnode.git
cd airnode
yarn run bootstrap
```

Now copy over the `config.json` and `secrets.env` from airnode-starter over to `packages/deployer/src/config-data` in airnode and run the following in the airnode root directory.

```
yarn run build-all
cd packages/deployer
```
Next we will setup serverless credentials to run the deployer.

```
sls config credentials --provider aws --key $AWS_ACCESS_KEY_ID --secret $AWS_SECRET_KEY
```
Run The following commands to deploy the node

```
yarn run webpack
yarn run webpack:copy-config
yarn run command:deploy:nonstop
```

This will output a receipt file with the extension `receipt.json` copy this over to `/config` inside airnode-starter.

### Fund your master wallet

Run the following to send your master wallet 0.1 ETH for it to [create a airnode record](https://docs.api3.org/next/technology/protocols/request-response/airnode.html#creating-an-airnode-record) for you on-chain.
```sh
npm run fund-master-wallet
```

Your deployed Airnode will use these funds to make the transaction that will create the provider record on the chain you are operating on, and send the leftover ETH back to your address automatically.
**You will have to wait ~1 minute for this to happen, otherwise the next step will fail.**

## Step 2: Make a request

The scripts in this step will use the Airnode you have deployed if you have completed Step 1.
Otherwise, it will use the `airnodeId` of the Airnode that we have deployed given in [`parameters.js`](/src/parameters.js).
Note that the `endpointId` will be the same either way because it is [derived from the OIS and endpoint name](https://api3dao.github.io/api3-docs/pre-alpha/protocols/request-response/endpoint.html#endpointid).


Inside the airnode repo run the following commands to install the admin package
```
cd packages/admin
npm install -g
```

also install the protocol package
```
cd packages/protocol
npm install -g
```

your package list should look like the following:

```
$ npm ls -g --depth=0
/home/username/.nvm/versions/node/v12.13.1/lib
├── @airnode/admin@0.1.0 -> .../airnode/packages/admin
├── @airnode/protocol@0.1.0 -> .../airnode/packages/protocol
```

Now head back to the airnode-starter repo, we need to link the protocol package in the global node_modules to airnode-starter
```
npm link @airnode/protocol
```

### Create a requester

Run the following to create an on-chain [requester](https://docs.api3.org/next/technology/protocols/request-response/requester.html) record:

The `requesterAdmin` can be found from `receipt.json` under the key `airnodeAdmin`

```sh
admin create-requester \
    --providerUrl https://ropsten.infura.io/v3/<key>  \
    --mnemonic "nature about salad..."  \
    --requesterAdmin 0xe97301...
```

Note down your requester index because you will be using it in future interactions.

You can use this requester denoted with an index in other projects as well.
Note that `requesterIndex` is chain-specific, so you will have to create another requester record on other chains.


### Set Requester Admin 

Run the following to set the [requester Admin](https://github.com/api3dao/api3-docs/blob/master/request-response-protocol/requester.md#requesteradmin)

```sh
admin set-requester-admin \
    --providerUrl https://ropsten.infura.io/v3/<key>  \
    --mnemonic "nature about salad..."  \
    --requesterIndex 8  \
    --requesterAdmin 0xe97301...
```

### Deploy the client contract

Run the following in the airnode-starter repo to deploy `ExampleClient.sol`:
```sh
npm run deploy-client
```

### Endorse the client

Run the following to [endorse](https://docs.api3.org/next/technology/protocols/request-response/endorsement.html) your deployed [client](https://docs.api3.org/next/technology/protocols/request-response/client.html) contract using the requester you have created. 

The `clientAddress` is the address of the contract you deployed above.

```sh
admin endorse-client
  --providerUrl https://ropsten.infura.io/v3/<key>  \
  --mnemonic "nature about salad..."  \    
  --requesterIndex 8  \
  --clientAddress 0x0aEC3...
```

### Derive and fund the designated wallet

First run the following to derive the [designated wallet](https://docs.api3.org/next/technology/protocols/request-response/designated-wallet.html) for the provider–requester pair.

The airnodeId can be found in the `receipt.json`

```sh
admin derive-designated-wallet 
    --providerUrl https://ropsten.infura.io/v3/<key>  \
    --airnodeRrp 0xF6d2675468989387e96127546e0CBC9A384fa418  
    --airnodeId 0xb0b226...  
    --requesterIndex 8
```
copy the address in the terminal and then go back to airnode-starter. In `log.json` paste the address and requesterIndex like so:
```
{
    "ExampleClient address": "0xb61dA..........",
    "Designated wallet address": "<YOUR-COPIED_ADDRESS>",
    "Requester index": <YOUR_COPIED_INDEX>
}
```

and then fund this designated wallet with 0.1 ETH:
```sh
npm run fund-designated-wallet
```

The requests that the client contract will make will be funded by this 0.1 ETH.
Note that you may have to run `fund-designated-wallet` again if you make too many requests and use up this 0.1 ETH (very unlikely).

### Make a request

Run the following to make a request:
```
npm run make-request
```
which should be fulfilled by the Airnode and printed out on the terminal.
Note that now that the price is on-chain, you can use it in your contract to implement any arbitrary logic.

Try replacing the `coinId` value in [`make-request.js`](/scripts/make-request.js) from `"ethereum"` to `"bitcoin"` and make another request.
You can see the API docs to find out which coin IDs are supported.

## Conclusion

You deployed an Airnode, made a request to it and received the response at the contract.
If you want to learn more, see the following resources:

- [API3 whitepaper](https://github.com/api3dao/api3-whitepaper) will give you a broad overview of the project
- [Medium posts](https://api3dao.github.io/api3-docs/pages/medium.html) are a more digestible version of the whitepaper
- [API3 docs](https://api3dao.github.io/api3-docs/pre-alpha/) will provide you with the theory of how Airnode and its protocol works
- [@api3/airnode-admin](https://github.com/api3dao/airnode/tree/pre-alpha/packages/admin) lets you interact with the Airnode contract (to create a request, endorse a client, etc.) using a CLI tool
- [Airnode client examples](https://github.com/api3dao/airnode-client-examples) demonstrate different request patterns that the Airnode protocol supports (for example, we used a full request in this starter project)

## Taking down your Airnode

Inside the airnode repo, run the following:

```
cd packages/deployer
yarn run command:remove-with-receipt
```

Make sure to also remove the globally installed packages.

```
cd packages/admin
npm uninstall -g
```

```
cd packages/protocol
npm uninstall -g
```

<!-- It is very unlikely for you to forget to take down your Airnode because it is designed to be *set-and-forget*.
When you are done with this project, go to `config/` as your working directory and use the command below where `$RECEIPT_FILENAME` is replaced with the name of your receipt file ending with `.receipt.json` (you can refer to our [Docker instructions](https://github.com/api3dao/airnode/blob/pre-alpha/Docker.md) for more information)

```sh
docker run -it --rm \
  --env-file .env \
  --env COMMAND=remove-with-receipt \
  --env RECEIPT_FILENAME=$RECEIPT_FILENAME \
  -v $(pwd):/airnode/out \
  api3/airnode-deployer:pre-alpha
``` -->

# TODO

- Update ExampleClient to use the updated [Request Response Protocol](https://github.com/api3dao/airnode/blob/master/packages/protocol/contracts/AirnodeRrpClient.sol) once it has been published in the npm directory.
