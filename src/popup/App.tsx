import { useState } from "react";
import type { DetectedField } from "../shared/types";

export default function App() {
  const [fields, setFields] = useState<DetectedField[]>([]);

  const [loading, setLoading] = useState(false);

  async function detectFields() {
    setLoading(true);

    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (!tab.id) {
        throw new Error("No active tab.");
      }

      const response = await chrome.tabs.sendMessage(tab.id, {
        type: "DETECT_FIELDS",
      });

      if (response?.success) {
        setFields(response.fields);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="popup">
      <header>
        <h1>Fleeting Jobs</h1>
        <p>Application assistant</p>
      </header>

      <button onClick={detectFields} disabled={loading}>
        {loading ? "Scanning..." : "Detect Form Fields"}
      </button>

      <section>
        <h2>Fields detected: {fields.length}</h2>

        {fields.map((field) => (
          <article key={field.id}>
            <strong>{field.label ?? "No label"}</strong>

            <small>
              {field.type}
              {field.name ? ` · ${field.name}` : ""}
            </small>
          </article>
        ))}
      </section>
    </main>
  );
}
