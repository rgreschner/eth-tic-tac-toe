# Tic Tac Toe on Ethereum

This is an example of writing a game on blockchain using Solidity on Ethereum & a frontend written in Angular.

Done as part of an assignment for School of AI's Decentralized Apps Course by [@llSourcell]( https://github.com/llSourcell) / Siraj Raval.

## Getting Started

Instructions for getting started are detailed here.

### Prerequisites

To build and run these project the following prerequisites must be met:

* Node.js in at least v8.10.0
* Globally installed Typescript compiler in at least v3.1.6.
* Basic familiarity with Node.js & NPM, Angular and Truffle is helpful.
* Angular CLI, project version of Angular is 7.1.4
* Truffle suite for test deployments of Ethereum contract, used version is Truffle v5.0.2.
* OpenZeppelin smart contract library, used version is 2.1.2.
* Browser supporting MetaMask, primarily tested with Chrome, see [MetaMask Homepage](https://metamask.io).

### Build Instructions

#### Frontend

Make sure Angular CLI is installed.
You can do so by typing `ng v` on commandline.
The version should be equal or above  **7.1.4**.

If this is not the case or Angular CLI is not installed at all, you can install it by typing `npm i -g @angular/cli`.

Afterwards you need to install the dependencies of the frontend project.
To do so, navigate into the folder `packages/frontend` and install the NPM dependencies by invoking `npm i`.

After all dependencies are met, you may compile & serve the frontend project using `ng s -o`.
This will start an Angular development server by default on port 4200 and open a new browser tab.

#### Ethereum Contract

**Note for Windows users: it might be necessary to invoke Truffle suite by using `truffle.cmd` in CLI instead!**

Make sure Truffle suite is installed in version 4.
You can do so by typing `truffle version` on commandline.
The version of Truffle should be equal to **Truffle v5.0.2 (core: 5.0.2)**.

If this is not the case or Truffle suite is not installed at all, you can install it by typing `npm i -g truffle`.

Additionally you need to install additional libraries like the OpenZeppelin smart contract library.
To do so, invoke `npm i` in directory `packages/contracts`.

In order to compile the Tic Tac Toe contract, navigate into the folder `packages/contracts` and invoke `truffle compile`.
This compiles the smart contracts and outputs them into the sub-directory `build/contracts`.

Afterwards you need to copy the compiled contract to frontend asset directory in order to make it useable in frontend.
To do so, invoke `npm run copy-assets` in CLI.

### Usage Information

#### Starting a Test Network

In order to test the Dapp and contracts locally it is required to start a Truffle Develop beforehand.

To do so, navigate into the folder `packages/contracts` where `truffle-config.js` is located and invoke `truffle develop` in CLI.

#### Running Contract Unit Tests

The unit tests for the smart contract are written in Typescript and compiled before test run using a NPM script.

In order to run the unit tests of Tic Tac Toe contract, navigate into the folder `packages/contracts` and invoke `npm run test`.

This will compile the smart contracts and unit tests written in Typescript and invoke Truffle's built-in Mocha test runner.

## License

This project is licensed under the terms of the **MIT** license, see `LICENSE` to check out the full license.