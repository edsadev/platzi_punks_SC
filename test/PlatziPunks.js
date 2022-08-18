const { expect } = require("chai");

describe("Platzi Punks Contract", () => {
  const setup = async ({ maxSupply = 10000, payees = [], shares_ = [100]}) => {
    const [owner] = await ethers.getSigners();
    const PlatziPunks = await ethers.getContractFactory("PlatziPunks");
    const deployed = await PlatziPunks.deploy(maxSupply, payees, shares_);

    return {
      owner,
      deployed,
    };
  };

  describe("Deployment", () => {
    it("Sets max supply to passed param", async () => {
      const maxSupply = 4000;
      const [deployer] = await ethers.getSigners();


      const { deployed } = await setup({ maxSupply, payees: [deployer.address], shares_: [100] });

      const returnedMaxSupply = await deployed.maxSupply();
      expect(maxSupply).to.equal(returnedMaxSupply);
    });
  });

  describe("Minting", () => {
    it("Mints a new token and assigns it to owner", async () => {
      const [deployer] = await ethers.getSigners();
      const maxSupply = 4000;

      const { owner, deployed } = await setup({ maxSupply, payees: [deployer.address], shares_: [100] });

      await deployed.mint({value: ethers.utils.parseEther("0.005")});

      const ownerOfMinted = await deployed.ownerOf(0);

      expect(ownerOfMinted).to.equal(owner.address);
    });

    it("Has a minting limit", async () => {
      const maxSupply = 2;
      const [deployer] = await ethers.getSigners();

      const { deployed } = await setup({ maxSupply, payees: [deployer.address], shares_: [100] });

      // Mint all
      await Promise.all([deployed.mint({value: ethers.utils.parseEther("0.005")}), deployed.mint({value: ethers.utils.parseEther("0.005")})]);

      // Assert the last minting
      await expect(deployed.mint({value: ethers.utils.parseEther("0.005")})).to.be.revertedWith(
        "ERC721: minting would exceed total supply, not plaztiPunks left"
      );
    });
  });

    describe("tokenURI", () => {
      it("returns valid metadata", async () => {
        const maxSupply = 1000;
        const [deployer] = await ethers.getSigners();
        const { deployed } = await setup({ maxSupply, payees: [deployer.address], shares_: [100] });

        await deployed.mint({value: ethers.utils.parseEther("0.005")});

        const tokenURI = await deployed.tokenURI(0);
        const stringifiedTokenURI = await tokenURI.toString();
        const [, base64JSON] = stringifiedTokenURI.split(
          "data:application/json;base64,"
        );
        const stringifiedMetadata = await Buffer.from(
          base64JSON,
          "base64"
        ).toString("ascii");
        const metadata = JSON.parse(stringifiedMetadata);
        console.log(metadata);
        expect(metadata).to.have.all.keys("name", "description", "image");
      });
    });
});