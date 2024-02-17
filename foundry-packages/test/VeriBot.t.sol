// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/test.sol";
import {VeriBot} from "../src/VeriBot.sol";

contract VeriBotTest is Test {

    VeriBot veriBot;

    function setUp() public {
         veriBot = new VeriBot();
    }

    function testVerifyProof() public {
        bytes memory proof = "0x1234";
        bytes32[] memory publicInputs = new bytes32[](1);
        assertTrue(veriBot.verifyProof(proof, publicInputs));
    }
}
