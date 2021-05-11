require('dotenv').config();
const fs = require('fs');
const evm = require('../src/evm');

async function main() {
  const airnodeAdmin = (await evm.getWallet()).address;
  const config = JSON.parse(fs.readFileSync('./config/config.example.json', 'utf-8'));
  config[0].chains[0].airnodeAdmin = airnodeAdmin;
  fs.writeFileSync('./config/config.json', JSON.stringify(config, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
