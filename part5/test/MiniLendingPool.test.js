const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MiniLendingPool", function () {
  let lendingPool;
  let token;
  let owner;
  let user1;
  let user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy mock ERC-20 token
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    token = await MockERC20.deploy("Test Token", "TEST");
    await token.deployed();

    // Deploy MiniLendingPool
    const MiniLendingPool = await ethers.getContractFactory("MiniLendingPool");
    lendingPool = await MiniLendingPool.deploy(token.address);
    await lendingPool.deployed();

    // Transfer some tokens to users for testing
    await token.transfer(user1.address, ethers.utils.parseEther("1000"));
    await token.transfer(user2.address, ethers.utils.parseEther("1000"));
  });

  describe("Deployment", function () {
    it("Should set the correct token address", async function () {
      expect(await lendingPool.token()).to.equal(token.address);
    });

    it("Should initialize with zero total deposited", async function () {
      expect(await lendingPool.totalDeposited()).to.equal(0);
    });

    it("Should revert if token address is zero", async function () {
      const MiniLendingPool = await ethers.getContractFactory("MiniLendingPool");
      await expect(
        MiniLendingPool.deploy(ethers.constants.AddressZero)
      ).to.be.revertedWith("MiniLendingPool: token address cannot be zero");
    });
  });

  describe("Deposit", function () {
    it("Should allow user to deposit tokens", async function () {
      const depositAmount = ethers.utils.parseEther("100");
      
      await token.connect(user1).approve(lendingPool.address, depositAmount);
      await expect(lendingPool.connect(user1).deposit(depositAmount))
        .to.emit(lendingPool, "Deposited")
        .withArgs(user1.address, depositAmount, depositAmount);

      expect(await lendingPool.deposits(user1.address)).to.equal(depositAmount);
      expect(await lendingPool.totalDeposited()).to.equal(depositAmount);
    });

    it("Should update total deposited correctly with multiple deposits", async function () {
      const depositAmount1 = ethers.utils.parseEther("100");
      const depositAmount2 = ethers.utils.parseEther("50");

      await token.connect(user1).approve(lendingPool.address, depositAmount1);
      await lendingPool.connect(user1).deposit(depositAmount1);

      await token.connect(user2).approve(lendingPool.address, depositAmount2);
      await lendingPool.connect(user2).deposit(depositAmount2);

      expect(await lendingPool.totalDeposited()).to.equal(
        depositAmount1.add(depositAmount2)
      );
    });

    it("Should allow user to make multiple deposits", async function () {
      const depositAmount1 = ethers.utils.parseEther("100");
      const depositAmount2 = ethers.utils.parseEther("50");

      await token.connect(user1).approve(lendingPool.address, ethers.utils.parseEther("200"));
      
      await lendingPool.connect(user1).deposit(depositAmount1);
      await lendingPool.connect(user1).deposit(depositAmount2);

      expect(await lendingPool.deposits(user1.address)).to.equal(
        depositAmount1.add(depositAmount2)
      );
      expect(await lendingPool.totalDeposited()).to.equal(
        depositAmount1.add(depositAmount2)
      );
    });

    it("Should revert if deposit amount is zero", async function () {
      await expect(
        lendingPool.connect(user1).deposit(0)
      ).to.be.revertedWith("MiniLendingPool: amount must be greater than zero");
    });

    it("Should revert if user has insufficient token balance", async function () {
      const depositAmount = ethers.utils.parseEther("2000"); // More than user1 has

      await token.connect(user1).approve(lendingPool.address, depositAmount);
      await expect(
        lendingPool.connect(user1).deposit(depositAmount)
      ).to.be.reverted;
    });
  });

  describe("Withdraw", function () {
    beforeEach(async function () {
      const depositAmount = ethers.utils.parseEther("100");
      await token.connect(user1).approve(lendingPool.address, depositAmount);
      await lendingPool.connect(user1).deposit(depositAmount);
    });

    it("Should allow user to withdraw tokens", async function () {
      const withdrawAmount = ethers.utils.parseEther("50");
      const initialBalance = await token.balanceOf(user1.address);

      await expect(lendingPool.connect(user1).withdraw(withdrawAmount))
        .to.emit(lendingPool, "Withdrawn")
        .withArgs(user1.address, withdrawAmount, ethers.utils.parseEther("50"));

      expect(await lendingPool.deposits(user1.address)).to.equal(ethers.utils.parseEther("50"));
      expect(await lendingPool.totalDeposited()).to.equal(ethers.utils.parseEther("50"));
      expect(await token.balanceOf(user1.address)).to.equal(initialBalance.add(withdrawAmount));
    });

    it("Should allow user to withdraw all tokens", async function () {
      const depositAmount = ethers.utils.parseEther("100");
      const initialBalance = await token.balanceOf(user1.address);

      await lendingPool.connect(user1).withdraw(depositAmount);

      expect(await lendingPool.deposits(user1.address)).to.equal(0);
      expect(await lendingPool.totalDeposited()).to.equal(0);
      expect(await token.balanceOf(user1.address)).to.equal(initialBalance.add(depositAmount));
    });

    it("Should revert if withdraw amount is zero", async function () {
      await expect(
        lendingPool.connect(user1).withdraw(0)
      ).to.be.revertedWith("MiniLendingPool: amount must be greater than zero");
    });

    it("Should revert if user tries to withdraw more than deposited", async function () {
      const withdrawAmount = ethers.utils.parseEther("150");

      await expect(
        lendingPool.connect(user1).withdraw(withdrawAmount)
      ).to.be.revertedWith("MiniLendingPool: insufficient balance");
    });

    it("Should update total deposited correctly after withdrawal", async function () {
      const depositAmount2 = ethers.utils.parseEther("50");
      await token.connect(user2).approve(lendingPool.address, depositAmount2);
      await lendingPool.connect(user2).deposit(depositAmount2);

      await lendingPool.connect(user1).withdraw(ethers.utils.parseEther("30"));

      expect(await lendingPool.totalDeposited()).to.equal(ethers.utils.parseEther("120"));
    });
  });

  describe("View Functions", function () {
    it("Should return correct deposit balance for user", async function () {
      const depositAmount = ethers.utils.parseEther("100");
      await token.connect(user1).approve(lendingPool.address, depositAmount);
      await lendingPool.connect(user1).deposit(depositAmount);

      expect(await lendingPool.getDeposit(user1.address)).to.equal(depositAmount);
    });

    it("Should return zero for user with no deposits", async function () {
      expect(await lendingPool.getDeposit(user1.address)).to.equal(0);
    });

    it("Should return correct total deposited", async function () {
      const depositAmount1 = ethers.utils.parseEther("100");
      const depositAmount2 = ethers.utils.parseEther("50");

      await token.connect(user1).approve(lendingPool.address, depositAmount1);
      await lendingPool.connect(user1).deposit(depositAmount1);

      await token.connect(user2).approve(lendingPool.address, depositAmount2);
      await lendingPool.connect(user2).deposit(depositAmount2);

      expect(await lendingPool.getTotalDeposited()).to.equal(
        depositAmount1.add(depositAmount2)
      );
    });
  });
});
