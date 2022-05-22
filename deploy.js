const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const { abi, bytecode } = require('./compile');
const {mnemonic,url}=require('./credentials.js');
const provider = new HDWalletProvider(
  mnemonic,
  url
);
//0xBCdF13c3F475a97bc8eC42C380e97FB21A4D7c14
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  // console.log(accounts);

  console.log('Attempting to deploy from account', accounts[0]);
  
  const result = await new web3.eth.Contract(abi)
    .deploy({ data: bytecode })
    .send({ gas: '1000000', from: accounts[0] });

  console.log('Contract deployed to', result.options.address);
  console.log(abi);
  provider.engine.stop();
};
deploy();
