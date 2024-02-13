use actix_cors::Cors;
use actix_web::{web, App, HttpServer, HttpResponse, Error as ActixError};
use serde::{Deserialize, Serialize};
use serde_json::json;
use std::error::Error;
use std::process::{Command, Output};
use std::sync::Arc;

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
            // Simulate calling the inference method
            // This part should be replaced with your actual logic to call the inference function
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
    let output: Output = Command::new("python")
        .arg("../ml/main.py")
        .arg(bytecode)
        .output()?;

    if !output.status.success() {
        let error_message = String::from_utf8(output.stderr)?;
        return Err(error_message.into());
    }

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
