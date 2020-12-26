require('dotenv').config();
const ethers = require('ethers');
const evm = require('../src/evm');
const util = require('../src/util');

async function main() {
  const ExampleClientFactory = new ethers.ContractFactory(
    evm.ExampleClientArtifact.abi,
    evm.ExampleClientArtifact.bytecode,
    evm.getRopstenWallet()
  );
  const exampleClient = await ExampleClientFactory.deploy(evm.airnodeRopstenAddress);
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
