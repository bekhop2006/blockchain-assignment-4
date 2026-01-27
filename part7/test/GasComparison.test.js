const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Gas Optimization Comparison", function () {
  let originalContract;
  let optimizedContract;
  let owner;
  let user1;
  let user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy original contract
    const ERC20Original = await ethers.getContractFactory("ERC20Original");
    originalContract = await ERC20Original.deploy("Test Token", "TEST");
    await originalContract.waitForDeployment();

    // Deploy optimized contract
    const ERC20Optimized = await ethers.getContractFactory("ERC20Optimized");
    optimizedContract = await ERC20Optimized.deploy("Test Token", "TEST");
    await optimizedContract.waitForDeployment();
  });

  describe("Deployment Gas", function () {
    it("Should compare deployment gas costs", async function () {
      // This will be shown in gas reporter
      const ERC20Original = await ethers.getContractFactory("ERC20Original");
      const ERC20Optimized = await ethers.getContractFactory("ERC20Optimized");
      
      const originalTx = await ERC20Original.deploy("Test Token", "TEST");
      await originalTx.waitForDeployment();
      
      const optimizedTx = await ERC20Optimized.deploy("Test Token", "TEST");
      await optimizedTx.waitForDeployment();
    });
  });

  describe("Transfer Gas Comparison", function () {
    beforeEach(async function () {
      // Mint tokens to user1 for both contracts
      await originalContract.mint(user1.address, ethers.parseEther("1000"));
      await optimizedContract.mint(user1.address, ethers.parseEther("1000"));
    });

    it("Should compare transfer gas costs", async function () {
      const amount = ethers.parseEther("100");
      
      // Original transfer
      const originalTx = await originalContract.connect(user1).transfer(user2.address, amount);
      const originalReceipt = await originalTx.wait();
      
      // Optimized transfer
      const optimizedTx = await optimizedContract.connect(user1).transfer(user2.address, amount);
      const optimizedReceipt = await optimizedTx.wait();
      
      console.log("\n=== Transfer Gas Comparison ===");
      console.log(`Original: ${originalReceipt.gasUsed.toString()} gas`);
      console.log(`Optimized: ${optimizedReceipt.gasUsed.toString()} gas`);
      console.log(`Savings: ${(originalReceipt.gasUsed - optimizedReceipt.gasUsed).toString()} gas`);
      console.log(`Savings %: ${((originalReceipt.gasUsed - optimizedReceipt.gasUsed) * 100 / originalReceipt.gasUsed).toFixed(2)}%`);
    });
  });

  describe("Mint Gas Comparison", function () {
    it("Should compare mint gas costs", async function () {
      const amount = ethers.parseEther("100");
      
      // Original mint
      const originalTx = await originalContract.mint(user1.address, amount);
      const originalReceipt = await originalTx.wait();
      
      // Optimized mint
      const optimizedTx = await optimizedContract.mint(user1.address, amount);
      const optimizedReceipt = await optimizedTx.wait();
      
      console.log("\n=== Mint Gas Comparison ===");
      console.log(`Original: ${originalReceipt.gasUsed.toString()} gas`);
      console.log(`Optimized: ${optimizedReceipt.gasUsed.toString()} gas`);
      console.log(`Savings: ${(originalReceipt.gasUsed - optimizedReceipt.gasUsed).toString()} gas`);
      console.log(`Savings %: ${((originalReceipt.gasUsed - optimizedReceipt.gasUsed) * 100 / originalReceipt.gasUsed).toFixed(2)}%`);
    });
  });

  describe("TransferFrom Gas Comparison", function () {
    beforeEach(async function () {
      // Mint tokens and approve
      await originalContract.mint(user1.address, ethers.parseEther("1000"));
      await optimizedContract.mint(user1.address, ethers.parseEther("1000"));
      
      await originalContract.connect(user1).approve(user2.address, ethers.parseEther("1000"));
      await optimizedContract.connect(user1).approve(user2.address, ethers.parseEther("1000"));
    });

    it("Should compare transferFrom gas costs", async function () {
      const amount = ethers.parseEther("100");
      
      // Original transferFrom
      const originalTx = await originalContract.connect(user2).transferFrom(user1.address, user2.address, amount);
      const originalReceipt = await originalTx.wait();
      
      // Optimized transferFrom
      const optimizedTx = await optimizedContract.connect(user2).transferFrom(user1.address, user2.address, amount);
      const optimizedReceipt = await optimizedTx.wait();
      
      console.log("\n=== TransferFrom Gas Comparison ===");
      console.log(`Original: ${originalReceipt.gasUsed.toString()} gas`);
      console.log(`Optimized: ${optimizedReceipt.gasUsed.toString()} gas`);
      console.log(`Savings: ${(originalReceipt.gasUsed - optimizedReceipt.gasUsed).toString()} gas`);
      console.log(`Savings %: ${((originalReceipt.gasUsed - optimizedReceipt.gasUsed) * 100 / originalReceipt.gasUsed).toFixed(2)}%`);
    });
  });

  describe("Burn Gas Comparison", function () {
    beforeEach(async function () {
      await originalContract.mint(user1.address, ethers.parseEther("1000"));
      await optimizedContract.mint(user1.address, ethers.parseEther("1000"));
    });

    it("Should compare burn gas costs", async function () {
      const amount = ethers.parseEther("100");
      
      // Original burn
      const originalTx = await originalContract.connect(user1).burn(amount);
      const originalReceipt = await originalTx.wait();
      
      // Optimized burn
      const optimizedTx = await optimizedContract.connect(user1).burn(amount);
      const optimizedReceipt = await optimizedTx.wait();
      
      console.log("\n=== Burn Gas Comparison ===");
      console.log(`Original: ${originalReceipt.gasUsed.toString()} gas`);
      console.log(`Optimized: ${optimizedReceipt.gasUsed.toString()} gas`);
      console.log(`Savings: ${(originalReceipt.gasUsed - optimizedReceipt.gasUsed).toString()} gas`);
      console.log(`Savings %: ${((originalReceipt.gasUsed - optimizedReceipt.gasUsed) * 100 / originalReceipt.gasUsed).toFixed(2)}%`);
    });
  });

  describe("Functionality Verification", function () {
    it("Both contracts should have same functionality", async function () {
      const amount = ethers.parseEther("100");
      
      // Mint
      await originalContract.mint(user1.address, amount);
      await optimizedContract.mint(user1.address, amount);
      
      expect(await originalContract.balanceOf(user1.address)).to.equal(amount);
      expect(await optimizedContract.balanceOf(user1.address)).to.equal(amount);
      
      // Transfer
      await originalContract.connect(user1).transfer(user2.address, ethers.parseEther("50"));
      await optimizedContract.connect(user1).transfer(user2.address, ethers.parseEther("50"));
      
      expect(await originalContract.balanceOf(user2.address)).to.equal(ethers.parseEther("50"));
      expect(await optimizedContract.balanceOf(user2.address)).to.equal(ethers.parseEther("50"));
    });
  });
});
