require('dotenv').config();
const ethers = require('ethers');
const airnodeAbi = require('@api3/airnode-abi');
const evm = require('../src/evm');
const util = require('../src/util');
const parameters = require('../src/parameters');

async function main() {
  const coinId = 'ethereum';
  const wallet = await evm.getWallet();
  const exampleClient = new ethers.Contract(
    util.readFromLogJson('ExampleClient address'),
    evm.ExampleClientArtifact.abi,
    wallet
  );
  const airnode = await evm.getAirnode();

  console.log('Making the request...');
  async function makeRequest() {
    const receipt = await exampleClient.makeRequest(
      parameters.providerId,
      parameters.endpointId,
      util.readFromLogJson('Requester index'),
      util.readFromLogJson('Designated wallet address'),
      airnodeAbi.encode([{ name: 'coinId', type: 'bytes32', value: coinId }])
    );
    return new Promise((resolve) =>
      wallet.provider.once(receipt.hash, (tx) => {
        const parsedLog = airnode.interface.parseLog(tx.logs[0]);
        resolve(parsedLog.args.requestId);
      })
    );
  }
  const requestId = await makeRequest();
  console.log(`Made the request with ID ${requestId}.\nWaiting for it to be fulfilled...`);

  function fulfilled(requestId) {
    return new Promise((resolve) =>
      wallet.provider.once(airnode.filters.ClientRequestFulfilled(null, requestId), resolve)
    );
  }
  await fulfilled(requestId);
  console.log('Request fulfilled');
  console.log(`${coinId} price is ${(await exampleClient.fulfilledData(requestId)) / 1e6} USD`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
