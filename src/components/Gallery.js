import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers'; // Still useful for wallet connection and address validation
import axios from 'axios'; // For making HTTP requests to Alchemy

// Default image placeholder for NFTs that fail to load or have no image
const DEFAULT_IMAGE_PLACEHOLDER = 'https://placehold.co/300x300/333333/FFFFFF?text=No+Image';

// Main Gallery Component
const Gallery = () => {
  const [userAddress, setUserAddress] = useState('');
  const [nfts, setNfts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [networkError, setNetworkError] = useState('');

  // IMPORTANT: Get your Alchemy API key and network from .env
  // REACT_APP_ALCHEMY_API_KEY="YOUR_ALCHEMY_API_KEY"
  // REACT_APP_ALCHEMY_NETWORK="eth-sepolia" (or "eth-goerli", "eth-mainnet")
  const alchemyApiKey = process.env.REACT_APP_ALCHEMY_API_KEY;
  const alchemyNetwork = process.env.REACT_APP_ALCHEMY_NETWORK || 'eth-sepolia'; // Default to Sepolia in ours

  // Alchemy API base URL
  const alchemyBaseUrl = `https://${alchemyNetwork}.g.alchemy.com/v2/${alchemyApiKey}`;
  
  // Expected chain ID for Sepolia
  const expectedChainId = 11155111; 

  // Function to connect to MetaMask wallet
  const connectWallet = useCallback(async () => {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed. Please install it to connect.');
      }
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      
      if (accounts.length > 0) {
        setUserAddress(accounts[0]);
        setError(''); // Clear any previous errors on successful connection
      } else {
        throw new Error('No accounts found. Please connect an account in MetaMask.');
      }
    } catch (err) {
      console.error('Error connecting wallet:', err);
      setError(err.message || 'Failed to connect wallet. Please try again.');
    }
  }, []);

  // Function to fetch NFTs using Alchemy API
  const fetchNFTs = useCallback(async () => {
    if (!userAddress || !ethers.utils.isAddress(userAddress)) {
      setError('Please enter a valid Ethereum address or connect your wallet.');
      setNfts([]);
      return;
    }
    if (!alchemyApiKey) {
      setError('Alchemy API Key is missing. Please set REACT_APP_ALCHEMY_API_KEY in your .env file.');
      return;
    }

    setIsLoading(true);
    setError('');
    setNfts([]); // Clear previous NFTs

    try {
      // Alchemy's getNFTsForOwner endpoint
      const response = await axios.get(`${alchemyBaseUrl}/getNFTsForOwner/`, {
        params: {
          owner: userAddress,
          'withMetadata': true // Request metadata along with NFT data
        }
      });

      const rawNfts = response.data.ownedNfts;

      if (!rawNfts || rawNfts.length === 0) {
        setError('No NFTs found for this address on the selected network.');
        setIsLoading(false);
        return;
      }

      const processedNfts = rawNfts.map(nft => {
        const metadata = nft.metadata;
        
        // Extracting image URL, handling potential IPFS or base64
        let imageUrl = DEFAULT_IMAGE_PLACEHOLDER;
        if (nft.media && nft.media.length > 0 && nft.media[0].gateway) {
          imageUrl = nft.media[0].gateway; // Alchemy often provides a direct gateway URL
        } else if (metadata && metadata.image) {
          // Fallback to metadata.image if media gateway is not available
          // Alchemy usually resolves IPFS to HTTP, but a direct check is safer
          if (metadata.image.startsWith('ipfs://')) {
            const ipfsHash = metadata.image.replace('ipfs://', '');
            imageUrl = `https://ipfs.io/ipfs/${ipfsHash}`; // Use a common gateway
          } else if (metadata.image.startsWith('data:image')) {
            imageUrl = metadata.image; // Base64 image
          } else if (metadata.image.startsWith('http')) {
            imageUrl = metadata.image; // Already an HTTP URL
          }
        }

        return {
          image: imageUrl,
          name: metadata?.name || nft.title || `NFT #${nft.id?.tokenId || 'Unknown'}`,
          description: metadata?.description || nft.description || 'No description available.',
          contractAddress: nft.contract?.address || 'N/A',
          tokenId: nft.id?.tokenId || 'N/A',
          attributes: metadata?.attributes || []
        };
      });

      setNfts(processedNfts);

    } catch (err) {
      console.error('Error fetching NFTs from Alchemy:', err);
      let errorMessage = 'Failed to fetch NFTs. Please check your address, Alchemy API key, and network.';
      if (axios.isAxiosError(err)) {
        if (err.response) {
          errorMessage = `API Error: ${err.response.status} - ${err.response.data?.message || err.response.statusText}`;
        } else if (err.request) {
          errorMessage = 'Network Error: Could not reach Alchemy API. Check your internet connection.';
        }
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [userAddress, alchemyApiKey, alchemyBaseUrl]); // Dependencies for useCallback

  // Effect for initial setup, network check, and wallet listeners
  useEffect(() => {
    const checkNetworkAndWallet = async () => {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        try {
          const network = await provider.getNetwork();
          // Check if the connected network's chain ID matches the expected Sepolia chain ID
          if (network.chainId !== expectedChainId) {
            setNetworkError(
              `Please connect to Sepolia Testnet (Chain ID: ${expectedChainId}). Current Chain ID: ${network.chainId}`
            );
          } else {
            setNetworkError('');
            // Attempt to get current connected accounts if any
            const accounts = await provider.listAccounts();
            if (accounts.length > 0) {
              setUserAddress(accounts[0]);
            }
          }
        } catch (err) {
          console.error('Initial network/wallet check error:', err);
          setNetworkError('Failed to initialize wallet connection. Please ensure MetaMask is installed and enabled.');
        }
      } else {
        setNetworkError(
          <p>
            🦊{" "}
            <a target="_blank" rel="noreferrer" href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual Ethereum wallet, in your browser.
            </a>
          </p>
        );
      }
    };

    checkNetworkAndWallet();

    // Set up event listeners for MetaMask account and chain changes
    const handleChainChanged = () => window.location.reload();
    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        setUserAddress('');
        setNfts([]);
        setError('');
        setIsLoading(false);
      } else {
        setUserAddress(accounts[0]);
      }
    };

    if (window.ethereum) {
      window.ethereum.on('chainChanged', handleChainChanged);
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }

    // Cleanup listeners on component unmount
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('chainChanged', handleChainChanged);
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, [expectedChainId]); // Only re-run if expectedChainId changes

  // Effect to trigger NFT fetching when userAddress changes (e.g., after wallet connection)
  useEffect(() => {
    if (userAddress) {
      fetchNFTs();
    } else {
      setNfts([]); // Clear NFTs if no address is set
    }
  }, [userAddress, fetchNFTs]); // Re-fetch when userAddress or fetchNFTs function changes

  return (
    <div className="gallery-container">
      <h2>NFT Gallery</h2>
      
      {networkError && (
        <div className="network-error-message">
          {networkError}
        </div>
      )}
      
      <div className="address-input">
        <input
          type="text"
          value={userAddress}
          onChange={(e) => setUserAddress(e.target.value)}
          placeholder="Enter Ethereum address or connect wallet"
        />
        <button onClick={connectWallet}>Connect Wallet</button>
        <button onClick={fetchNFTs} disabled={isLoading || !userAddress}>
          {isLoading ? 'Loading...' : 'View NFTs'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {isLoading && nfts.length === 0 && <div className="loading-message">Loading NFTs...</div>}
      {!isLoading && nfts.length === 0 && userAddress && !error && <div className="no-nfts-message">No NFTs found for this address.</div>}


      <div className="nft-grid">
        {nfts.map((nft, index) => (
          <div key={nft.tokenId || index} className="nft-card"> {/* Use tokenId as key for better performance */}
            <div className="nft-image-container">
              <img 
                src={nft.image} 
                alt={nft.name} 
                onError={(e) => {
                  e.target.src = DEFAULT_IMAGE_PLACEHOLDER; // Fallback on image load error
                  e.target.onerror = null; // Prevent infinite loop
                }}
              />
            </div>
            <div className="nft-details">
              <h3>{nft.name}</h3>
              <p className="nft-description">{nft.description}</p>
              <div className="nft-meta">
                <p><strong>Token ID:</strong> {nft.tokenId}</p>
                <p><strong>Contract:</strong> {nft.contractAddress.slice(0, 6)}...{nft.contractAddress.slice(-4)}</p>
                {nft.attributes && nft.attributes.length > 0 && (
                  <div className="nft-attributes">
                    <h4>Attributes:</h4>
                    <ul>
                      {nft.attributes.map((attr, i) => (
                        <li key={i}>
                          <strong>{attr.trait_type || attr.key || `Attribute ${i + 1}`}:</strong> {attr.value}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
