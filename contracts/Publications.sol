pragma solidity ^0.8.0;

contract Publications{
    Tweet [] private _tweets;
    mapping(address => mapping(uint => bool)) private _liked;

    struct Tweet{
        address from;
        string text;
        uint rt;
        uint likes;
        uint timestamp;
        uint id;
    }
    
    function tweets() public view returns(Tweet [] memory){
        return _tweets;
    }

    function _addTweetToList(Tweet memory pub) internal {
        _tweets.push(pub);
    }

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