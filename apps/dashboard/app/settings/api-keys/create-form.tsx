"use client";

import { useActionState } from "react";
import { createProjectAndKey, type CreateKeyState } from "./actions";

const initial: CreateKeyState = {};

export function CreateKeyForm() {
  const [state, action, pending] = useActionState(createProjectAndKey, initial);

  return (
    <div>
      {state.error && <p style={{ color: "red" }}>{state.error}</p>}
      {state.rawKey && (
        <div
          style={{
            background: "#fffbcc",
            border: "1px solid #e6c800",
            padding: "1rem",
            marginBottom: "1rem",
          }}
        >
          <strong>New API key (shown once — copy it now):</strong>
          <pre style={{ wordBreak: "break-all" }}>{state.rawKey}</pre>
        </div>
      )}
      <form action={action}>
        <div style={{ marginBottom: "0.5rem" }}>
          <label>
            Project name: <input name="name" required style={{ marginLeft: "0.5rem" }} />
          </label>
        </div>
        <div style={{ marginBottom: "0.5rem" }}>
          <label>
            Key label: <input name="label" style={{ marginLeft: "0.5rem" }} />
          </label>
        </div>
        <button type="submit" disabled={pending}>
          {pending ? "Creating…" : "Create"}
        </button>
      </form>
    </div>
  );
}
