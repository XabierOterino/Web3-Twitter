pragma solidity ^0.8.0;
import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";


// MOCK Tokens to test the app


contract Matic is ERC20{
    constructor() ERC20("Polygon" , "MATIC"){
        _mint(msg.sender , 1000000);
    }
}

contract Link is ERC20{
    constructor() ERC20("Chainlink" , "Link"){
        _mint(msg.sender , 1000000);
    }
}

