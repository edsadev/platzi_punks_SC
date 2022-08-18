const { ethers, network, run } = require("hardhat")

const deploy = async() => {
  // Obtain the address that is going to deploy the contract
  const [deployer] = await ethers.getSigners();
  const maxSupply = 10000;
  const payees = [deployer.address];
  const shares_ = [100];

  console.log("Deploying contract with the account", deployer.address);

  // Get the contract factory
  const PlatziPunks = await ethers.getContractFactory("PlatziPunks");
  // Deploy the contract
  const deployed = await PlatziPunks.deploy(maxSupply, payees, shares_);

  console.log("Platzi punks is deployed at: ", deployed.address);

  // Verification
  if (network.config.chainId === 4 && process.env.ETHERSCAN_API_KEY) {
    console.log("Waiting for block confirmations . . .")
    await deployed.deployTransaction.wait(6)
    await verify(deployed.address, [maxSupply, payees, shares_])
  }
}

// async function verify(contractAddress, args)
const verify = async (contractAddress, args) => {
  console.log("Verifying contract ...")
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    })
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already Verify!")
    } else {
      console.log(e)
    }
  }
}

deploy()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  })
