// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {BaseUltraVerifier} from "../circuits/contracts/circuits/plonk_vk.sol";

contract VeriBot {
    BaseUltraVerifier public plonkVerifier;
    mapping(uint256 => bool) public proofs; // map a proof id to a boolean

    function verifyProof(bytes calldata _proof, bytes32[] memory _publicInputs) public view returns (bool) {
        uint256 counter = 0;
        proofs[counter]++;
        return plonkVerifier.verifyProof(_proof, _inputs);
    }

    function getProof(uint256 _id) public view returns (bool) {
        return proofs[_id];
    }
}
