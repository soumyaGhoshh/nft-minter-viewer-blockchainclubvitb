import React, { useState } from 'react';
import './App.css';
import Minter from './components/Minter';
import Gallery from './components/Gallery';


function App() {
  const [activeTab, setActiveTab] = useState('minter');

  return (
    <div className="App">
      <nav className="navbar">
        <button 
          onClick={() => setActiveTab('minter')}
          className={activeTab === 'minter' ? 'active' : ''}
        >
          NFT Minter
        </button>
        <button 
          onClick={() => setActiveTab('gallery')}
          className={activeTab === 'gallery' ? 'active' : ''}
        >
          NFT Gallery
        </button>
      </nav>

      <main>
        {activeTab === 'minter' ? <Minter /> : <Gallery />}
      </main>
    </div>
  );
}

export default App;