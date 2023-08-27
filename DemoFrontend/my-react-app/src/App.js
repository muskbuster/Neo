import React, { useState, useEffect } from "react";
import { wallet, u } from "@cityofzion/neon-core";
import axios from "axios";
import "./App.css";

function App() {
  const [neoline, setNeoLine] = useState();
  const [account, setAccount] = useState("");
  const [error, setError] = useState("");
  const [signedMessageData, setSignedMessageData] = useState(null);
  const [inputData1, setInputData1] = useState("");

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
      setError("");
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

      const message = inputData1;

      const encoder = new TextEncoder();
      const messageBytes = encoder.encode(message);
      const messageHex = u.ab2hexstring(messageBytes);

      const lengthHex = u.num2VarInt(messageHex.length / 2);
      const concatenatedString = lengthHex + messageHex;
      const serializedTransaction = "010001f0" + concatenatedString + "0000";

      const signedData = wallet.sign(serializedTransaction, publicKey);

      const inputDataValue = parseInt(inputData1);

      const data = {
        message: message,
        publicKey: publicKey,
        data: signedData,
      };

      setSignedMessageData(data);
      const requestData = {
        sender: publicKey,
        Datahash: messageHex,
        inputData1: inputDataValue,
        signature1: signedData,
      };
      // const apiUrl = "https://fictional-waffle-v5jgr976pr6fxwp6-3003.app.github.dev/invoke";
      // const response = await axios.post(apiUrl, requestData);
      // console.log("API Response:", response.data);

      await fetch("https://relayer-n52-marvel.stackos.io/invoke",{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
          
        },
        body: JSON.stringify(requestData)
      }).then((response) => response.json())

      // Move this line before the axios call
      setError("");
    } catch (error) {
      setError("Failed to sign message or invoke API");
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
          <div>
            <label>Input Data 1:</label>
            <input
              type="number"
              value={inputData1}
              onChange={(e) => setInputData1(e.target.value)}
            />
          </div>
          <button onClick={handleSignMessage} color="pink" size="large">
            Sign Message and Invoke API
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
