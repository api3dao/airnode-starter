require('dotenv').config();
const airnodeAdmin = require('@api3/airnode-admin');
const evm = require('../src/evm');
const util = require('../src/util');

async function main() {
  const airnode = await evm.getAirnode();
  const requesterAdminAddress = (await evm.getWallet()).address;
  const requesterIndex = await airnodeAdmin.createRequester(airnode, requesterAdminAddress);
  util.updateLogJson('Requester index', requesterIndex);
  console.log(`Created requester with index ${requesterIndex} and admin address ${requesterAdminAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
