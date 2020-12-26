const ethers = require('ethers');

if (
  !process.env.PROVIDER_URL_ROPSTEN ||
  process.env.PROVIDER_URL_ROPSTEN === 'https://ropsten.infura.io/v3/{YOUR_KEY}'
) {
  throw new Error('Missing Ropsten provider URL in .env');
}

module.exports = {
  airnodeRopstenAddress: '0xF8d32C3e53F7DA6e7CB82323f2cAB2159776b832',
  AirnodeArtifact: require('../artifacts/airnode-protocol/contracts/Airnode.sol/Airnode.json'),
  ExampleClientArtifact: require('../artifacts/contracts/ExampleClient.sol/ExampleClient.json'),
  getRopstenWallet: function () {
    const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC);
    const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER_URL_ROPSTEN);
    return wallet.connect(provider);
  },
};
