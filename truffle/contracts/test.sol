pragma solidity ^0.4.23;

contract Test {
  address public owner;

  constructor() public {
    owner = msg.sender;
  }

  function hello() public pure returns (string) {
    return "world";
  }

}
