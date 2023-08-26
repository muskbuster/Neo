import { useState, useEffect } from "react";
import { wallet, u } from "@cityofzion/neon-core";
import "./App.css";

function App() {
  const [neoline, setNeoLine] = useState();
  const [account, setAccount] = useState("");
  const [error, setError] = useState("");
  const [signedMessageData, setSignedMessageData] = useState(null);

  useEffect(() => {
    window.addEventListener("NEOLine.NEO.EVENT.READY", () => {
      setNeoLine(new window.NEOLineN3.Init());
    });
  }, []);

  const initNeolineAccount = async () => {
    try {
      if (!neoline) {
        setError("Neoline not ready");
        return;
      }

      const { address } = await neoline.getAccount();
      setAccount(address);
      setError(""); // Clear any previous error
    } catch (error) {
      setError("Failed to retrieve account");
      console.log(error);
    }
  };

  const handleSignMessage = async () => {
    try {
      if (!neoline) {
        setError("Neoline not ready");
        return;
      }

      const { publicKey } = await neoline.getPublicKey();

      if (!publicKey) {
        setError("Please connect and fetch public key");
        return;
      }

      const message = "21";

      const encoder = new TextEncoder();
      const messageBytes = encoder.encode(message);
      const messageHex = u.ab2hexstring(messageBytes);

      const lengthHex = u.num2VarInt(messageHex.length / 2);
      const concatenatedString = lengthHex + messageHex;
      const serializedTransaction = "010001f0" + concatenatedString + "0000";
      
      // Sign the transaction using the fetched public key
      const signedData = wallet.sign(serializedTransaction, publicKey);

      const data = {
        message: message,
        publicKey: publicKey,
        data: signedData,
      };

      setSignedMessageData(data);
      setError(""); // Clear any previous error
    } catch (error) {
      setError("Failed to sign message");
      console.log(error);
    }
  };

  return (
    <div className="App">
      {neoline === undefined && <p>Loading neoline</p>}
      {neoline && (
        <>
          <button onClick={initNeolineAccount} color="pink" size="large">
            Connect to Neoline
          </button>
          <div>
            {account && <p>Your Neoline Address: {account}</p>}
          </div>
          <button onClick={handleSignMessage} color="pink" size="large">
            Sign Message
          </button>
          {signedMessageData && (
            <div>
              <p>Signed Message Data:</p>
              <pre>{JSON.stringify(signedMessageData, null, 2)}</pre>
            </div>
          )}
          {error && <p>Error: {error}</p>}
        </>
      )}
    </div>
  );
}

export default App;
