require('dotenv').config();
const airnodeAdmin = require('@api3/airnode-admin');
const evm = require('../src/evm');
const util = require('../src/util');
const parameters = require('../src/parameters');

async function main() {
  const requesterIndex = util.readFromLogJson('Requester index');
  const airnode = await evm.getAirnode();
  const designatedWalletAddress = await airnodeAdmin.deriveDesignatedWallet(
    airnode,
    parameters.providerId,
    requesterIndex
  );
  util.updateLogJson('Designated wallet address', designatedWalletAddress);
  console.log(
    `Derived the address of the wallet designated for requester with index ${requesterIndex} by provider with ID ${parameters.providerId} to be ${designatedWalletAddress}`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
