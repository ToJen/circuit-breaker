import json
import argparse
from soli_check import check

def main(bytecode: str):
    (report, result) = check(bytecode)
    response = {
        "report": report,
        "result": result
    }
    out = json.dumps(response, indent=4)
    print(out)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Process some bytecode.")
    parser.add_argument('bytecode', type=str, help='Bytecode string to be processed')
    
    args = parser.parse_args()
    
    main(args.bytecode)
