require('dotenv').config();
const fs = require('fs');
const evm = require('../src/evm');

async function main() {
  const providerAdminAddress = (await evm.getWallet()).address;
  const config = JSON.parse(fs.readFileSync('./config/config.example.json', 'utf-8'));
  config.nodeSettings.chains[0].providerAdminForRecordCreation = providerAdminAddress;
  config.nodeSettings.chains[0].providers[0].url = process.env.PROVIDER_URL;
  fs.writeFileSync('./config/config.json', JSON.stringify(config, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
