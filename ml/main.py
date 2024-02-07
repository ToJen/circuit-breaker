import typer
from soli_check import check


def main(bytecode: str):
    (report, result) = check(bytecode)
    response = {
        "report": report,
        "result": result
    }
    print(response)


if __name__ == "__main__":
    typer.run(main)
