import { useEffect, useState } from "react";
import type { DetectedField } from "../shared/types";
import { loadProfile } from "../shared/profile";

export default function App() {
  const [fields, setFields] = useState<DetectedField[]>([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

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

async function fillForm() {
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
        type: "FILL_FORM",
      });

      if (response?.success) {
        console.log(`Filled ${response.filled} fields`);

        await detectFields();
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

      <button onClick={fillForm} disabled={loading}>
        {loading ? "Filling..." : "Autofill Form"}
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
