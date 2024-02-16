// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console2} from "forge-std/Script.sol";
import {ZKProof} from "../src/ZKProof.sol";

contract ZKProofScript is Script {
    ZKProof zkProof;

    address bytecode = makeAddr("0x2");

    function setUp() public {
        ZKProof zkProof = new ZKProof(bytecode);
    }

    function run() public {
        uint256 deployerPk = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPk);

        // Deploy the contract
        zkProof = new ZKProof(bytecode);
    }
}
