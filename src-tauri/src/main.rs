#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use reqwest::header::{HeaderMap, HeaderValue, AUTHORIZATION, CONTENT_TYPE};
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct TutorPayload {
    mode: String,
    active_lesson: String,
    lesson_objectives: Vec<String>,
    current_step: String,
    component_inventory: Vec<Value>,
    selected_entity: Value,
    wire_summary: String,
    simulation_state: String,
    node_voltages: Value,
    component_state_summaries: Vec<String>,
    diagnostics: Vec<String>,
    recent_user_changes: Vec<String>,
    recent_probe_actions: Vec<String>,
    user_message: String,
    conversation: Vec<Value>,
}

#[derive(Debug, Serialize)]
struct TutorResponse {
    reply: String,
    request_id: Option<String>,
}

#[tauri::command]
async fn ask_tutor(payload: TutorPayload) -> Result<TutorResponse, String> {
    let api_key = std::env::var("OPENAI_API_KEY")
        .map_err(|_| "Missing OPENAI_API_KEY in local environment".to_string())?;

    let mut headers = HeaderMap::new();
    headers.insert(
        AUTHORIZATION,
        HeaderValue::from_str(&format!("Bearer {}", api_key))
            .map_err(|err| format!("Unable to create auth header: {err}"))?,
    );
    headers.insert(CONTENT_TYPE, HeaderValue::from_static("application/json"));

    let context_json = json!({
      "mode": payload.mode,
      "active_lesson": payload.active_lesson,
      "lesson_objectives": payload.lesson_objectives,
      "current_step": payload.current_step,
      "component_inventory": payload.component_inventory,
      "selected_entity": payload.selected_entity,
      "wire_summary": payload.wire_summary,
      "simulation_state": payload.simulation_state,
      "node_voltages": payload.node_voltages,
      "component_state_summaries": payload.component_state_summaries,
      "diagnostics": payload.diagnostics,
      "recent_user_changes": payload.recent_user_changes,
      "recent_probe_actions": payload.recent_probe_actions,
      "conversation": payload.conversation,
    });

    let request_body = json!({
      "model": "gpt-4.1-mini",
      "input": [
        {
          "role": "system",
          "content": [{"type": "input_text", "text": "You are the Virtual Electronics Lab tutor. Ground all advice in the structured circuit context. Keep responses practical and concise."}]
        },
        {
          "role": "user",
          "content": [
            {"type": "input_text", "text": format!("Structured circuit context: {}", context_json)},
            {"type": "input_text", "text": format!("Learner question: {}", payload.user_message)}
          ]
        }
      ]
    });

    let client = reqwest::Client::new();
    let response = client
        .post("https://api.openai.com/v1/responses")
        .headers(headers)
        .json(&request_body)
        .send()
        .await
        .map_err(|err| format!("OpenAI request failed: {err}"))?;

    let request_id = response
        .headers()
        .get("x-request-id")
        .and_then(|v| v.to_str().ok())
        .map(|v| v.to_string());

    let status = response.status();
    let body: Value = response
        .json()
        .await
        .map_err(|err| format!("Failed to parse OpenAI response: {err}"))?;

    if !status.is_success() {
        return Err(format!("OpenAI error ({}): {}", status, body));
    }

    let reply = body
        .get("output_text")
        .and_then(|v| v.as_str())
        .map(|s| s.to_string())
        .or_else(|| {
            body.get("output")
                .and_then(|o| o.as_array())
                .and_then(|arr| arr.first())
                .and_then(|item| item.get("content"))
                .and_then(|content| content.as_array())
                .and_then(|arr| arr.first())
                .and_then(|content_item| content_item.get("text"))
                .and_then(|text| text.as_str())
                .map(|s| s.to_string())
        })
        .unwrap_or_else(|| "Tutor response was empty.".to_string());

    Ok(TutorResponse { reply, request_id })
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![ask_tutor])
        .run(tauri::generate_context!())
        .expect("error while running virtual electronics lab");
}
