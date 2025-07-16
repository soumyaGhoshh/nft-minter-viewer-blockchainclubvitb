import { useEffect, useState } from "react";
import { 
  connectWallet, 
  getCurrentWalletConnected, 
  mintNFT 
} from "../utils/interact.js";

const Minter = (props) => {
  // State variables
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setURL] = useState("");
  const [attributes, setAttributes] = useState([{ key: "", value: "" }]);

  useEffect(() => {
    const init = async () => {
      const { address, status } = await getCurrentWalletConnected();
      setWallet(address);
      setStatus(status);
      addWalletListener();
    };
    init();
  }, []);

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };

  const onMintPressed = async () => {
    // Filter out empty attributes
    const filteredAttributes = attributes.filter(
      attr => attr.key.trim() !== "" && attr.value.trim() !== ""
    );
    
    const { status } = await mintNFT(url, name, description, filteredAttributes);
    setStatus(status);
  };

  const addAttribute = () => {
    setAttributes([...attributes, { key: "", value: "" }]);
  };

  const removeAttribute = (index) => {
    const newAttributes = [...attributes];
    newAttributes.splice(index, 1);
    setAttributes(newAttributes);
  };

  const handleAttributeChange = (index, field, value) => {
    const newAttributes = [...attributes];
    newAttributes[index][field] = value;
    setAttributes(newAttributes);
  };

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setStatus("Ready to mint your NFT!");
        } else {
          setWallet("");
          setStatus(" Connect to Metamask using the top right button.");
        }
      });
    } else {
      setStatus(
        <p>
          🦊{" "}
          <a target="_blank" rel="noreferrer" href={`https://metamask.io/download.html`}>
            You must install Metamask, a virtual Ethereum wallet, in your browser.
          </a>
        </p>
      );
    }
  }

  return (
    <div className="minter-container">
      <div className="header">
        <h1 className="title"> NFT Minter</h1>
        <button className="wallet-button" onClick={connectWalletPressed}>
          {walletAddress ? (
            `Connected: ${walletAddress.substring(0, 6)}...${walletAddress.substring(38)}`
          ) : (
            "Connect Wallet"
          )}
        </button>
      </div>

      <div className="mint-form">
        <p className="subtitle">
          Add your asset details and attributes to create a unique NFT
        </p>
        
        <div className="form-group">
          <label>Asset URL</label>
          <input
            type="text"
            placeholder="https://gateway.pinata.cloud/ipfs/..."
            value={url}
            onChange={(e) => setURL(e.target.value)}
          />
        </div>
        
        <div className="form-group">
          <label>NFT Name</label>
          <input
            type="text"
            placeholder="Nft#1"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        
        <div className="form-group">
          <label>Description</label>
          <textarea
            placeholder="Describe your NFT..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
          />
        </div>
        
        <div className="attributes-section">
          <div className="attributes-header">
            <label>Attributes</label>
            <button type="button" className="add-attribute" onClick={addAttribute}>
              + Add Attribute
            </button>
          </div>
          
          {attributes.map((attr, index) => (
            <div key={index} className="attribute-row">
              <input
                type="text"
                placeholder="Trait (e.g. Background)"
                value={attr.key}
                onChange={(e) => handleAttributeChange(index, "key", e.target.value)}
              />
              <input
                type="text"
                placeholder="Value (e.g. Blue)"
                value={attr.value}
                onChange={(e) => handleAttributeChange(index, "value", e.target.value)}
              />
              {attributes.length > 1 && (
                <button 
                  type="button" 
                  className="remove-attribute"
                  onClick={() => removeAttribute(index)}
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
        
        <button className="mint-button" onClick={onMintPressed}>
          Mint NFT
        </button>
        
        <div className="status-message">
          {status}
        </div>
      </div>
    </div>
  );
};

export default Minter;