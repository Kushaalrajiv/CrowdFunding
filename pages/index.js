import { useState, useEffect } from "react";
import { ethers } from "ethers";
import LockContract from "../artifacts/contracts/Assessment.sol/Lock.json"; 
// import './index.css';

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [lockContract, setLockContract] = useState(undefined);
  const [newContribution, setNewContribution] = useState("");
  const [contributors, setContributors] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [contractStatus, setContractStatus] = useState("Open"); 
  const [buttonHovered, setButtonHovered] = useState(false); 

  const contractAddress = "0x5432A921CC9111AB010aE115bc36d3CF594bf9e8"; 
  const lockABI = LockContract.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(new ethers.providers.Web3Provider(window.ethereum));
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.send("eth_requestAccounts", []);
    setAccount(accounts[0]);

  
    getLockContract();
  };

  const getLockContract = () => {
    const lockInstance = new ethers.Contract(
      contractAddress,
      lockABI,
      ethWallet.getSigner()
    );
    setLockContract(lockInstance);
  };

  const contributeFunds = async () => {
    if (lockContract && newContribution !== "") {
      try {
        // Convert the entered contribution to wei
        const contributionWei = ethers.utils.parseEther(newContribution);
        const tx = await lockContract.contribute({ value: contributionWei });
        await tx.wait(); 
        
        // Clear the input field after successful contribution
        setNewContribution("");
  
        // Refresh contributions data
        await getContributions();
      } catch (error) {
        console.error("Error contributing funds:", error);
      }
    }
  };

  const withdrawFunds = async () => {
    if (lockContract) {
      try {
      
        const tx = await lockContract.withdrawFunds();
        await tx.wait(); 
        alert('Withdrawn Successfully!');
    
      } catch (error) {
        console.error("Error withdrawing funds:", error);
       
      }
    }
  };

  const getContributions = async () => {
    if (lockContract) {
      try {
       
        const result = await lockContract.getContributions();
        const contributorsList = result[0];
        const contributionsList = result[1];
        const isCampaignComplete=await lockContract.campaignComplete();
        console.log(isCampaignComplete);
        setContributors(contributorsList);
        setContributions(contributionsList);
        setContractStatus(isCampaignComplete ? "Closed" : "Open");
      } catch (error) {
        console.error("Error getting contributions:", error);
        
      }
    }
  };

  useEffect(() => {
    getWallet();
  }, []);

  useEffect(() => {
    if (contributors.length === 0) {
      // If contributors array is empty, get contributions to display the table
      getContributions();
    }
  }, [contributors]);

  return (
    <main className="container">
      <header>
        <h1>Crowd Funding</h1>
        <h2>Help us in our mission!</h2>
      </header>
      {ethWallet && account ? (
        <div className="user-info">
          <p style={{ fontWeight: 'bold', fontSize: '20px', color: '#008c8c' }}>Your Account: {account}</p>
          <p style={{ fontWeight: 'bold', fontSize: '20px', color: contractStatus === 'Open' ? '#4caf50' : '#f44336' }}>Contract Status: {contractStatus}</p>
          <div className="contribution-input">
            {contractStatus === "Open" && (
              <>
                <input
                  type="text"
                  placeholder="Enter Contribution (ETH)"
                  value={newContribution}
                  onChange={(e) => setNewContribution(e.target.value)}
                />
                <button
                  onMouseEnter={() => setButtonHovered(true)} 
                  onMouseLeave={() => setButtonHovered(false)}
                  style={{
                    backgroundColor: buttonHovered ? "#ff9800" : "#4caf50",
                    color: "white",
                    border: "none",
                    padding: "10px 20px",
                    fontSize: "16px",
                    cursor: "pointer",
                    borderRadius: "5px",
                  }}
                  onClick={contributeFunds}
                >
                  Contribute
                </button>
              </>
            )}
            {contractStatus === "Closed" && (
              <button className="withdraw-button" onClick={withdrawFunds}>Withdraw Funds</button>
            )}
          </div>
        </div>
      ) : (
        <button className="connect-button" onClick={connectAccount}>
          Connect Metamask Wallet
        </button>
      )}
      <div className="contribution-table">
      <h2 className="mesaage">Thanks to our generous Contributors!!</h2>
        <table>
          <thead>
            <tr>
              <th>Contributor</th>
              <th>Contribution (ETH)</th>
            </tr>
          </thead>
          <tbody>
            {contributors.map((contributor, index) => (
              <tr key={index}>
                <td>{contributor}</td>
                <td>{ethers.utils.formatEther(contributions[index])}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <style jsx>
        {`.{
          margin:0;
          padding:0;
        }
        body {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
          background-image: url('https://visme.co/blog/wp-content/uploads/2017/07/50-Beautiful-and-Minimalist-Presentation-Backgrounds-08.jpg');
          background-size: cover; /* Cover the entire page */
          background-repeat: no-repeat; /* Prevent the image from repeating */
          background-position: center; /* Center the image */
          font-family: Arial, sans-serif;
        }

        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 2px solid #008c8c;
          padding: 20px;
          border-radius: 10px;
          background-image: url('https://visme.co/blog/wp-content/uploads/2017/07/50-Beautiful-and-Minimalist-Presentation-Backgrounds-08.jpg');
          background-size: cover; /* Cover the entire page */
          background-repeat: no-repeat; /* Prevent the image from repeating */
          background-position: center; /* Center the image */
          box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
        }

        .connect-button {
          background-color: #008c8c;
          color: white;
          border: none;
          padding: 10px 20px;
          font-size: 16px;
          cursor: pointer;
          margin-top: 20px;
          border-radius: 5px;
          transition: background-color 0.3s ease;
        }

        .connect-button:hover {
          background-color: #006868;
        }

        .user-info {
          margin-top: 20px;
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
        }

        .withdraw-button {
          background-color: #008c8c;
          color: white;
          border: none;
          padding: 10px 20px;
          font-size: 16px;
          cursor: pointer;
          margin-top: 20px;
          border-radius: 5px;
          transition: background-color 0.3s ease;
        }

        .withdraw-button:hover {
          background-color: #006868;
        }

          .contribution-input {
            margin-top: 20px;
          }

          .contribution-input input {
            padding: 8px;
            font-size: 16px;
            margin-right: 10px;
          }

          .contribution-table {
            margin-top: 20px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
          }

          .contribution-table table {
            width: 100%;
            border-collapse: collapse;
          }

          .contribution-table th,
          .contribution-table td {
            padding: 10px;
            border-bottom: 1px solid #ddd;
          }

          h1, h2{
            color: #005b7e;
            text-align: center;
            transition: color 0.3s ease;
            font-size: 44px; /* Change this to the size you want */
            
          }
          h1:hover, h2:hover{
            color: #008c8c;
            text-shadow: 0 0 2px #f0f0f0, 0 0 2px #f0f0f0, 0 0 2px #f0f0f0, 0 0 2px #f0f0f0;
          }

          .mesaage{
            color: #008c8c;
            text-align: center;
          }

          .message:hover{
            text-shadow: none;
          }


          // h1{
          //   font-size: 44px; /* Change this to the size you want */
          // }
          h2{
            font-size: 26px; /* Change this to the size you want */
          }
        `
          }
      </style>
    </main>
  );
}
