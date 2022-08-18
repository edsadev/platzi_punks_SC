const deploy = async() => {
  // Obtain the address that is going to deploy the contract
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contract with the account", deployer.address);

  // Get the contract factory
  const PlatziPunks = await ethers.getContractFactory("PlatziPunks");
  // Deploy the contract
  const deployed = await PlatziPunks.deploy();

  console.log("Platzi punks is deployed at: ", deployed.address);
}

deploy()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  })
