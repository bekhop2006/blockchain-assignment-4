# Part 5 - Mini Lending Pool

## Description
A minimal lending pool implementation that allows users to deposit and withdraw ERC-20 tokens. The pool tracks total deposits and individual user balances.

## Features
- Deposit ERC-20 tokens into the pool
- Withdraw tokens from the pool
- Track total deposited tokens
- Track individual user deposits

## Setup

1. Install dependencies:
```bash
npm install
```

2. Compile contracts:
```bash
npm run compile
```

3. Run tests:
```bash
npm test
```

## Test Cases
The test suite includes 10 test cases covering:
- Contract deployment
- Token deposits (single and multiple)
- Token withdrawals (partial and full)
- Edge cases (zero amounts, insufficient balance)
- View functions

## Contract Address
After deployment, you can interact with the contract using the deployed address.
