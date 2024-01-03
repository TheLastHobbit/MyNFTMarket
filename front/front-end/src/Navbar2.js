// 导航条
function Navbar({onConnectWallet,walletAddress}){
    return(
        <nav className="navbar">
            <div className="navbar-brand">
                NFT MARKETPLACE
            </div>
            <div className="navbar-menu">
                <button className="collect-wallet-button" 
                onClick={onConnectWallet}>{walletAddress.slice(0,6) || "Connect Wallet"}
                </button>
            </div>
        </nav>
    );
};
export default Navbar;