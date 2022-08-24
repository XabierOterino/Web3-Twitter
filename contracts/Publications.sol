pragma solidity ^0.8.0;

/**
* @notice This contract manages all the funcitonalities related to the publications
 */

contract Publications{
    // Publications data
    Tweet [] private _tweets;
    mapping(address => mapping(uint => bool)) private _liked;


    struct Tweet{
        address from; //creator of the tweet
        string text; // the inner text
        uint rt; //rt amount
        uint likes; //like amount
        uint timestamp; //the time when it was created
        uint id; //the index of the tweet
    }
    
    /**
    * @notice Used to fetch all the tweets of the platform
     */

    function tweets() public view returns(Tweet [] memory){
        return _tweets;
    }

    function _addTweetToList(Tweet memory pub) internal {
        _tweets.push(pub);
    }
    
    // check if someone liked a publiction
    function liked(address from , uint pubId) public view returns(bool){
        return _liked[from][pubId];
    }

    function _like(address from , uint pubId) internal{
        require(!liked(from , pubId));
        _tweets[pubId].likes+=1;
        _liked[from][pubId]=true;
    }

    function _retweet(Tweet memory pub , uint rtId) internal{
        _tweets.push(pub);
        _tweets[rtId].rt+=1;
    }

    
    
}