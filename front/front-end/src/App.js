import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import UploadFail from './components/UploadFail.js';
import UploadImage from './components/UploadImage.js';
import Navbar from './components/Navbar.js';
import UploadSuccess from './components/UploadSuccess.js';
import NFTGrid from './components/NFTGrid.js';
import NFTDetail from './components/NFTDetail.js';
// 路由


function App() {
  const [WalletAddress, setWalletAddress] = useState("");
// useEffect:想在页面加载时做的
  useEffect(()=>{
    // getWalletAddress();
  // 注释掉的原因是会自动连接钱包
  // 但是监听需要的是自动监听
  addwalletListener();
  },[]);
  

  // 还要加的一个功能是监听钱包地址切换
  function addwalletListener() {
    if(window.ethereum){
    window.ethereum.on('accountsChanged', (accounts) => {
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
      }else{
        setWalletAddress("");
      }
    });
  }
}

  // 连接钱包
  const getWalletAddress = async () =>{
    if (window.ethereum) {
      try{
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]);
      }catch(error){
        console.log(error);
      }
    }
  };
     

  return (
    <div id="container">
    <Router>
      <Navbar onConnectWallet={getWalletAddress} walletAddress={WalletAddress}/>
      <Routes>
          <Route path="/create-nft" exact element={<UploadImage address={WalletAddress}/>} />
          <Route path="/success" element={<UploadSuccess />} />
          <Route path="/" element={<NFTGrid />} />
          <Route path="/nft-detail/:tokenId" element={<NFTDetail />} />
          <Route path="/error" element={<UploadFail />} />
      </Routes>
     </Router>
    </div>
  );
};

export default App;


