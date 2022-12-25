const { ethers } = require("hardhat");

async function main() {
  const nftContractFactory = await ethers.getContractFactory("MyEpicNFT");
  const nftContract = await nftContractFactory.deploy();

  await nftContract.deployed(); //0x49cA47c095118963126FD9e564419133072b909D
  console.log("Contract deployed to:", nftContract.address);

  console.log("Veryfing contract address", nftContract.address);

  console.log("Sleeping...");
  // Buffer a time for etherscan to update the deployed contract
  await sleep(30000);

  //Verify contract
  await hre.run("verify:verify", {
    address: nftContract.address,
    // constructorArguments: [],
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
