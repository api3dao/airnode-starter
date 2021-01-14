require('dotenv').config();
const ethers = require('ethers');
const evm = require('../src/evm');
const util = require('../src/util');

async function main() {
  const amount = '0.1'; // ETH
  const wallet = await evm.getWallet();
  const designatedWalletAddress = util.readFromLogJson('Designated wallet address');
  const receipt = await wallet.sendTransaction({
    to: designatedWalletAddress,
    value: ethers.utils.parseEther(amount),
  });
  function sent() {
    return new Promise((resolve) => wallet.provider.once(receipt.hash, resolve));
  }
  await sent();
  console.log(`Sent ${amount} ETH to the designated wallet with address ${designatedWalletAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
