const AWS = require('aws-sdk');
const neonjs = require('@cityofzion/neon-js');
const { default: Neon, tx, rpc, u } = require("@cityofzion/neon-js");
const rpcClient = new rpc.RPCClient("http://localhost:30333");
AWS.config.update({
  accessKeyId: 'AKIA3KF6B62DPYNFR3DW',
  secretAccessKey:'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',
  region: 'us-east-1'
});

const kms = new AWS.KMS();

// Function to sign a message with AWS KMS
async function signWithKMS(message) {
  const signParams = {
    KeyId: 'arn:aws:kms:us-east-1:777787668102:key/b22c5ec9-e489-417a-ab41-602cb51a3d5b',
    Message: Buffer.from(message),
    MessageType: 'RAW',
    SigningAlgorithm: 'ECDSA_SHA_256'
  };

  const signData = await kms.sign(signParams).promise();
  return signData.Signature.toString('hex');
}

 async function invokeContract( sender,Datahash,inputData1,signature1) {

  const script = neonjs.sc.createScript({
    scriptHash: '0xfbf8174549453abb09ab7192a2e7083d9977efce',
    operation: 'ExecuteFunction',
    args: [
      neonjs.default.create.contractParam("PublicKey", sender),
      neonjs.default.create.contractParam("String", Datahash),
      neonjs.default.create.contractParam("String", "signature1"),
      neonjs.default.create.contractParam("Integer", inputData1)
    ]
  });
  console.log(script);
  console.log("------------------------------------------");
  //sign the transaction with kms
  const signature = await signWithKMS(script);
  console.log(signature);
  //create the transaction
  // Construct the invocation transaction
const invocationTx = neonjs.tx.InvocationTransaction.createInvocationTx([], [], script);
invocationTx.addWitness(neonjs.tx.Witness.fromSignature(signature, 'ECC_NIST_P256'));
console.log(invocationTx);
  // Send the transaction to the network
  const response = await rpcClient.sendRawTransaction(invocationTx.serialize(true));
  console.log(response);
  return response;


}

module.exports = {
  invokeContract
}




