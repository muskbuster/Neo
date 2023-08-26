const AWS = require('aws-sdk');
const neonjs = require('@cityofzion/neon-js');
const { default: Neon, tx, rpc, u } = require("@cityofzion/neon-js");
const rpcClient = new rpc.RPCClient("http://seed2t5.neo.org:20332");
AWS.config.update({
  accessKeyId: 'AKIA3KF6B62DPYNFR3DW',
  secretAccessKey:'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',
  region: 'us-east-1'
});
const vars = {};

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
    scriptHash: '0x7203d97ab14fd45b547c30b3f25548130c336100',
    operation: 'executeFunction',
    args: [
      neonjs.default.create.contractParam("PublicKey", "03e20a907a0b5d0e4bbf1af9b0e609803bc141998d9a11d7d770f75d7e2fa1bb56"),
      neonjs.default.create.contractParam("ByteArray", "010101"), // Corrected hexadecimal string
      neonjs.default.create.contractParam("ByteArray", "010101"),
      neonjs.default.create.contractParam("Integer", 10),
    ]
  });
  console.log(script);
  console.log("------------------------------------------");
  const currentHeight = await rpcClient.getBlockCount();
  console.log("\u001b[32m  ✓ Current block height: \u001b[0m", currentHeight);
vars.tx = new tx.Transaction ({
  signers: [
    {
    account: '',
    scopes: tx.WitnessScope.CalledByEntry,
  },
  ],
  script: script,
  validUntilBlock: currentHeight+ 10000,
});
console.log("\u001b[32m  ✓ Transaction created \u001b[0m");
console.log(vars.tx.serialize(true));
serialsig=vars.tx.serialize(true);
  //sign the transaction with kms
  const signature = await signWithKMS(serialsig);
  console.log("------------------------------------------");
  console.log("------------------------------------------");
  console.log(signature);
  //create the transaction
  // Create a transaction object
const result = await rpcClient.sendRawTransaction(signature);
console.log(result);

}

module.exports = {
  invokeContract
}




