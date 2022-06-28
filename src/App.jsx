import React,{useEffect,useState} from "react";
import { ethers } from "ethers";
import './App.css';
import abi from "./utils/WavePortal.json"

export default function App() {
   const [currentAccount, setCurrentAccount] = useState("");
  const [loading ,setLoading] = useState(false);
  let count;
  const [waves,setWaves] = useState(0);
  const [allWaves , setAllWaves] = useState([]);
  const [msg, setMsg] = useState("");

  let  contractAddress ="0xfbA33ed505AEca854f36Bd22A248c85509991B1b";
    const contractABI = abi.abi;
  const wave = async () =>{

      try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

         count = await wavePortalContract.getTotalWaves();
        setWaves(count.toNumber());
        // console.log(waves);
        console.log("Retrieved total wave count...", count.toNumber());


        //writing to blockchain
    

         const waveTxn = await wavePortalContract.wave(msg,{gasLimit : 300000});
        console.log("Mining...", waveTxn.hash);
        setLoading(true);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        setLoading(false);
        count = await wavePortalContract.getTotalWaves();
        setWaves(count.toNumber());
        
        console.log("Retrieved total wave count...", count.toNumber());
        let allWaves  = await  wavePortalContract.getAllWaves();
        // console.log(allWaves);


          let wavesCleaned = [];
        allWaves.forEach(wave => {
          wavesCleaned.push({
            address: wave.owner,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });
         wavesCleaned.reverse();

        setAllWaves(wavesCleaned);
        setMsg("");
        
        // console.log(allWaves);


       

      } 
      
      
      else {
        console.log("Ethereum object doesn't exist!");
      }



        
    } catch (error) {
      console.log(error);
    }
    
  }


  const getAllWaves = async () =>{
    if(window.ethereum)
    {
      const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);


      let allWaves  = await  wavePortalContract.getAllWaves();
       

          let wavesCleaned = [];
        allWaves.forEach(wave => {
          wavesCleaned.push({
            address: wave.owner,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });

     wavesCleaned.reverse();

        setAllWaves(wavesCleaned);

      //alternate to above code using event from contract


/**
 * Listen in for emitter events!
 */
// useEffect(() => {
//   let wavePortalContract;

//   const onNewWave = (from, timestamp, message) => {
//     console.log("NewWave", from, timestamp, message);
//     setAllWaves(prevState => [
//       ...prevState,
//       {
//         address: from,
//         timestamp: new Date(timestamp * 1000),
//         message: message,
//       },
//     ]);
//   };

//   if (window.ethereum) {
//     const provider = new ethers.providers.Web3Provider(window.ethereum);
//     const signer = provider.getSigner();

//     wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
//     wavePortalContract.on("NewWave", onNewWave);
//   }

//   return () => {
//     if (wavePortalContract) {
//       wavePortalContract.off("NewWave", onNewWave);
//     }
//   };
// }, []);
      
      
      
    }
    else{
      console.log("Ethereum object does not exist!");
      
    }
  }
 

  
 const checkIfWalletIsConnected = async () => {
try{
  
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
    } else {
      console.log("We have the ethereum object", ethereum);
    }


     const accounts = await ethereum.request({ method: "eth_accounts" });
   if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account)
     const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

       count = await wavePortalContract.getTotalWaves();
        setWaves(count.toNumber());
        // console.log(waves);
        console.log("Retrieved total wave count...", count.toNumber());

       getAllWaves();
     
   
     
      } else {
        console.log("No authorized account found")
      }
} catch(err)
  {
  console.error(err);
  }

  }
  /*
  * This runs our function when the page loads.
  */
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])





   const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
      
    } catch (error) {
      console.log(error)
    }
  }




  
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        👋 Hey there!
        </div>

        <div className="bio">
        I am Shubham and I am working on a bloackchain based project .
        </div>

      <div>
        <label>Enter your mesage :</label><br/>
        <input style={{padding: "12px",margin:"5px", width:"290px"}} 
          value ={msg}
          onChange={(e)=>setMsg(e.target.value)}/ >
       
      </div>
        
        {!loading && 
        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>
          
     
        }
        {loading &&
          <span>Loading</span>
        }

        Total Waves : {waves}

        <div className="Messsages">
          <h3>
          Messages 
          </h3>
          {
            allWaves.map((wave,index) =>{
              return(
                <div key={index} style={{ backgroundColor: "grey", marginTop: "16px", padding: "8px" , borderRadius: "9px" }}>
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>
              )
            })
          }
        </div>

     

          {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
}
