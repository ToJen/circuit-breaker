use actix_cors::Cors;
use actix_web::http;
use jsonrpc_v2;
use jsonrpc_v2::{Data, Params, Server};
use serde::{Deserialize, Serialize};
use serde_json::from_str;
use std::error::Error;
use std::process::{Command, Output};

#[derive(Serialize, Deserialize)]
struct Value {
    inner: String,
}

#[derive(Serialize, Deserialize)]
struct SingleForeignCallParam {
    single: Value, // Rust convention is to use snake_case for field names
}

#[derive(Serialize, Deserialize)]
struct ArrayForeignCallParam {
    #[serde(rename(serialize = "Array"))]
    array: Vec<Value>,
}

#[derive(Serialize, Deserialize)]
enum ForeignCallParam {
    Single(SingleForeignCallParam),
    Array(ArrayForeignCallParam),
}

#[derive(Serialize, Deserialize)]
struct ForeignCallResult {
    values: Vec<ForeignCallParam>,
}

#[derive(Debug, Deserialize)]
struct InferenceResponse {
    report: bool,
    result: f64,
}

async fn inference(
    Params(params): Params<serde_json::Value>,
) -> Result<ForeignCallResult, jsonrpc_v2::Error> {
    println!("{params}");
    
    match serde_json::from_value::<SingleForeignCallParam>(params.clone()) {
        Err(e) => {
            eprintln!("Failed to parse inference params: {}", e);
            return Err(jsonrpc_v2::Error::INVALID_PARAMS);
        }
        Ok(p) => {
            let bytecode = p.single.inner;
            match exec_python_model(bytecode) {
                Ok(output) => {
                    println!("Python Output: {:?}", output);

                    let report_value = Value {
                        inner: output.report.to_string(),
                    };
                    let result_value = Value {
                        inner: output.result.to_string(),
                    };
                    let array_resp = ArrayForeignCallParam {
                        array: vec![report_value, result_value],
                    };

                    Ok(ForeignCallResult {
                        values: vec![ForeignCallParam::Array(array_resp)],
                    })
                }
                Err(e) => {
                    eprintln!("Error calling Python code: {}", e.to_string());
                    Err(jsonrpc_v2::Error::INTERNAL_ERROR)
                }
            }
        }
    }
}

fn exec_python_model(bytecode: String) -> Result<InferenceResponse, Box<dyn Error>> {
    // println!("bytecode:\n{bytecode}");

    // Ensure the Python environment is set up
    install_deps()?;

    let output: Output = Command::new("python")
        .arg("../ml/main.py")
        .arg(bytecode)
        .output()?;

    if !output.status.success() {
        let error_message = String::from_utf8(output.stderr)?;
        eprintln!("Command failed with error: {}", error_message);
        return Err(error_message.into());
    }

    let output_str = String::from_utf8(output.stdout)?;
    println!("Raw Python Output: {}", output_str);

    let parsed: InferenceResponse = from_str(&output_str)?;
    Ok(parsed)
}

fn install_deps() -> Result<(), Box<dyn Error>> {
    let pip_install = Command::new("sh")
        .arg("-c")
        .arg("pip install -r ../ml/requirements.txt")
        .output()?;

    if !pip_install.status.success() {
        let error_message = String::from_utf8_lossy(&pip_install.stderr);
        eprintln!("Failed to install Python dependencies: {}", error_message);
        return Err("Failed to install Python dependencies".into());
    }

    Ok(())
}

#[actix_rt::main]
async fn main() -> std::io::Result<()> {
    let rpc = Server::new()
        .with_data(Data::new(String::from("Hello!")))
        .with_method("inference", inference)
        .finish();

    actix_web::HttpServer::new(move || {
        let rpc = rpc.clone();

        let cors = Cors::default()
            .allow_any_origin()
            .allowed_methods(vec!["GET", "POST"])
            .allowed_header(http::header::CONTENT_TYPE)
            .max_age(3600);

        // let cors = Cors::permissive();

        actix_web::App::new().wrap(cors).service(
            actix_web::web::service("/api")
                .guard(actix_web::guard::Post())
                .finish(rpc.into_web_service()),
        )
    })
    .bind("0.0.0.0:8000")?
    .run()
    .await
}
