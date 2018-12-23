# Tic Tac Toe on Ethereum

This is an example of writing a game on blockchain using Solidity on Ethereum & a frontend written in Angular.

Done as part of an assignment for School of AI's Decentralized Apps Course by [@llSourcell]( https://github.com/llSourcell) / Siraj Raval.

## Getting Started

Instructions for getting started are detailed here.

### Prerequisites

To build and run these project the following prerequisites must be met:

* Node.js in at least v8.10.0
* Basic familiarity with Node.js & NPM, Angular and Truffle is helpful.
* Angular CLI, project version of Angular is 7.1.4
* Truffle suite for test deployments of Ethereum contract, requires version >= 4.1.15 < 5.
* OpenZeppelin smart contract library, used version is 2.0.0.
* Browser supporting MetaMask, primarily tested with Chrome, see [MetaMask Homepage](https://metamask.io).

### Build Instructions

#### Frontend

Make sure Angular CLI is installed.
You can do so by typing `ng v` on commandline.
The version should be equal or above  **7.1.4**.

If this is not the case or Angular CLI is not installed at all, you can install it by typing `npm i -g @angular/cli`.

Afterwards you need to install the dependencies of the frontend project.
To do so, navigate into the folder `frontend` and install the NPM dependencies by invoking `npm i`.

After all dependencies are met, you may compile & serve the frontend project using `ng s -o`.
This will start an Angular development server by default on port 4200 and open a new browser tab.

#### Ethereum Contract

**Note for Windows users: Truffle suite must be invoked by using `truffle.cmd` on commandline instead!**

Make sure Truffle suite is installed in version 4.
You can do so by typing `truffle version` on commandline.
The version of Truffle should be equal to **Truffle v4.1.15 (core: 4.1.15)**.

If this is not the case or Truffle suite is not installed at all, you can install it by typing `npm i -g truffle@4`.

Additionally you need to install the OpenZeppelin smart contract library.
To do so, invoke `npm i openzeppelin-solidity` in directory `truffle`.

In order to compile the Tic Tac Toe contract, navigate into the folder `truffle` and invoke `truffle compile`.
This compiles the smart contracts and outputs them into the directory `build/contracts`.
truffle develop.

Afterwards you need to copy the compiled contract to frontend asset directory in order to make it useable in frontend.
To do so, use `cp ./build/contracts/TicTacToe.json ../frontend/src/assets/data`.

## License

This project is licensed under the terms of the **MIT** license, see `LICENSE` to check out the full license.