# Soli-Check

## Requirements
- Python v3.11
- (optional) Docker v24.0

## Setup

### Python
- Create  virtual env
  - `pyenv exec python -m venv ./venv`
- Activate venv
  - `source ./venv/bin/activate`
- Install dependencies
  - `pip install -r requirements.txt`
- Run it
  - `python main.my <contract_bytecode>`

### Docker
- Build image
  - `docker build solicheck .`
- Run container
  - `docker run solicheck python main.my <contract_bytecode>`

## Credit
This package is derived from https://github.com/mukherjeearnab/soli-check
