// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;
contract Inbox{
    address public manager;
    address[] public players;
    constructor () {
        manager=msg.sender;
    }
    function addPlayer() public payable {
        require(msg.value>0.1 ether); // the value sending has to be more than 0.1 ether
        players.push(msg.sender);
    }
    
    function random() private view returns (uint){
        return uint(keccak256(abi.encodePacked(block.difficulty,block.timestamp,players))); //generates the random algorithm
    }
    function getWinner() public payable restricted{
        
        uint index=random()%players.length;
        payable(players[index]).transfer(address(this).balance); //transfering the winner the balance
        players = new address[](0);
    }
    function getPlayers() public view returns(address[] memory){
        return players; //the restricted keyword is a modifier that only manager can call it
    }
    modifier restricted(){ //the modifier
        require(msg.sender==manager);
        _;
    }
    
}