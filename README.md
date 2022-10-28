# WEB3-TWITTER

A more decentralised version of Twitter , relied only in smart contracts and IPFS

## General Overview

The internet is fastly transitining to new technologies , that's why I decided to build the ultimate Twitter
version , with the  ultimate Web3 stack : 

1. Solidity
2. IPFS
3. Tailwind.css
4. Next.js (Typescipt version)

### Profile Creation

The dapp allows us to store our whole profile in a decentralised way :
    - Strings data is stored in the contact
    - Images are stored in IPFS

###  Tweets ,likes and retweets

This functionalities are also available in this Web3-Twitter , but they are 100% censorship-free
because all this happen on chain in a decentralised and trustless way.

### Private messages

The private messages functionality has been removed as blockchain isn't made to store sensible data.

### Authentication

The user can authenticate by only connecting his metamsk without the need of providing personal information
to third parties.


### Extra functionalities

The Dapp also includes the posibility of donating ETH orr ERC20 tokens between the users

## Getting started

1. Install dependencies

```bash
npm i 
```

2. Deploy the contracts in your favourite network

```bash
truffle migrate 
```

3.Run the dapp in your local host

```bash
npm run dev
```

4.Enjoy!
