import { BigNumber } from 'ethers'

async function main() {
  console.log(BigNumber.from('0x068d82').toNumber()) // gasUsed: 429442
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});