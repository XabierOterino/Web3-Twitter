pragma solidity ^0.8.0;
import "./Client.sol";
import "./Wallet.sol";
import "./Messages.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../node_modules/@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "../node_modules/@openzeppelin/contracts/utils/Strings.sol";


/**
* This is the main script of the contract , inheriting from all the other modules
* Uses the Counters utils library from OpenZeppelin to manage the tweet indexes
* Uses the hooks of the other modules to create the main functions
* Uses reentrancy guard as it can also manage real money
 */
contract Twitter is Client , Wallet , ReentrancyGuard{
    using Counters for Counters.Counter;
    Counters.Counter private _counter;

    event Published(uint indexed index , address from ,uint timestamp);
    event Retweeted (address from , uint indexOfRT , uint timestamp);
    event Liked(address from, uint indexOfLiked , uint timestamp);

    mapping(address => bool) private _registered;

    modifier registered(){//checks if someone is registered
        require(signedUp(msg.sender));
        _;
    }
    modifier notRegistered(){// cjecks if someone is NOT registered
        require(!signedUp(msg.sender));
        _;
    }

    constructor() Wallet(){}//Inherits from wallet also

    function signedUp(address client) public view returns (bool){
        return _registered[client];
    }

    /**
    * @notice Function to add a new Tweet to the list , it only requires 1 parameter 
        -Inner text
    *@ dev from => msg.sender , 
        text => text , 
        likes => 0 , 
        rt => 0 , 
        timestamp => current timestamp 
        index => current index
     */
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
    /**
    * Function to register in the platform , this is filled in the front end by automatically uploading the pictures
    to IPFS and fetching the url
     */
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
    //  Follow a user
    function follow(string memory userName ) public registered{
        address toFollow = searchByName(userName).ad;
        require(toFollow!=msg.sender);
        require(!_follows(msg.sender , toFollow));
        _changeFollowers(msg.sender , toFollow );
    }

    // Retweet a tweet
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
    // Like a tweet
    function like(uint publicationId) public registered{
        _like(msg.sender , publicationId);
        emit Liked(msg.sender, publicationId, block.timestamp);
        

    }
    /**
    * Function that allows you to transfer funds to any other user by just typing the username and the amount
     */

    
    function transfer(string memory userName, bytes memory tag , uint amount) public registered {        
        address recipient = searchByName(userName).ad;
        require (recipient!=address(0));
        _transfer(msg.sender, recipient , tag, amount);

    }
    /**
    * The balance of a user
     */
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
    /**
    @dev as the funds are transfered internally in the contract , we need a function to pull the funds
     */
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