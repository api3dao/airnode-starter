require('dotenv').config();
const ethers = require('ethers');
const airnodeAdmin = require('airnode-admin');
const evm = require('../src/evm');
const util = require('../src/util');

async function main() {
  const requesterIndex = util.readFromLogJson('Requester index');
  const exampleClientAddress = util.readFromLogJson('ExampleClient address');
  const airnode = new ethers.Contract(evm.airnodeRopstenAddress, evm.AirnodeArtifact.abi, evm.getRopstenWallet());
  await airnodeAdmin.endorseClient(airnode, requesterIndex, exampleClientAddress);
  console.log(`Endorsed ${exampleClientAddress} by requester with index ${requesterIndex}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
