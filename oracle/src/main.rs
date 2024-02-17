use actix_cors::Cors;
use actix_web::{web, App, HttpServer, HttpResponse, Error as ActixError};
use serde::{Deserialize, Serialize};
use serde_json::json;
use std::error::Error;
use std::process::{Command, Output};

#[derive(Serialize, Deserialize, Debug)]
struct RpcRequest {
    method: String,
    params: serde_json::Value,
    id: Option<serde_json::Value>,
}

#[derive(Serialize, Deserialize, Debug)]
struct RpcResponse {
    result: Option<serde_json::Value>,
    error: Option<RpcError>,
    id: serde_json::Value,
}

#[derive(Serialize, Deserialize, Debug)]
struct RpcError {
    code: i32,
    message: String,
}

async fn rpc_handler(body: web::Json<RpcRequest>) -> Result<HttpResponse, ActixError> {
    match body.method.as_str() {
        "inference" => {
            let result = exec_python_model(body.params.get("bytecode").and_then(|v| v.as_str()).unwrap_or_default());

            match result {
                Ok(inference_result) => {
                    let response = RpcResponse {
                        result: Some(json!(inference_result)),
                        error: None,
                        id: body.id.clone().unwrap_or(json!(null)),
                    };
                    Ok(HttpResponse::Ok().json(response))
                },
                Err(e) => {
                    let error = RpcError {
                        code: -32603,
                        message: e.to_string(),
                    };
                    let response = RpcResponse {
                        result: None,
                        error: Some(error),
                        id: body.id.clone().unwrap_or(json!(null)),
                    };
                    Ok(HttpResponse::Ok().json(response))
                }
            }
        },
        _ => {
            let error = RpcError {
                code: -32601,
                message: "Method not found".to_string(),
            };
            let response = RpcResponse {
                result: None,
                error: Some(error),
                id: body.id.clone().unwrap_or(json!(null)),
            };
            Ok(HttpResponse::Ok().json(response))
        }
    }
}

fn exec_python_model(bytecode: &str) -> Result<InferenceResponse, Box<dyn Error>> {
    // Attempt to execute the command with "python"
    let output = Command::new("python")
        .arg("../ml/main.py")
        .arg(bytecode)
        .output();

    let output = match output {
        Ok(output) if output.status.success() => output,
        _ => {
            // If the first attempt fails, try with "python3"
            println!("Attempting with python3...");
            let output_python3 = Command::new("python3")
                .arg("../ml/main.py")
                .arg(bytecode)
                .output();
                
            match output_python3 {
                Ok(output) if output.status.success() => output,
                Ok(output) => {
                    // If the command with "python3" also fails, return an error
                    let error_message = String::from_utf8_lossy(&output.stderr).into_owned();
                    eprintln!("Command failed with error: {}", error_message);
                    return Err(error_message.into());
                },
                Err(e) => return Err(e.into()), // Handle unexpected errors during command execution
            }
        }
    };

    // If execution is successful (with either "python" or "python3"), parse the output
    let output_str = String::from_utf8(output.stdout)?;
    let parsed: InferenceResponse = serde_json::from_str(&output_str)?;
    Ok(parsed)
}

#[derive(Serialize, Deserialize, Debug)]
struct InferenceResponse {
    report: bool,
    result: f64,
}

#[actix_rt::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .wrap(Cors::default().allow_any_origin())
            .service(web::resource("/api").route(web::post().to(rpc_handler)))
    })
    .bind("0.0.0.0:8000")?
    .run()
    .await
}
