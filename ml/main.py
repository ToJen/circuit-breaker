import json
import typer
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
    typer.run(main)
