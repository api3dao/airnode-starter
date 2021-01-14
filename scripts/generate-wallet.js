const fs = require('fs');
const ethers = require('ethers');

async function main() {
  const wallet = ethers.Wallet.createRandom();
  fs.writeFileSync(
    '.env',
    `MNEMONIC=${wallet.mnemonic.phrase}\nPROVIDER_URL=https://ropsten.infura.io/v3/{YOUR_KEY}\n`
  );
  console.log('Mnemonic phrase (do not use on mainnet):');
  console.log(wallet.mnemonic.phrase);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
