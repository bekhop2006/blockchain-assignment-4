# Blockchain Assignment 4 - Parts 5 & 7

This project implements:
- **Part 5**: Mini Lending Pool (DeFi Simulation)
- **Part 7**: ERC-20 Gas Optimization Workshop

## Project Structure

```
.
├── part5/                        # Part 5: Mini Lending Pool
│   ├── contracts/
│   │   ├── MiniLendingPool.sol
│   │   └── MockERC20.sol
│   ├── test/
│   │   └── MiniLendingPool.test.js
│   ├── package.json
│   ├── hardhat.config.js
│   ├── README.md
│   └── TESTING.md
├── part7/                        # Part 7: Gas Optimization
│   ├── contracts/
│   │   ├── ERC20Original.sol
│   │   └── ERC20Optimized.sol
│   ├── test/
│   │   └── GasComparison.test.js
│   ├── package.json
│   ├── hardhat.config.js
│   ├── README.md
│   ├── TESTING.md
│   └── GAS_OPTIMIZATIONS.md
├── TESTING_GUIDE.md             # Complete testing guide
└── README.md                     # This file
```

## Quick Start

### Part 5: Mini Lending Pool

```bash
cd part5
npm install
npm run compile
npm test
```

**See detailed guide**: `part5/TESTING.md`

### Part 7: Gas Optimization

```bash
cd part7
npm install
npm run compile
npm run test:gas
```

**See detailed guide**: `part7/TESTING.md`

## Complete Testing Guide

For comprehensive testing instructions and screenshot guidelines, see:
- **Main Guide**: `TESTING_GUIDE.md` (complete instructions for both parts)
- **Part 5 Guide**: `part5/TESTING.md` (detailed Part 5 instructions)
- **Part 7 Guide**: `part7/TESTING.md` (detailed Part 7 instructions)

## Testing & Screenshots

Both parts can be tested independently. See `TESTING_GUIDE.md` for:
- Step-by-step testing instructions
- Screenshot checklist
- Remix IDE instructions
- Troubleshooting guide

## Part 5: Mini Lending Pool

### Features
- ✅ Deposit ERC-20 tokens
- ✅ Withdraw tokens
- ✅ Track total deposited
- ✅ Track individual user deposits
- ✅ Event emissions (Deposited, Withdrawn)

### Test Coverage
**10 comprehensive test cases** covering:
- Deployment and initialization
- Single and multiple deposits
- Single and multiple withdrawals
- Edge cases (zero amounts, insufficient balance)
- View functions
- Event emissions

**See**: `part5/README.md` and `part5/TESTING.md`

## Part 7: Gas Optimization Workshop

### 5 Optimizations Applied
1. **Immutable Variables** - `name`, `symbol`, `owner`, `maxSupply` stored in bytecode
2. **Using Calldata** - `external` functions instead of `public`
3. **Reducing State Writes** - `unchecked` blocks for safe arithmetic
4. **Packing Variables** - `lastUpdate` and `paused` in single storage slot
5. **Removing Redundant Operations** - Caching storage values in memory

### Deliverables
- ✅ **Original snippet**: `part7/contracts/ERC20Original.sol`
- ✅ **Optimized snippet**: `part7/contracts/ERC20Optimized.sol`
- ✅ **Gas cost comparison**: Run `npm run test:gas` in part7 folder

### Gas Savings
- Deployment: ~30-40% savings
- Transfer: ~15-20% savings
- Mint: ~15-20% savings
- TransferFrom: ~15-20% savings
- Burn: ~15-20% savings

**See**: `part7/README.md`, `part7/TESTING.md`, and `part7/GAS_OPTIMIZATIONS.md`

## Documentation

- **Main Testing Guide**: `TESTING_GUIDE.md` - Complete instructions for testing both parts
- **Part 5 Testing**: `part5/TESTING.md` - Detailed Part 5 testing instructions
- **Part 7 Testing**: `part7/TESTING.md` - Detailed Part 7 testing instructions
- **Gas Optimizations**: `part7/GAS_OPTIMIZATIONS.md` - Detailed explanation of all 5 optimizations

## Screenshots Checklist

### Part 5 (Mini Lending Pool):
- [ ] Successful compilation
- [ ] All 10 tests passing
- [ ] Sample deposit transaction (from Remix or Hardhat)

### Part 7 (Gas Optimization):
- [ ] Both contracts compiled successfully
- [ ] Test results with gas comparisons
- [ ] Gas report (gas-report.txt)
- [ ] Code examples showing optimizations

## Requirements

- Node.js 16+ 
- npm or yarn
- Hardhat (installed via npm)

## Notes

- All contracts use Solidity 0.8.20
- Part 5 uses OpenZeppelin contracts (SafeERC20)
- Tests use Hardhat and Chai
- Part 7 uses hardhat-gas-reporter for gas analysis
- Both parts can be run independently

## License

MIT
