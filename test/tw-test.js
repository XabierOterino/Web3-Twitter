const { it } = require("node:test")
const truffleAssert = require("truffle-assertions")
const Twitter =  artifacts.require("Twitter")

contract("Twitter" , accounts =>{
    
    it("Should signUp correctly" , async()=>{
        let tw = await Twitter.deployed();
        await tw.signUp("jkdgflajg","jkhjk","jhkhkj", {from: accounts[0]})
        await truffleAssert.passes(
            tw.newTweet("fjkhajkf")
        )
    })















})