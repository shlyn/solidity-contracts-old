import { BigNumber, ethers } from 'ethers'

async function main() {
  console.log("0x".concat(ethers.utils.keccak256(ethers.utils.RLP.encode(["0xf3b60c1d342b964e5aba270741aa56e2c22b47bc", BigNumber.from(0).toHexString()])).slice(-40)))
  console.log("0x".concat(ethers.utils.keccak256(ethers.utils.RLP.encode(["0xf3b60c1d342b964e5aba270741aa56e2c22b47bc", BigNumber.from(1).toHexString()])).slice(-40)))
  console.log("0x".concat(ethers.utils.keccak256(ethers.utils.RLP.encode(["0xf3b60c1d342b964e5aba270741aa56e2c22b47bc", BigNumber.from(2).toHexString()])).slice(-40)))
  console.log("0x".concat(ethers.utils.keccak256(ethers.utils.RLP.encode(["0xf3b60c1d342b964e5aba270741aa56e2c22b47bc", BigNumber.from(3).toHexString()])).slice(-40)))
  console.log("0x".concat(ethers.utils.keccak256(ethers.utils.RLP.encode(["0xf3b60c1d342b964e5aba270741aa56e2c22b47bc", BigNumber.from(4).toHexString()])).slice(-40)))
  console.log("0x".concat(ethers.utils.keccak256(ethers.utils.RLP.encode(["0xf3b60c1d342b964e5aba270741aa56e2c22b47bc", BigNumber.from(5).toHexString()])).slice(-40)))
  console.log("0x".concat(ethers.utils.keccak256(ethers.utils.RLP.encode(["0xf3b60c1d342b964e5aba270741aa56e2c22b47bc", BigNumber.from(32).toHexString()])).slice(-40)))
  console.log("0x".concat(ethers.utils.keccak256(ethers.utils.RLP.encode(["0xf3b60c1d342b964e5aba270741aa56e2c22b47bc", BigNumber.from(39).toHexString()])).slice(-40)))
  console.log(ethers.utils.getAddress("0x".concat(ethers.utils.keccak256(ethers.utils.RLP.encode(["0xf3b60c1d342b964e5aba270741aa56e2c22b47bc", BigNumber.from(40).toHexString()])).slice(-40))))
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

/**
 * Output:
0x088605c23cfb359c10b7fee0353ec153a4b975b1  0
0x8e12a8e323fb7c70bfeee905f72e3741fa8d6f58  1
0x9db9f78ffe9f83d70b577d6079b1cc8b26bc6bc0  2
0xbb20ad4b029bd5a6c92af93cb21a8700865fd3bb  3
0xbf7ca444683cd4779e939898371d2249ed97de63
0xdbe4eeba885974b3a8ec15c2f4f52336ed138e49
...
0xae88a614733db391caa8db63e10c853a2a6c46f2  32

0xd848e91b6db75e4c27ae127ac69d6082c7d3d3f8  39
0xAE272C6Ea3FdB317BCA0e83A9CB169f0d0f1073E  40
 */