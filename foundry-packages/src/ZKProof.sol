// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

contract ZKProof {
    address bytecode;
    mapping(address => bool) public isProven;

    constructor(address _bytecode) {
        bytecode = _bytecode;
    }

    function prove() external view returns (bool) {
        return isProven[bytecode];
    }
}
