const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const { abi, bytecode } = require("../compile");
// console.log(abi);
// console.log(bytecode);

let lottery;
let accounts;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  lottery = await new web3.eth.Contract(abi)
    .deploy({ data: bytecode })
    .send({ from: accounts[0], gas: "1000000" });
});

describe("Lottery Contract", () => {
  it("deploys a contract", () => {
    assert.ok(lottery.options.address);
  });
  it("adding many addresses", async () => {
    const playersBefore = await lottery.methods.getPlayers().call({
      from: accounts[0],
    });
    const plen = playersBefore.length;
    await lottery.methods.addPlayer().send({
      from: accounts[0],
      value: web3.utils.toWei("0.2", "ether"),
    });
    const playersAfter = await lottery.methods.getPlayers().call({
      from: accounts[0],
    });
    assert.equal(plen + 1, playersAfter.length);
    assert.equal(accounts[0], playersAfter[plen + 1 - 1]);
  });
  it("requires minimum amount of ether to enter", async () => {
    try {
      await lottery.methods.addPlayer.send({
        from: accounts[0],
        value: 0,
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });
  it("only manager can call pickwinner", async () => {
    try {
      await lottery.methods.getWinner().send({
        from: accounts[1],
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });
  it("sends money to the player and resets the array", async () => {
    await lottery.methods.addPlayer().send({
      from: accounts[0],
      value: web3.utils.toWei("2", "ether"),
    });
    const initalBalance = await web3.eth.getBalance(accounts[0]);
    await lottery.methods.getWinner().send({
      from: accounts[0],
    });
    const finalBalance = await web3.eth.getBalance(accounts[0]);
    const difference = finalBalance - initalBalance;
    // console.log(difference);
    assert(difference>web3.utils.toWei("1.8", "ether"));
  });
});
