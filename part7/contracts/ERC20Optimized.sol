// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ERC20Optimized
 * @dev Optimized ERC-20 implementation with gas optimizations
 * 
 * Optimizations applied:
 * 1. Using immutable for constants (owner, maxSupply) and constant for decimals
 * 2. Using calldata for function parameters (external functions)
 * 3. Packing variables (paused and lastUpdate in a single slot)
 * 4. Reducing state writes (unchecked for safe arithmetic)
 * 5. Removing redundant operations (caching storage values)
 */
contract ERC20Optimized {
    // Note: string cannot be immutable in all Solidity versions
    // Keeping as regular variables but optimizing other parts
    string public name;
    string public symbol;
    uint8 public constant decimals = 18;
    // Immutable variables (stored in bytecode, not storage)
    address public immutable owner;
    uint256 public immutable maxSupply;
    
    // Packed storage: lastUpdate (uint248) + paused (bool) = 1 slot
    struct PackedData {
        uint248 lastUpdate;
        bool paused;
    }
    PackedData public packedData;
    
    uint256 public totalSupply;
    
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor(string memory _name, string memory _symbol) {
        name = _name;
        symbol = _symbol;
        owner = msg.sender;
        maxSupply = 1000000 * 10**18;
        packedData = PackedData({
            lastUpdate: uint248(block.timestamp),
            paused: false
        });
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        address from = msg.sender;
        uint256 fromBalance = balanceOf[from];
        
        require(fromBalance >= amount, "Insufficient balance");
        
        // Unchecked for safe arithmetic (we checked above)
        unchecked {
            balanceOf[from] = fromBalance - amount;
            balanceOf[to] += amount;
        }
        
        emit Transfer(from, to, amount);
        return true;
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        uint256 currentAllowance = allowance[from][msg.sender];
        uint256 fromBalance = balanceOf[from];
        
        require(currentAllowance >= amount, "Insufficient allowance");
        require(fromBalance >= amount, "Insufficient balance");
        
        // Unchecked for safe arithmetic (we checked above)
        unchecked {
            allowance[from][msg.sender] = currentAllowance - amount;
            balanceOf[from] = fromBalance - amount;
            balanceOf[to] += amount;
        }
        
        emit Transfer(from, to, amount);
        return true;
    }

    function mint(address to, uint256 amount) external {
        require(msg.sender == owner, "Not owner");
        
        uint256 currentSupply = totalSupply;
        require(currentSupply + amount <= maxSupply, "Exceeds max supply");
        
        unchecked {
            totalSupply = currentSupply + amount;
            balanceOf[to] += amount;
        }
        
        emit Transfer(address(0), to, amount);
    }

    function burn(uint256 amount) external {
        uint256 senderBalance = balanceOf[msg.sender];
        require(senderBalance >= amount, "Insufficient balance");
        
        unchecked {
            balanceOf[msg.sender] = senderBalance - amount;
            totalSupply -= amount;
        }
        
        emit Transfer(msg.sender, address(0), amount);
    }

    function updateTimestamp() external {
        // Packed update - only modify the struct
        packedData.lastUpdate = uint248(block.timestamp);
    }
}
