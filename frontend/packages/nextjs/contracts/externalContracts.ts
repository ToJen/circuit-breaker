import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

/**
 * @example
 * const externalContracts = {
 *   534351: {
 *     DAI: {
 *       address: "0x...",
 *       abi: [...],
 *     },
 *   },
 * } as const;
 */
const externalContracts = {
    534351: {
        VeriBot: {
            address: "0xc7c63d31808D12b1b4BEfd37CFccd461e9CA6F30",
            abi: [
                {
                  "inputs": [],
                  "name": "plonkVerifier",
                  "outputs": [
                    {
                      "internalType": "contract BaseUltraVerifier",
                      "name": "",
                      "type": "address"
                    }
                  ],
                  "stateMutability": "view",
                  "type": "function"
                },
                {
                  "inputs": [
                    {
                      "internalType": "bytes32",
                      "name": "",
                      "type": "bytes32"
                    }
                  ],
                  "name": "proofs",
                  "outputs": [
                    {
                      "internalType": "bool",
                      "name": "",
                      "type": "bool"
                    }
                  ],
                  "stateMutability": "view",
                  "type": "function"
                },
                {
                  "inputs": [
                    {
                      "internalType": "bytes",
                      "name": "_proof",
                      "type": "bytes"
                    },
                    {
                      "internalType": "bytes32[]",
                      "name": "_publicInputs",
                      "type": "bytes32[]"
                    }
                  ],
                  "name": "verifyProof",
                  "outputs": [
                    {
                      "internalType": "bool",
                      "name": "",
                      "type": "bool"
                    }
                  ],
                  "stateMutability": "nonpayable",
                  "type": "function"
                },
                {
                  "inputs": [],
                  "name": "version",
                  "outputs": [
                    {
                      "internalType": "uint256",
                      "name": "",
                      "type": "uint256"
                    }
                  ],
                  "stateMutability": "view",
                  "type": "function"
                }],
        }
    }
} as const;

export default externalContracts satisfies GenericContractsDeclaration;
