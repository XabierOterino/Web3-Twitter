pragma solidity ^0.8.0;
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";


contract Wallet is Ownable{
    bytes public ETHEREUM_TAG;    

    constructor() Ownable(){
        newCoin("eth" , address(0));

    }
    struct coin{
        string ticker;
        address _contract;
    }
    mapping(address => mapping (bytes => uint)) private _balances;
    mapping(bytes=> coin) private _fromBytesToCoin;
    bytes[]  private _coins;

    function newCoin(string memory ticker , address _contract) public onlyOwner{
        bytes memory coinTag = (abi.encodePacked(ticker));
        if(keccak256(abi.encodePacked(ticker)) == keccak256(abi.encodePacked("eth"))){
            ETHEREUM_TAG = coinTag;
        }
        require(_fromBytesToCoin[coinTag]._contract==address(0) , "Coin already listed");
        _coins.push(coinTag);
        _fromBytesToCoin[coinTag] = coin(ticker , _contract);
    }

    function available() public view returns(bytes[] memory){
        return _coins;
    }
    function bytesToCoin(bytes memory tag) public view returns(coin memory){
        require(_fromBytesToCoin[tag]._contract!=address(0));
        return _fromBytesToCoin[tag];

    }
    function _balanceOf( address user, bytes memory tag ) internal view returns(uint){
        return _balances[user][tag];
    }

    function _withdraw(address to ,bytes memory tag , uint amount) internal {
        require(amount>0);
        require(_exists(tag));
        require(_balances[to][tag]>=amount);
        if(keccak256(tag)!= keccak256(ETHEREUM_TAG)){
        IERC20(_fromBytesToCoin[tag]._contract).transferFrom( address(this), to , amount);}
        
    }

    function _transfer(address from , address to , bytes memory tag , uint amount) internal{
        require(amount>0);
        require(_exists(tag));
        require(_balances[from][tag]>=amount);
        _balances[from][tag]-=amount;
        _balances[to][tag]+=amount;
        
    }
    function _deposit( address from ,bytes memory tag, uint amount) internal {
        require(amount>0);
        require(_exists(tag));
        if(keccak256(tag)!=keccak256(ETHEREUM_TAG)){
             IERC20(_fromBytesToCoin[tag]._contract).transferFrom(from , address(this) , amount);}
        _balances[from][tag]+=amount;
    }

    function _exists(bytes memory tag) internal view returns (bool){
        for(uint i= 0 ; i<_coins.length ; i++){
            if(keccak256(_coins[i])==keccak256(tag)){
                return true;
                break;
            }
        }
        return false;
    }
}