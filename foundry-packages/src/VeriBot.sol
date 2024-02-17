// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.12;

import {BaseUltraVerifier} from "./plonk_vk.sol";

contract VeriBot {
    BaseUltraVerifier public plonkVerifier;
    uint256 public version;
    mapping(bytes32 => bool) public proofs;

    function verifyProof(bytes calldata _proof, bytes32[] memory _publicInputs) public returns (bool) {
        bytes32 proofId = keccak256(abi.encodePacked(_proof, _publicInputs));

        // to save gas : if the proof is already verified, return true
        if (proofs[proofId]) {
            return proofs[proofId];
        }

        // // Verify the proof
        bool verified = plonkVerifier.verify(_proof, _publicInputs);

        // If verified, mark this proof as verified to prevent future submissions
        if (verified) {
            proofs[proofId] = true;
        }

        return verified;
    }
}
