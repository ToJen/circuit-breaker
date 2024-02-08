> *WARNING: Experimental!*

# Circuits

## Requirements
- Noirc >=v0.23.0
- Nargo >=v0.23.0
- Run `noirup -v 0.23.0`

## Test
`nargo test --oracle-resolver http://localhost:8000/api`

## Execute
`nargo execute`

## Generate Proof
- Replace the `bytecode` value in [Prover.toml](./Prover.toml) with another.
- `nargo prove --oracle-resolver http://localhost:8000/api`

## Verify Proof
`nargo verify`

## Generate Solidity Verifier
`nargo codegen-verifier`


