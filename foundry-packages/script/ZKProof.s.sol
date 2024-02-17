// // SPDX-License-Identifier: UNLICENSED
// pragma solidity ^0.8.20;

// import {Script, console2} from "forge-std/Script.sol";
// import {ZKProof} from "../src/ZKProof.sol";

// contract ZKProofScript is Script {
//     ZKProof zkProof;

//     address bytecode = 0x14299C00861767244D552B206dd9217EafA0196b;

//     function setUp() public {
//         ZKProof zkProof = new ZKProof(bytecode);
//     }

//     function run() public {
//         uint256 deployerPk = vm.envUint("PRIVATE_KEY");
//         vm.startBroadcast(deployerPk);

//         // Deploy the contract
//         zkProof = new ZKProof(bytecode);
//     }
// }
