# Part 7 - Gas Optimization Workshop

## Description
This workshop demonstrates 5 key gas optimizations applied to an ERC-20 contract:
1. Using immutable variables
2. Using calldata for function parameters
3. Reducing state writes with unchecked blocks
4. Packing variables into single storage slots
5. Removing redundant operations

## Optimizations Applied

### 1. Immutable Variables
- **Original**: `address public owner; uint256 public maxSupply;`
- **Optimized**: `address public immutable owner; uint256 public immutable maxSupply;`
- **Savings**: Immutable variables are stored in bytecode, not storage (saves ~20,000 gas per read)
- **Note**: `string` types cannot be immutable in all Solidity versions, so we optimize value types instead

### 2. Calldata Usage
- **Original**: `function transfer(address to, uint256 amount) public`
- **Optimized**: `function transfer(address to, uint256 amount) external`
- **Savings**: External functions use calldata directly (saves gas on function calls)

### 3. Unchecked Blocks
- **Original**: `balanceOf[from] = balanceOf[from] - amount;` (with SafeMath)
- **Optimized**: `unchecked { balanceOf[from] = fromBalance - amount; }`
- **Savings**: After require checks, we can use unchecked (saves ~40 gas per operation)

### 4. Variable Packing
- **Original**: `uint256 public lastUpdate; bool public paused;` (2 storage slots)
- **Optimized**: `struct PackedData { uint248 lastUpdate; bool paused; }` (1 storage slot)
- **Savings**: Saves ~20,000 gas per write operation

### 5. Removing Redundant Operations
- **Original**: Multiple storage reads and writes
- **Optimized**: Cache values in memory, single storage writes
- **Savings**: Reduces SLOAD operations (saves ~100 gas per read)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Compile contracts:
```bash
npm run compile
```

3. Run tests with gas reporting:
```bash
npm run test:gas
```

4. View gas report:
```bash
cat gas-report.txt
```

## Gas Comparison

The test suite will output gas comparisons for:
- Contract deployment
- Transfer operations
- Mint operations
- TransferFrom operations
- Burn operations

## Files

- `contracts/ERC20Original.sol` - Original implementation with gas inefficiencies
- `contracts/ERC20Optimized.sol` - Optimized implementation
- `test/GasComparison.test.js` - Test suite with gas comparisons

## Deliverables

✅ **Original snippet** - `contracts/ERC20Original.sol`
✅ **Optimized snippet** - `contracts/ERC20Optimized.sol`
✅ **Gas cost comparison** - Run `npm run test:gas` to see detailed gas reports
