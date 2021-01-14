require('dotenv').config();
const ethers = require('ethers');
const evm = require('../src/evm');
const util = require('../src/util');

async function main() {
  const ExampleClientFactory = new ethers.ContractFactory(
    evm.ExampleClientArtifact.abi,
    evm.ExampleClientArtifact.bytecode,
    await evm.getWallet()
  );
  const exampleClient = await ExampleClientFactory.deploy((await evm.getAirnode()).address);
  await exampleClient.deployed();
  util.updateLogJson('ExampleClient address', exampleClient.address);
  console.log(`ExampleClient deployed at address ${exampleClient.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
