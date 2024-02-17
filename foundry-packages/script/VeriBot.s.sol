// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.12;

import {Script, console2} from "forge-std/Script.sol";
import {VeriBot} from "../src/VeriBot.sol";

contract VeriBotScript is Script {
    VeriBot public veriBot;

    function run() public {
        uint256 deployerPk = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPk);

        // Deploy the contract
        veriBot = new VeriBot();

        // //call the function
        // veriBot.verifyProof(abi.encodePacked("proof"), ["publicInputs"]);
    }
}
