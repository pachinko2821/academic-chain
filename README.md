# ACADEMIC-CHAIN

Academic-Chain is a Ethereum Decentralized Application, built for storage and retrival of academic results. The results generated in pdf format, and are signed with PGP. This Signature can be later verified to check for legitimacy.

## Setup on your local machine

The project requires:

- [Ganache](https://trufflesuite.com/ganache/index.html) to setup a Developer Eth Network
- [Metamask](https://metamask.io/) to setup a crypto wallet
- [node.js](https://nodejs.org) to run the entire thing

To run the project:

- Setup Ganache:

  - Add a new workspace, call it `Academic-Chain`
  - Set truffle project to the `academic-chain/truffle-config.js` file
  - In the `Accounts&Keys` section, take a note of the mnemonic generated
  - Leave everything else to default, except maybe logs/analytics in `Advanced` section

- Setup Metamask:

  - Get the extension for your browser
  - Add a new network, and setup to interact with Ganache
  - Network URL is `http://127.0.0.1:7545`
  - Network Id should be `1337`, Don't worry about any errors

- Setup Frontend:
  - Run `npm install`
  - Run `npm run dev`

NOTE: ~~There are some issues with metamask on Brave and Chrome. No idea if the issue is on my end or global. The project works fine on Firefox, not tested on edge.~~ I was using an older version of Truffle Contract. Everything works now. Not tested on MS Edge.
