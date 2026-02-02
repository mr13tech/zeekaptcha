import absintheLogo from "/absinthelabs.png";
import github from "/github.svg";
import Zeekaptcha from "zeekaptcha";
import {
  createWeb3Modal,
  defaultConfig,
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import "./App.css";

function App() {
  // 1. Get projectId
  // @todo remove this before os release. Use from user ENV
  const projectId = "5e6cde81be287a91b0cde1bf70e652a0";

  // 2. Set chains
  const sepolia = {
    chainId: 11155111,
    name: "Sepolia",
    currency: "ETH",
    explorerUrl: "https://sepolia.etherscan.io/",
    rpcUrl:
      "https://eth-sepolia.g.alchemy.com/v2/h1v_tiu0M3dX4gCTIYd1V8AV106CPQWW",
  };

  // 3. Create modal
  const metadata = {
    name: "My Website",
    description: "My Website description",
    url: "http://localhost:5173", // origin must match your domain & subdomain
    icons: ["http://localhost:5173/absinthelabs.png"],
  };

  createWeb3Modal({
    ethersConfig: defaultConfig({ metadata }),
    chains: [sepolia],
    projectId,
    enableAnalytics: false,
  });

  const { address, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  const Logo = () => (
    <div>
      <a href="https://absinthelabs.xyz" target="_blank">
        <img src={absintheLogo} className="logo" alt="Absinthe logo" />
      </a>
      <h1>Zeekaptcha</h1>
      <h2>Open Source On-Chain Reputation and Sybil Resistance</h2>
    </div>
  );

  const Catpcha = () => (
    <div className="card">
      <Zeekaptcha address={address} provider={walletProvider} />
      <p className="read-the-docs">Click on the Absinthe logo to learn more</p>
    </div>
  );

  const Footer = () => (
    <a
      className="ztw-w-96 ztw-h-96"
      href="https://github.com/AbsintheLabs/zeekaptcha"
      target="_blank"
      rel="noreferrer"
    >
      <img src={github} alt="github" className="logo" />
    </a>
  );

  return (
    <>
      <w3m-button />
      <Logo />
      {isConnected ? <Catpcha /> : <h2> 🔗 Please connect wallet </h2>}
      <Footer />
    </>
  );
}

export default App;
