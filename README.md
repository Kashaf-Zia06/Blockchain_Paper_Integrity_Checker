ExamChain - Blockchain-Based Exam Paper Integrity & Governance System
PROJECT OVERVIEW

ExamChain is a decentralized blockchain-based system designed to secure academic examination papers from leaks, tampering, and unauthorized access. The system uses Ethereum smart contracts, cryptographic hashing, NFTs, and DAO governance to ensure transparency, accountability, and tamper-proof verification throughout the examination lifecycle.

The core idea is simple:

Instead of storing trust in centralized systems where exam papers can be modified or leaked without proof, ExamChain stores cryptographic SHA-256 hashes of exam papers on the blockchain. If any paper is altered, its hash changes instantly, making tampering immediately detectable.

KEY FEATURES
1. Secure Exam Paper Submission
Faculty uploads encrypted exam paper
SHA-256 hash generated automatically
Paper metadata + hash stored permanently on blockchain
Unauthorized modification becomes impossible to hide
2. Integrity Verification
Re-upload any exam paper anytime
System re-generates SHA-256 hash
Blockchain compares hashes instantly
Result shows VERIFIED or TAMPERED
3. Multi-Level Approval Workflow
Exam papers require approvals before release
Transparent approval history recorded on-chain
Every approval action becomes permanent and traceable
4. NFT-Based Ownership
Each exam paper is represented through a unique NFT
NFT ownership represents authority and custody
Ownership transfers are permanently recorded
5. DAO Governance System
Stakeholders can create governance proposals
Community members vote YES or NO
Double voting prevention implemented in smart contracts
Proposals execute automatically after voting deadline
6. Tamper-Proof Audit Trail
Every submission, approval, verification, and transfer is logged
Records cannot be deleted or modified
Complete transparency maintained throughout the process
TECH STACK
Blockchain:      Ethereum (Sepolia Testnet)
Smart Contracts: Solidity ^0.8.19
Frontend:        React.js + Vite
Styling:         CSS3
Wallet:          MetaMask
Web3 Library:    Ethers.js
Hashing:         Web Crypto API (SHA-256)
NFT Standard:    ERC-721 (OpenZeppelin)
IDE:             Remix IDE
SMART CONTRACTS
1. ExamPaperVault.sol
Core smart contract of the system
Handles exam paper submission and verification
Stores SHA-256 hashes on-chain
Maintains secure integrity records
Controls approval workflow
2. IntegrityToken.sol
ERC-721 NFT smart contract
Generates unique NFTs for exam papers
NFT ownership represents paper authority
Transfers linked with blockchain records
3. AcademicDAO.sol
Governance smart contract
Handles proposal creation and voting
Supports YES/NO voting mechanism
Prevents double voting using mappings
Executes proposals automatically after deadline
FOLDER STRUCTURE
Blockchain_Paper_Integrity_Checker/
│
├── src/
│   ├── SolidityContracts/
│   ├── contracts/
│   ├── pages/
│   ├── utils/
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
│
├── public/
├── package.json
├── vite.config.js
└── README.md
HOW TO RUN THE PROJECT
REQUIREMENTS
Google Chrome or Brave Browser
MetaMask Extension Installed
Node.js Installed
Sepolia Testnet ETH
STEP 1 — Install Dependencies
npm install
STEP 2 — Start Development Server
npm run dev
STEP 3 — Setup MetaMask
Install MetaMask from: https://metamask.io
Create or import a wallet
Enable Sepolia Testnet
STEP 4 — Get Sepolia Test ETH

Visit: https://sepoliafaucet.com
Paste your wallet address and request free test ETH.

STEP 5 — Connect Wallet
Open frontend in browser
Connect MetaMask wallet
Approve blockchain connection
HOW TO USE THE SYSTEM
SUBMIT EXAM PAPER
Upload encrypted exam file
SHA-256 hash generated automatically
Confirm transaction
VERIFY PAPER
Upload file again
System compares hashes
Shows VERIFIED / TAMPERED
DAO GOVERNANCE
Create proposal
Stakeholders vote
Execute after deadline
SYSTEM WORKFLOW
Upload Exam Paper
→ SHA-256 Hash
→ Store on Blockchain
→ Mint NFT
→ Approval Workflow
→ Release Keys
→ Verify Anytime
→ DAO Voting
IMPORTANT NOTES
Runs only on Sepolia Testnet
No real ETH used
All transactions are public
Smart contracts are immutable
PROBLEM STATEMENT

“Exam systems lack security, transparency, and tamper-proof verification.”

AUTHORS
Ayesha Ahmed
Team Members
React + Vite (Template Info)
React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

@vitejs/plugin-react uses Oxc
@vitejs/plugin-react-swc uses SWC
React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performance. To add it, see:
https://react.dev/learn/react-compiler/installation

Expanding the ESLint Configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out:
https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts
