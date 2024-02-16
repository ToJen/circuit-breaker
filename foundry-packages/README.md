# Contracts 


## Scroll verification 

### ZKPROOF.SOL 

```
forge verify-contract \
    --num-of-optimizations 1000000 \
    --watch \
    --constructor-args  $(cast abi-encode "constructor(address)" 0x14299C00861767244D552B206dd9217EafA0196b) \
    --verifier etherscan \
    --verifier-url https://api-sepolia.scrollscan.dev/api \
    --etherscan-api-key EBZA9XDYA7MYMI5ZYV11M9DUB4XDB1E484 \
    --compiler-version v0.8.20 \
    0x83bf8975F4B1B99969B5134f86E5bd683DCf5aFc \
    ZKProof 
``` 

