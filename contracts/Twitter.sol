pragma solidity ^0.8.0;
import "./Client.sol";
import "./Wallet.sol";
import "./Messages.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../node_modules/@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "../node_modules/@openzeppelin/contracts/utils/Strings.sol";

contract Twitter is Client , Wallet , ReentrancyGuard{
    using Counters for Counters.Counter;
    Counters.Counter private _counter;

    event Published(uint indexed index , address from ,uint timestamp);
    event Retweeted (address from , uint indexOfRT , uint timestamp);
    event Liked(address from, uint indexOfLiked , uint timestamp);
    mapping(address => bool) private _registered;

    modifier registered(){
        require(signedUp(msg.sender));
        _;
    }
    modifier notRegistered(){
        require(!signedUp(msg.sender));
        _;
    }

    constructor() Wallet(){}

    function signedUp(address client) public view returns (bool){
        return _registered[client];
    }

    
    function newTweet(string memory text) public registered{
        _addTweetToList(Tweet(
            msg.sender,
            text,
            0,
            0,
            block.timestamp,
            _counter.current()
            
        ));
        Counters.increment(_counter);
        emit Published(_counter.current() -1 , msg.sender, block.timestamp);


    }

    function signUp(string memory profilePic , string memory userName , string memory bio) public notRegistered{
        _newUser(
        msg.sender , 
        User(
            msg.sender,
            profilePic,
            userName, 
            bio,
            new address[](0),
            new address[](0)

        ));
        _registered[msg.sender] = true;
    }

    function follow(string memory userName ) public registered{
        address toFollow = searchByName(userName).ad;
        require(toFollow!=msg.sender);
        require(!_follows(msg.sender , toFollow));
        _changeFollowers(msg.sender , toFollow );
    }

    
    function retweet(uint publicationId , string memory text) public registered{
        require (publicationId < tweets().length , "Error , pulication not found");
        string memory s1 = string(Strings.toHexString(uint256(uint160(tweets()[publicationId].id)), 20));
        _retweet(Tweet(
            
            msg.sender,
            string(bytes.concat(bytes(text), " quoting : ", bytes(s1))),
            0,
            0,
            block.timestamp,
            _counter.current()
            
        ) , publicationId);
        Counters.increment(_counter);
        emit Retweeted(msg.sender, publicationId, block.timestamp);
    }
    
    function like(uint publicationId) public registered{
        _like(msg.sender , publicationId);
        emit Liked(msg.sender, publicationId, block.timestamp);
        

    }

    function transfer(string memory userName, bytes memory tag , uint amount) public registered {        
        address recipient = searchByName(userName).ad;
        require (recipient!=address(0));
        _transfer(msg.sender, recipient , tag, amount);

    }

    function balanceOf(address user, bytes memory tag) public view returns (uint){
        return _balanceOf(user, tag);
    }



    function deposit(bytes memory tag, uint amount) public registered payable{
        if(keccak256(tag)==keccak256(ETHEREUM_TAG)){
            require(msg.value>0 && msg.value==amount);
            _deposit(msg.sender , tag , amount);
            
        }else{
            _deposit(msg.sender , tag , amount);}
    }

    function withdraw(bytes memory tag , uint amount) public registered nonReentrant{
        if(keccak256(tag)==keccak256(ETHEREUM_TAG)){
            _withdraw(msg.sender , tag , amount);
            msg.sender.call{value:amount}("");
            
        }else{
            _withdraw(msg.sender , tag , amount);}

    }
   
    function currentTime() public view returns(uint){
        return block.timestamp;
    }


    
}