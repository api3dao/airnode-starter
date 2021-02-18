const fs = require('fs');
const ethers = require('ethers');
const airnodeProtocol = require('@api3/airnode-protocol');

if (!process.env.PROVIDER_URL || process.env.PROVIDER_URL === 'https://ropsten.infura.io/v3/{YOUR_KEY}') {
  throw new Error('Missing provider URL in .env');
}

module.exports = {
  getAirnode: async function () {
    const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC);
    const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER_URL);
    const config = JSON.parse(fs.readFileSync('./config/config.json', 'utf-8'));
    const providerChainId = (await provider.getNetwork()).chainId;
    const chain = config.nodeSettings.chains.filter(chain => chain.id == providerChainId)[0];
    return new ethers.Contract(
      chain.contracts.Airnode,
      airnodeProtocol.AirnodeArtifact.abi,
      wallet.connect(provider)
    );
  },
  getWallet: async function () {
    const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC);
    const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER_URL);
    return wallet.connect(provider);
  },
  ExampleClientArtifact: require('../artifacts/contracts/ExampleClient.sol/ExampleClient.json'),
};
