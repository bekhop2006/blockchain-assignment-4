// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title MiniLendingPool
 * @dev A minimal lending pool that allows users to deposit and withdraw ERC-20 tokens
 */
contract MiniLendingPool {
    using SafeERC20 for IERC20;

    // The ERC-20 token that can be deposited
    IERC20 public immutable token;

    // Total amount of tokens deposited in the pool
    uint256 public totalDeposited;

    // Mapping from user address to their deposit amount
    mapping(address => uint256) public deposits;

    // Events
    event Deposited(address indexed user, uint256 amount, uint256 totalDeposited);
    event Withdrawn(address indexed user, uint256 amount, uint256 totalDeposited);

    /**
     * @dev Constructor that sets the token address
     * @param _token Address of the ERC-20 token to be used in the pool
     */
    constructor(address _token) {
        require(_token != address(0), "MiniLendingPool: token address cannot be zero");
        token = IERC20(_token);
    }

    /**
     * @dev Deposit tokens into the pool
     * @param amount Amount of tokens to deposit
     */
    function deposit(uint256 amount) external {
        require(amount > 0, "MiniLendingPool: amount must be greater than zero");
        
        // Transfer tokens from user to this contract
        token.safeTransferFrom(msg.sender, address(this), amount);
        
        // Update user's deposit and total deposited
        deposits[msg.sender] += amount;
        totalDeposited += amount;
        
        emit Deposited(msg.sender, amount, totalDeposited);
    }

    /**
     * @dev Withdraw tokens from the pool
     * @param amount Amount of tokens to withdraw
     */
    function withdraw(uint256 amount) external {
        require(amount > 0, "MiniLendingPool: amount must be greater than zero");
        require(deposits[msg.sender] >= amount, "MiniLendingPool: insufficient balance");
        
        // Update user's deposit and total deposited
        deposits[msg.sender] -= amount;
        totalDeposited -= amount;
        
        // Transfer tokens back to user
        token.safeTransfer(msg.sender, amount);
        
        emit Withdrawn(msg.sender, amount, totalDeposited);
    }

    /**
     * @dev Get the deposit balance of a user
     * @param user Address of the user
     * @return The amount of tokens deposited by the user
     */
    function getDeposit(address user) external view returns (uint256) {
        return deposits[user];
    }

    /**
     * @dev Get the total amount deposited in the pool
     * @return The total amount of tokens in the pool
     */
    function getTotalDeposited() external view returns (uint256) {
        return totalDeposited;
    }
}
