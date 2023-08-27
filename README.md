# Vantablac - Gas sponsorship and metatransactions for NEO N3 -- Monorepo

## The Motive 

🚀 Elevating the User Experience: Metatransactions brings the familiar ease of Web 2.0 to the dynamic landscape of Web3. Seamlessly transact with the power of gas transactions, ensuring a frictionless experience for all users.

🌐 Scaling Boundaries: This enable decentralized applications to scale and cater to a wider audience. enabling everyone to engage, transact on neo .

🎮 Gamification Unleashed: With transaction fee, invoking and verification of transactions out of the way for both users and products.They will be able to curate and introduce fantastic gamification tactics

(And bruv tell me who likes signing transactions again and again)

### The Implementation is straight forward right? It may not be secure and is centralised ?! Sike!! It is 10 folds secure!!! Thanks to **AWS KMS** and **stackOS**

**AWS KMS** is a service provided by AWS which allows applications to sign/verify without ever revealing the private key to the application.

(nor the user, damn!)

And guess what It supports Neo's ECC Signing curve the **secp256r1**standard(NIST-p256). The **relayer** or the **gaspaymaster** will be using these to sign the transactions which completely removes the need to expose any type of private keys.

That is I think kinda secure

The host funds the KMS with some GAS and it will consume it for every transaction it relays.
## How it works 

### Take a look 
-->video

### Tech stack used
- **Neo N3** our MVP for smartContracts ! -->C#
- **AWS KMS** for signing ! --> API
- **StackOS to** host em relayers!-->Express and react Apps 
- **Docker** coz why not ?!


The ultimate symphony
### The logic
There are 2 important things 

**The Smart Contract** -- If we take a look at the smart contracts there are 3 important functions
                           
                           
                            executeFunction() -- Relayer handler Handles the relayed transaction
                            compareHash() -- Verifys if the data sent and the dataHash are same
                            Verifysignature() --Verifys if the signature was by the right pubkey

These 3 functions will make sure the transaction being relayed is consistent with the users data and ownership.                            

**The relayer setup** -- Here it gets fun.. Currently the handle function is constructed-->signed by kms-->dispatched with quite a few hardcoded values.

However I am planning to scale in such a way that they can give the
```
 scripthash,
 ABI,
 KMS details
   ```
 and they can host a full relayer node for their contract/contracts.

The KMS is funded with gas and executed.

**Special Thanks** -- The repository of @Tkporter https://github.com/tkporter/get-aws-kms-address 
An immaculate tool which allows u to get your public key in the right format for both EVM and NEOVM specific Pubkey **Plays a key role in our KMS based Signing**.

## The megalodon

**This tech** will give rise to many verticals 
- Account Abstraction
- Social Logins
- Plug and Play smartContracts 
- Evolving Smart accounts
- Decentral IDs

And We are willing to mobilize this on Neo Chain.

## Deployments

- Smart Contract : 0x752a548d032b4c5e0bbf1d12d5a461e706e77ddd -- https://testnet.neotube.io/contract/0x752a548d032b4c5e0bbf1d12d5a461e706e77ddd

-Backend  
          
           --Docker - https://hub.docker.com/repository/docker/muskbuster/relayer-neo-stackos/general
           
           -- StackOS - https://relayer-n52-marvel.stackos.io/

-Frontend  
          
           --Docker - https://hub.docker.com/repository/docker/muskbuster/react-neo-meta/general
           
           -- StackOS - https://frontend-n52-marvel.stackos.io/

## File structures

This is a monorepo of contracts -- Backend -- Frontend(well just demonstration of concept)
You can navigate throught the folders of 

- Relayer_Backend --The Relayer Logic
- contracts/Metatransation -- The smartContracts
-DemoFrontend/my-react-app -- frontend


## Thank you U read till the end !! or did ya just scroll down eh ?