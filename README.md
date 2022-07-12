# memeFT Dinner
## A simple Dapp for user to mint randomly generated character and colour of NFT

### PREVIEW:

<p align="center">
<img src="https://user-images.githubusercontent.com/62827213/178413561-4eb8de08-525e-46d5-9e69-10222f2878c1.PNG" width=60% height=30%>
</p>
<p align="center">
    <em>Dapp Landing Page</em>
</p>

<p align="center">
<img src="https://user-images.githubusercontent.com/62827213/178413732-d31934a8-2d7b-4ba0-88ff-8bd24fe7e928.PNG" width=60% height=30%>
</p>
<p align="center">
    <em>After Connecting Wallet</em>
</p>

<p align="center">
<img src="https://user-images.githubusercontent.com/62827213/178413912-e69f1b59-7a55-48d4-818c-cb3c945a4a18.PNG" width=60% height=30%>
</p>
<p align="center">
    <em>Minting</em>
</p>

<p align="center">
<img src="https://user-images.githubusercontent.com/62827213/178413920-46d2ca2a-70b7-4e87-b6b0-f80dddcaf25c.PNG" width=60% height=30%>
</p>
<p align="center">
    <em>Completed Minting Process</em>
</p>

[Live Preview](https://drop-me-msg.janus9.repl.co) 

[OpenSea NFT Viewing Site](https://testnets.opensea.io/collection/dinnertime) 

## Project Setup
```
npm init -y
npm install --save-dev hardhat
npm hardhat
```
### HardHat Environment
Compiling Smart Contract
```
npx hardhat compile
```
Deploying to your local Hardhat Blockchain
1. Start a Hardhat Node
   ```
   npx hardhat node
   ```
2. Deploy Smart Contract in `localhost` or `rinkeby` network
    ```
    npx hardhat run --network localhost scripts/deploy.js
    ```
    ```
    npx hardhat run --network rinkeby scripts/deploy.js
    ```

