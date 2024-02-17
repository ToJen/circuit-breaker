# Oracle

## Requirements
- Rust v1.75.0
- Cargo v1.75.0

> To update Rust run `rustup update`

## Setup
- `cargo build`

## Run
- `cargo run`

## Oracle Request
```http
POST http://localhost:8000/api

{
    "jsonrpc": "2.0",
    "id": 0,
    "method": "inference",
    "params": "0xbytecode"
}
```

