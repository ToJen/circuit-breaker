# Contracts 


## Scroll verification 

### ZKPROOF.SOL 

```
forge verify-contract \
    --num-of-optimizations 1000000 \
    --watch \
    --constructor-args  $(cast abi-encode "constructor(address)" "0x14299C00861767244D552B206dd9217EafA0196b") \
    --verifier etherscan \
    --verifier-url https://api-sepolia.scrollscan.dev/api \
    --etherscan-api-key V4P48P91YBYEK963CWQKM9G3YTTJRKJA8Y \
    --compiler-version v0.8.20+commit.a1b79de6 \
    0x703936A24DFaDcD34008Db338FDB087c43C8c56a \
    ZKProof 
``` 

