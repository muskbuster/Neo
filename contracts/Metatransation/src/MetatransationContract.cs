﻿using System;
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

        [DisplayName("NumberChanged")]
        public static event Action<UInt160, BigInteger> OnNumberChanged;

        public static bool ChangeNumber(BigInteger positiveNumber)
        {
            if (positiveNumber < 0)
            {
                throw new Exception("Only positive numbers are allowed.");
            }

            StorageMap contractStorage = new(Storage.CurrentContext, Prefix_NumberStorage);
            contractStorage.Put(Tx.Sender, positiveNumber);
            OnNumberChanged(Tx.Sender, positiveNumber);
            return true;
        }

        public static ByteString GetNumber()
        {
            StorageMap contractStorage = new(Storage.CurrentContext, Prefix_NumberStorage);
            return contractStorage.Get(Tx.Sender);
        }

        [DisplayName("_deploy")]
        public static void Deploy(object data, bool update)
        {
            if (update) return;

            var key = new byte[] { Prefix_ContractOwner };
            Storage.Put(Storage.CurrentContext, key, Tx.Sender);
        }
        
        public static void Update(ByteString nefFile, string manifest)
        {
            var key = new byte[] { Prefix_ContractOwner };
            var contractOwner = (UInt160)Storage.Get(Storage.CurrentContext, key);

            if (!contractOwner.Equals(Tx.Sender))
            {
                throw new Exception("Only the contract owner can update the contract");
            }

            ContractManagement.Update(nefFile, manifest, null);
        }
    }
}
