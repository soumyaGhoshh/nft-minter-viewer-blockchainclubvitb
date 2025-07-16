NFT Minter & Viewer
This project is a decentralized application (dApp) that allows users to mint their own Non-Fungible Tokens (NFTs) and view NFTs associated with their connected MetaMask wallet. It leverages blockchain technologies like Ethereum (Sepolia testnet), Alchemy for blockchain interaction, and Pinata for decentralized storage of NFT metadata.

Features
Wallet Connection: Seamlessly connect to MetaMask wallet.

NFT Minting: Create unique NFTs by providing an asset URL, name, description, and custom attributes.

IPFS Integration: NFT metadata is securely stored on IPFS via Pinata.

NFT Gallery: View all NFTs owned by the connected wallet address, dynamically fetched from the blockchain via Alchemy.

Responsive Design: User-friendly interface accessible on various devices.

Technologies Used
Frontend: React.js

Blockchain Interaction: Ethers.js

Blockchain API: Alchemy (for fetching NFTs and interacting with Sepolia testnet)

Decentralized Storage: Pinata (for IPFS pinning of NFT metadata)

Wallet Integration: MetaMask

Build Tooling: Create React App, react-app-rewired, customize-cra (for Webpack 5 polyfills)

Styling: Standard CSS

Getting Started
Follow these steps to set up and run the project locally.

Prerequisites
Before you begin, ensure you have the following installed:

Node.js & npm: Download and install Node.js (which includes npm).

Git: Download and install Git.

MetaMask Extension: Install the MetaMask browser extension and configure it for the Sepolia Test Network. Ensure you have some Sepolia ETH for gas fees (you can get test ETH from a Sepolia Faucet).

Installation
Clone the repository:
Open your terminal or command prompt and run:

git clone https://github.com/soumyaGhoshh/nft-minter-viewer-blockchainclubvitb.git
cd nft-minter-viewer-blockchainclubvitb/soumya's\ project/nft-minter

Self-correction: The path seems to be nft-minter-viewer-blockchainclubvitb/soumya's project/nft-minter/. I'll adjust the cd command accordingly.

Install dependencies:
Navigate into the project directory and install all required Node.js packages:

npm install

This command will also install the necessary polyfills for Node.js core modules (like path, crypto, stream, etc.) that are configured in config-overrides.js.

Environment Variables Setup
You need to create a .env file in the root of your nft-minter project directory and populate it with your API keys and contract address. This file is ignored by Git for security reasons.

Create .env file:
In the nft-minter directory, create a new file named .env.

Add your variables:
Paste the following content into your .env file, replacing the placeholder values with your actual keys and address:

REACT_APP_PINATA_KEY="YOUR_PINATA_API_KEY"
REACT_APP_PINATA_SECRET="YOUR_PINATA_SECRET_API_KEY"
REACT_APP_ALCHEMY_API_KEY="YOUR_ALCHEMY_API_KEY"
REACT_APP_ALCHEMY_NETWORK="eth-sepolia"
REACT_APP_CONTRACT_ADDRESS="YOUR_SMART_CONTRACT_ADDRESS"

REACT_APP_PINATA_KEY & REACT_APP_PINATA_SECRET: Obtain these from your Pinata account dashboard.

REACT_APP_ALCHEMY_API_KEY: Get this from your Alchemy dashboard. Create a new app for the Sepolia testnet.

REACT_APP_ALCHEMY_NETWORK: This should be eth-sepolia for the Sepolia testnet.

REACT_APP_CONTRACT_ADDRESS: This is the address of your deployed NFT smart contract on the Sepolia testnet. (e.g., 0x5cb7Ed8aB506576a5d3890CC4184bdB437128D7f as per your previous logs).

Running the Application Locally
Once dependencies are installed and environment variables are set, you can start the development server:

npm start

This will open your application in your browser at http://localhost:3000. The page will reload automatically as you make changes.

Deployment to Vercel
This project is configured for easy deployment to Vercel.

Connect to Vercel:
If you haven't already, sign up for a Vercel account and connect it to your GitHub repository.

Import Project:
From your Vercel dashboard, import your nft-minter-viewer-blockchainclubvitb GitHub repository.

Configure Environment Variables in Vercel:
This is a crucial step. Vercel does not read your local .env file. You must add your environment variables directly in the Vercel dashboard.

Go to your Vercel project settings.

Navigate to "Settings" > "Environment Variables".

Add each variable exactly as it appears in your .env file (Key and Value), ensuring you select "Production", "Preview", and "Development" environments.

Key

Value

REACT_APP_PINATA_KEY

Your Pinata API Key

REACT_APP_PINATA_SECRET

Your Pinata Secret API Key

REACT_APP_ALCHEMY_API_KEY

Your Alchemy API Key

REACT_APP_ALCHEMY_NETWORK

eth-sepolia

REACT_APP_CONTRACT_ADDRESS

Your Smart Contract Address

Deploy:
After adding the variables, trigger a new deployment. If you encounter build issues, try "Redeploy without Build Cache" from the Deployments tab.

Usage
NFT Minter Tab
Connect Wallet: Click "Connect Wallet" to link your MetaMask account.

Screenshot Suggestion: Wallet Connect button, and then connected address displayed.

Enter Asset Details:

Asset URL: Provide a URL for your NFT's image or media (e.g., from Pinata IPFS).

NFT Name: Give your NFT a unique name.

Description: Write a brief description of your NFT.

Attributes: Add custom traits and values (e.g., "Background: Blue", "Eyes: Green") by clicking "+ Add Attribute".

Screenshot Suggestion: Fully filled-out Minter form with attributes.

Mint NFT: Click "Mint NFT". Confirm the transaction in MetaMask.

Screenshot Suggestion: MetaMask transaction confirmation pop-up.

Status Message: The application will display the transaction status and a link to Etherscan upon success.

NFT Gallery Tab
Connect Wallet: Ensure your MetaMask wallet is connected. The gallery will automatically attempt to fetch NFTs for the connected address.

Screenshot Suggestion: Gallery tab active, showing "Connect your wallet" if not connected.

View NFTs: Your owned NFTs will be displayed in a grid. Each card will show the NFT image, name, collection, and token ID.

Screenshot Suggestion: A populated NFT Gallery grid.

Refresh NFTs: If you mint new NFTs or transfer them, click the "Refresh NFTs" button to update the gallery.

Screenshot Suggestion: Refresh button and updated gallery after a refresh.

Smart Contract Details
Contract Address: 0x5cb7Ed8aB506576a5d3890CC4184bdB437128D7f (on Sepolia Testnet)

Contract ABI: Located in src/contract-abi.json. This JSON file defines the interface for interacting with your smart contract.

Acknowledgements
Create React App: For bootstrapping the React project.

Alchemy: For providing robust blockchain API access.

Pinata: For IPFS pinning services.

MetaMask: For wallet integration.

Ethers.js: For simplifying Ethereum blockchain interactions.

react-app-rewired & customize-cra: For custom Webpack configurations.