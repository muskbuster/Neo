using System;
using System.ComponentModel;
using System.Numerics;

using Neo;
using Neo.SmartContract.Framework;
using Neo.SmartContract.Framework.Attributes;
using Neo.SmartContract.Framework.Native;
using Neo.SmartContract.Framework.Services;

namespace Metatransation
{
    [DisplayName("YourName.MetatransationContract")]
    [ManifestExtra("Author", "Sudeep Kamat")]
    [ManifestExtra("Email", "sudeepkamat79@gmail.com")]
    [ManifestExtra("Description", "An example implementation of Metatransactions for neo blockchain")]
    public class MetatransationContract : SmartContract
    {
        const byte Prefix_NumberStorage = 0x00;
        const byte Prefix_ContractOwner = 0xFF;
        private static Transaction Tx => (Transaction) Runtime.ScriptContainer;
// An event after the function is executed
        [DisplayName("FunctionExecuted")]
        public static event Action<byte[], byte[], byte[], byte[], byte[], byte[]> FunctionExecuted;
        // To create a function to handle metatransaction, we need a function which takes the following params
        // 1. byte[] sender
        // 2. byte[] datahash --this is the datahash stored when signature is takn offchain
        // 3. byte[] signature -- this is the signature of the datahash
        // 4. input variables of different types which are needed for logically executing the function

        //in the function the input variables should be validated against the datahash and signature and only then the function should be executed

        public static bool VerifyWithECDsa(byte[] message, ECPoint pubkey, byte[] signature, NamedCurve curve)
        {
            return CryptoLib.VerifyWithECDsa(message, pubkey, signature, curve);
        }

            public static bool VerifySignature(byte[] publicKey, byte[] dataHash, byte[] signature)
        {
            return Crypto.VerifySignature(dataHash, signature, publicKey);
        }

        // Now to take input variables of different types and to validate them against the datahash and signature, we need to create a function which takes the following params
        public static bool CompareHash(byte[] inputData1, byte[] inputData2, byte[] inputData3, byte[] givenHash)
{
    byte[] combinedInput = inputData1.Concat(inputData2, inputData3);
    byte[] hashedInput = Crypto.SHA256(combinedInput);
    return hashedInput == givenHash; // returns true if the hash of the combined input is equal to the given hash
}

// Main logic to execute the function only if the datahash and signature are valid -> inputs may not bein bytes so needs conversion

public static bool ExecuteFunction(UInt160 sender, byte[] dataHash, byte[] signature, BigInteger inputData1, byte[] inputData2, byte[] inputData3)
{
    // convert the inputs to bytes
    byte[] inputData1Bytes = inputData1.ToByteArray();
    byte[] inputData2Bytes = inputData2.ToByteArray();
    byte[] inputData3Bytes = inputData3.ToByteArray();
    // call the hash comparison function
    bool hashComparison = CompareHash(inputData1Bytes, inputData2Bytes, inputData3Bytes, dataHash);
    // check that bool must be true for the function to execute
    if(!hashComparison) throw new Exception("Invalid datahash");
    // verifying the signature
    bool signatureVerification = VerifySignature(sender, dataHash, signature);
    // check that bool must be true for the function to execute
    if(!signatureVerification) throw new Exception("Invalid signature"); 
    // if both the above bools are true, then execute the function to write to storage
    Storage.Put(Storage.CurrentContext, inputData1, inputData2);
    //emit the event
    FunctionExecuted(sender, dataHash, signature, inputData1, inputData2, inputData3);
    return true;
    
}




    }
}
