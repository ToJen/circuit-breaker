# Oracle

## Requirements
- Rust v1.75.0
- Cargo v1.75.0

> To update Rust run `rustup update`

## Setup
- `cargo build`

## Run
- `cargo run`

## Usage
### Oracle Request
```http
POST http://localhost:8000/api

{
    "jsonrpc": "2.0",
    "id": 0,
    "method": "inference",
    "params": "0xbytecode"
}
```

### Oracle Response
```json
{
    "result": {
        "report": true,
        "result": 100.0
    },
    "error": null,
    "id": 0
}
```

