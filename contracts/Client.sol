pragma solidity ^0.8.0;
import {Publications} from "./Publications.sol";

contract Client is Publications{
    
    
    address [] private _users;
    mapping (address => User) private _usersByAddress;

    struct User {
        address ad;
        string profilePic;
        string userName;
        string bio;
        address[] followers;
        address [] followed;
    }

    function usersByAddress(address client) public view returns( User memory){
        return _usersByAddress[client];
    }

    function users() internal view returns (address [] memory){
        return _users;
    }
    function _newUser(address client, User memory usr) internal{
        _users.push(client);
        _usersByAddress[client] = usr;
    }

    function usersData() public view returns (User [] memory){
        User [] memory usersData = new User[](users().length);
        for(uint i =0 ; i<users().length ; i++){
            usersData[i] = _usersByAddress[users()[i]];

        }
        return usersData;
    }

    function searchByName(string memory userName) public view returns (User memory){
        require(_userExists(userName), "Error : User not found.");
        for(uint i=0 ; i < _users.length ; i++){
            if(keccak256(abi.encodePacked(usersByAddress(_users[i]).userName)) == keccak256(abi.encodePacked(userName))){
                return usersByAddress(_users[i]);
                break;
            }

        }

    }

    function _userExists(string memory userName) public view returns (bool){
        for(uint i=0 ; i < _users.length ; i++){
            if(keccak256(abi.encodePacked(usersByAddress(_users[i]).userName)) == keccak256(abi.encodePacked(userName))){
                return true;
                break;
            }
        }
        return false;
    }
    function _follows(address from , address to) internal view returns (bool){
        for(uint i=0 ; i<_usersByAddress[from].followed.length; i++){
            if(_usersByAddress[from].followed[i]==to) return true;
        }
        return false;
    }
    function _changeFollowers(address from , address  to ) internal{
            _usersByAddress[from].followed.push(to);
            _usersByAddress[to].followers.push(to);

    }

    function getUserProfile(address user) public view returns(
        string memory ,
        string memory ,
        string memory ,
        address [] memory ,
        address [] memory ,
        Tweet [] memory
    ){
        User memory account = usersByAddress(user);
        return(
            account.profilePic,
            account.userName,
            account.bio,
            account.followers,
            account.followed,
            _tweetsOf(account.ad)
        );
    }

    function _tweetsOf(address user) internal view returns (Tweet[] memory){
        uint arrayLength;
        for(uint i=0 ; i<tweets().length ; i++){
            if(tweets()[i].from==user){
                arrayLength++;
            }
        }
        Tweet [] memory userTweets = new Tweet[](arrayLength);
        uint indexCount;
        for(uint i=0 ; i<tweets().length ; i++){
            if(tweets()[i].from==user){
                userTweets[indexCount]=tweets()[i];
                indexCount++;
            }
        }

        return userTweets;
    }

   
}