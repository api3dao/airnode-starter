require('dotenv').config();
const ethers = require('ethers');
const airnodeAdmin = require('@api3/airnode-admin');
const evm = require('../src/evm');
const util = require('../src/util');

async function main() {
  const wallet = evm.getRopstenWallet();
  const airnode = new ethers.Contract(evm.airnodeRopstenAddress, evm.AirnodeArtifact.abi, wallet);
  const requesterIndex = await airnodeAdmin.createRequester(airnode, wallet.address);
  util.updateLogJson('Requester index', requesterIndex);
  console.log(`Created requester with index ${requesterIndex} and admin address ${wallet.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
