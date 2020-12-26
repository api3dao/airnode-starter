require('dotenv').config();
const ethers = require('ethers');
const airnodeAdmin = require('airnode-admin');
const evm = require('../src/evm');
const parameters = require('../src/parameters');

async function main() {
  const airnode = new ethers.Contract(evm.airnodeRopstenAddress, evm.AirnodeArtifact.abi, evm.getRopstenWallet());
  await airnodeAdmin.updateAuthorizers(airnode, parameters.providerId, parameters.endpointId, [
    ethers.constants.AddressZero,
  ]);
  console.log(`Updated authorizers of endpoint with ID ${parameters.endpointId} to allow all public requests`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
