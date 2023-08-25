const AWS = require('aws-sdk');
const neonjs = require('@cityofzion/neon-js');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'your-aws-region'
});

const kms = new AWS.KMS();

// Function to sign a message with AWS KMS
async function signWithKMS(message) {
  const signParams = {
    KeyId: 'arn-of-your-cmk',
    Message: Buffer.from(message),
    MessageType: 'RAW',
    SigningAlgorithm: 'ECDSA_SHA_256'
  };

  const signData = await kms.sign(signParams).promise();
  return signData.Signature.toString('hex');
}

// Function to create a Neo transaction using neon-js and sign it with KMS
async function createAndSignTransaction(sender, dataHash, inputData1, inputData2, inputData3) {
  const tx = new neonjs.tx.Transaction();

  // Create the transaction

  // Sign the transaction with KMS
  const messageToSign = tx.serialize(false); // Use serialized transaction without witnesses
  const signature = await signWithKMS(messageToSign);
  const neoSignature = neonjs.u.str2hexstring(signature);

  tx.addAttribute(neonjs.tx.TxAttrUsage.Script, neoSignature);
  const rpcClient = new neonjs.rpc.RPCClient('http://localhost:20332');
  const response = await rpcClient.sendRawTransaction(tx.serialize());
  return response;


}

module.exports = { createAndSignTransaction };
