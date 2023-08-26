using System;
using System.ComponentModel;
using System.Numerics;
using System.Security.Cryptography;
using Neo;
using Neo.SmartContract.Framework;
using Neo.SmartContract.Framework.Attributes;
using Neo.SmartContract.Framework.Native;
using Neo.SmartContract.Framework.Services;

namespace Metatransation
{
    [DisplayName("MetatransationContract")]
    [ManifestExtra("Author", "Sudeep Kamat")]
    [ManifestExtra("Email", "sudeepkamat79@gmail.com")]
    [ManifestExtra("Description", "An example implementation of Metatransactions for neo blockchain")]
    public class MetatransationContract : SmartContract
    {
// An event after the function is executed
        [DisplayName("FunctionExecuted")]
        public static event Action<byte[], byte[]> FunctionExecuted;
        // To create a function to handle metatransaction, we need a function which takes the following params
        // 1. byte[] sender
        // 2. byte[] datahash --this is the datahash stored when signature is takn offchain
        // 3. byte[] signature -- this is the signature of the datahash
        // 4. input variables of different types which are needed for logically executing the function

        //in the function the input variables should be validated against the datahash and signature and only then the function should be executed


    public static bool VerifySignatureWithECDsa(ByteString message, Neo.Cryptography.ECC.ECPoint pubkey, ByteString signature, NamedCurve curve)
    {
        return CryptoLib.VerifyWithECDsa(message, pubkey, signature, curve);
    }

        // Now to take input variables of different types and to validate them against the datahash and signature, we need to create a function which takes the following params
        public static bool CompareHash(byte[] inputData1, ByteString givenHash)
{
    
    ByteString hashedInput = CryptoLib.Sha256(Helper.ToByteString(inputData1));
    return hashedInput == givenHash; // returns true if the hash of the combined input is equal to the given hash
}

// Main logic to execute the function only if the datahash and signature are valid -> inputs may not bein bytes so needs conversion

public static bool ExecuteFunction(Neo.Cryptography.ECC.ECPoint sender, ByteString  dataHash, ByteString signature, BigInteger inputData1)
{
    // convert the inputs to bytes
    byte[] inputData1Bytes = inputData1.ToByteArray();
    byte[] DataBytes = Helper.ToByteArray(dataHash);
    // call the hash comparison function
    bool hashComparison = CompareHash(inputData1Bytes,dataHash);
    // check that bool must be true for the function to execute
    if(!hashComparison) throw new Exception("Invalid datahash");

    // verifying the signature
    bool signatureVerification = VerifySignatureWithECDsa(dataHash, sender, signature, NamedCurve.secp256r1);
    // check that bool must be true for the function to execute
    if(!signatureVerification) throw new Exception("Invalid signature"); 
    // if both the above bools are true, then execute the function to write to storage
    Storage.Put(Storage.CurrentContext, inputData1Bytes, inputData1Bytes);
    //emit the event
    FunctionExecuted(DataBytes, inputData1Bytes);
    return true;
    
}




    }
}
