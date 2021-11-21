require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-web3");
require("web3");
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const ALCHEMY_URL = 'https://eth-rinkeby.alchemyapi.io/v2/zVkRhSblnpy5Y8iiYklF7g3xoUrENYLR';
const PRIVATE_KEY = 'fcca5167397b99613126fa9eb9b4299ced4f1d83b36b52bba8a5af1b568eb57f';
              
task("transferDonatTo", "Transfer donat from contract to account")
  .addParam("accountReceiver", "The account's address")
  .addParam("id", "Id of transferable donation")
  .addParam("privateKey", "Private key of owner")
  .setAction(async (taskArgs) => {
    require('dotenv').config();
    
    const web3 = new createAlchemyWeb3(ALCHEMY_URL);
    const networkId = await web3.eth.net.getId();
    
    var fs = require('fs');
    var jsonFile = "frontend/src/Token.json";
    var parsed= JSON.parse(fs.readFileSync(jsonFile));
    var abi = parsed.abi;
    var abiAdr = parsed.address;
    
    var myContract = new web3.eth.Contract( abi,abiAdr);
    
    const gasPrice = await web3.eth.getGasPrice();
    const data = myContract.methods.transferTo(
      taskArgs.accountReceiver,taskArgs.id)
        .encodeABI();
    const nonce = await web3.eth.getTransactionCount(taskArgs.accountReceiver);

    const signedTx = await web3.eth.accounts.signTransaction(
      {
        to: myContract.options.address,
        data,
        gas:6000000,
        gasPrice,
        nonce,
        chainId: networkId
      },
      taskArgs.privateKey
    );
    
    const receipt = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction
    );

    console.log('Transaction hash:',receipt.transactionHash);
});

task("sendDonatFrom", "Transfer donat from account to contract")
  .addParam("addressSender", "The sender's account address")
  .addParam("privateKey", "Private key of donater")
  .addParam("sum", "Sum of donation in Wei")
  .setAction(async (taskArgs) => {
  require('dotenv').config();
  const web3 = new createAlchemyWeb3(ALCHEMY_URL);
  const networkId = await web3.eth.net.getId();
  
  var value1 = taskArgs.sum;
  var fs = require('fs');
  var jsonFile = "frontend/src/Token.json";
  var parsed= JSON.parse(fs.readFileSync(jsonFile));
  var abi = parsed.abi;
  var abiAdr = parsed.address;
  
  
  var myContract = new web3.eth.Contract( abi,abiAdr);
  
  const gasPrice = await web3.eth.getGasPrice();
  const data = myContract.methods.donate().encodeABI();
  const nonce = await web3.eth.getTransactionCount(taskArgs.addressSender);
  const signedTx = await web3.eth.accounts.signTransaction(
    {
      to: myContract.options.address,
      data,
      gas:6000000,
      value: value1,
      gasPrice,
      nonce,
      chainId: networkId
    },
    taskArgs.privateKey
  );
  
  const receipt = await web3.eth.sendSignedTransaction(
    signedTx.rawTransaction
  );
  console.log('Transaction hash:',receipt.transactionHash);
});


task("getDonators", "To get list of donators address's")
  .addParam("addressSender", "The sender's account address")
  .setAction(async (taskArgs) => {
  require('dotenv').config();
  const web3 = new createAlchemyWeb3(ALCHEMY_URL);

  var fs = require('fs');
  var jsonFile = "frontend/src/Token.json";
  var parsed= JSON.parse(fs.readFileSync(jsonFile));
  var abi = parsed.abi;
  var abiAdr = parsed.address;
 
  var myContract = new web3.eth.Contract( abi,abiAdr);
  
  const result = await myContract.methods.getDonators().call(
      {from:taskArgs.addressSender,gas:6000000}
  );

  for (const accounts of result){
    console.log(accounts.donater);
  }
});

task("getDonat", "To get information about donat")
  .addParam("addressSender", "The sender's account address")
  .addParam("id", "ID of donat")
  .setAction(async (taskArgs) => {
  require('dotenv').config();
  const web3 = new createAlchemyWeb3(ALCHEMY_URL);

  var fs = require('fs');
  var jsonFile = "frontend/src/Token.json";
  var parsed= JSON.parse(fs.readFileSync(jsonFile));
  var abi = parsed.abi;
  var abiAdr = parsed.address;
 
  var myContract = new web3.eth.Contract( abi,abiAdr);
  
  const result = await myContract.methods.getdonat(taskArgs.id).call(
      {from:taskArgs.addressSender,gas:6000000}
  );
    
  console.log("Адрес пожартвовавшего:",result.donater);
  console.log("Сумма пожертвования:",result.amount);
  console.log("Id пожертвования:",result.id);
  console.log("Пожертвование уже переведено?:",result.isReceive); 
  
});

task("getBalanceOf", "To get balance of donater")
  .addParam("addressSender", "The donator's account address")
  .setAction(async (taskArgs) => {
  require('dotenv').config();
  const web3 = new createAlchemyWeb3(ALCHEMY_URL);

  var fs = require('fs');
  var jsonFile = "frontend/src/Token.json";
  var parsed= JSON.parse(fs.readFileSync(jsonFile));
  var abi = parsed.abi;
  var abiAdr = parsed.address;
 
  var myContract = new web3.eth.Contract( abi,abiAdr);
  
  const result = await myContract.methods.getbalanceOf(taskArgs.addressSender)
  .call(
      {from:taskArgs.addressSender,gas:6000000}
  );
  
  console.log('Balance:',result.balance); 
});

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks:{
    rinkeby:{
      url:ALCHEMY_URL,
      accounts: ['0x'+PRIVATE_KEY]
    }
  }
};
