const assert=require('assert');
const ganache=require('ganache-cli');
const Web3=require('web3');
const web3=new Web3(ganache.provider());

const {abi,bytecode}=require('../compile');
// console.log(abi);
// console.log(bytecode);

let lottery;
let accounts;

beforeEach(async ()=>{
    accounts = await web3.eth.getAccounts();
    lottery=await new web3.eth.Contract(abi)
        .deploy({data:bytecode})
        .send({from:accounts[0],gas:'1000000'});
});

describe('Lottery Contract',()=>{
    it('deploys a contract',()=>{
        assert.ok(lottery.options.address);
    });
    it('adds one and only one address',async ()=>{
        await lottery.methods.addPlayer().send({
            from:accounts[0],
            value:web3.utils.toWei('0.2','ether')
        });
        const players=await lottery.methods.getPlayers().call({
            from:accounts[0],
        });
        assert.equal(accounts[0],players[0]);
        assert.equal(1,players.length); 
    });
});