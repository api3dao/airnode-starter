const ethers = require('ethers');
const airnodeProtocol = require('@api3/airnode-protocol');

if (
  !process.env.PROVIDER_URL_ROPSTEN ||
  process.env.PROVIDER_URL_ROPSTEN === 'https://ropsten.infura.io/v3/{YOUR_KEY}'
) {
  throw new Error('Missing Ropsten provider URL in .env');
}

module.exports = {
  airnodeRopstenAddress: airnodeProtocol.AirnodeAddresses[3],
  AirnodeArtifact: airnodeProtocol.AirnodeArtifact,
  ExampleClientArtifact: require('../artifacts/contracts/ExampleClient.sol/ExampleClient.json'),
  getRopstenWallet: function () {
    const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC);
    const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER_URL_ROPSTEN);
    return wallet.connect(provider);
  },
};
