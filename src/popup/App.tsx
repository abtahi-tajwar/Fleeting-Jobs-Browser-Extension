import { useState } from "react";
import type { DetectedField } from "../shared/types";

export default function App() {
  const [fields, setFields] = useState<DetectedField[]>([]);
  const [hasScanned, setHasScanned] = useState(false);
  const [loading, setLoading] = useState(false);

  const [status, setStatus] = useState<
    "idle" | "scanning" | "filling" | "success" | "error"
  >("idle");

  async function detectFields() {
    setLoading(true);
    setStatus("scanning");

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

      if (!response?.success) {
        throw new Error(
          response?.error ?? "Unable to detect fields.",
        );
      }

      setFields(response.fields);
      setHasScanned(true);
      setStatus("idle");
    } catch (error) {
      console.error(error);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  }

  async function fillForm() {
    setLoading(true);
    setStatus("filling");

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

      if (!response?.success) {
        throw new Error(
          response?.error ?? "Unable to autofill form.",
        );
      }

      console.log(`Filled ${response.filled} fields`);

      setStatus("success");
    } catch (error) {
      console.error(error);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  }

  const statusText = {
    idle: "Ready to help",
    scanning: "Scanning application...",
    filling: "Filling application...",
    success: "Application fields updated",
    error: "Something went wrong",
  }[status];

  return (
    <main className="flex min-h-[520px] w-[380px] flex-col bg-zinc-50 text-zinc-900">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-zinc-950 text-sm font-bold text-white shadow-sm">
            F
          </div>

          <div className="min-w-0">
            <h1 className="text-sm font-semibold tracking-tight text-zinc-950">
              Fleeting Jobs
            </h1>

            <p className="mt-0.5 text-[11px] text-zinc-500">
              Application assistant
            </p>
          </div>
        </div>

        {/* Status */}
        <div className="mt-3 flex items-center gap-2 text-[10px] text-zinc-500">
          <span
            className={`size-1.5 rounded-full ${
              status === "success"
                ? "bg-emerald-500"
                : status === "error"
                  ? "bg-red-500"
                  : status === "filling" ||
                      status === "scanning"
                    ? "animate-pulse bg-amber-500"
                    : "bg-zinc-400"
            }`}
          />

          <span>{statusText}</span>
        </div>
      </header>

      {/* Hero */}
      <section className="px-5 pb-5 pt-5">
        <span className="text-[9px] font-bold tracking-[0.14em] text-zinc-400">
          APPLICATION ASSISTANT
        </span>

        <h2 className="mt-1.5 text-[21px] font-semibold leading-tight tracking-[-0.03em] text-zinc-950">
          Fill this application faster.
        </h2>

        <p className="mt-2 text-xs leading-relaxed text-zinc-500">
          Detect application fields and populate them from
          your Fleeting Jobs profile.
        </p>

        {/* Primary action */}
        <button
          type="button"
          onClick={fillForm}
          disabled={loading}
          className="mt-4 flex h-11 w-full items-center justify-center rounded-xl bg-zinc-950 text-xs font-semibold text-white shadow-sm transition hover:bg-zinc-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "filling" ? (
            <>
              <span className="mr-2 size-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Filling...
            </>
          ) : (
            <>
              Autofill Application
              <span className="ml-2 text-sm">→</span>
            </>
          )}
        </button>

        {/* Secondary action */}
        <button
          type="button"
          onClick={detectFields}
          disabled={loading}
          className="mt-2.5 flex h-10 w-full items-center justify-center rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-100 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "scanning"
            ? "Scanning..."
            : "Scan Form Fields"}
        </button>
      </section>

      {/* Detected fields */}
      <section className="flex-1 px-5 pb-4">
        <div className="mb-2.5 flex items-center justify-between">
          <div>
            <h3 className="text-xs font-semibold text-zinc-800">
              Detected fields
            </h3>

            <p className="mt-0.5 text-[10px] text-zinc-400">
              {!hasScanned
                ? "Ready to scan"
                : fields.length === 0
                  ? "No fields found"
                  : `${fields.length} fields found`}
            </p>
          </div>

          {fields.length > 0 && (
            <span className="grid min-w-6 place-items-center rounded-lg bg-zinc-200 px-2 py-1 text-[10px] font-bold text-zinc-600">
              {fields.length}
            </span>
          )}
        </div>

        {/* Never scanned */}
        {!hasScanned ? (
          <div className="flex flex-col items-center rounded-xl border border-dashed border-zinc-300 bg-white px-5 py-7 text-center">
            <div className="mb-2.5 grid size-9 place-items-center rounded-xl bg-zinc-100 text-lg text-zinc-500">
              ⌕
            </div>

            <strong className="text-xs font-semibold text-zinc-700">
              Ready to scan
            </strong>

            <span className="mt-1 max-w-[220px] text-[10px] leading-relaxed text-zinc-400">
              Scan the current page to find application
              fields.
            </span>
          </div>
        ) : fields.length === 0 ? (
          /* Scanned but nothing found */
          <div className="flex flex-col items-center rounded-xl border border-dashed border-zinc-300 bg-white px-5 py-7 text-center">
            <div className="mb-2.5 grid size-9 place-items-center rounded-xl bg-zinc-100 text-lg text-zinc-500">
              ⌕
            </div>

            <strong className="text-xs font-semibold text-zinc-700">
              No fields detected
            </strong>

            <span className="mt-1 max-w-[220px] text-[10px] leading-relaxed text-zinc-400">
              We couldn't find any application fields on
              this page.
            </span>
          </div>
        ) : (
          /* Fields found */
          <div className="max-h-[210px] space-y-1.5 overflow-y-auto pr-0.5">
            {fields.map((field) => (
              <article
                key={field.id}
                className="flex items-center gap-2.5 rounded-xl border border-zinc-200 bg-white p-2.5 shadow-sm"
              >
                {/* Field icon */}
                <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-zinc-100 text-[11px] font-bold text-zinc-500">
                  {getFieldIcon(field.type)}
                </div>

                {/* Field information */}
                <div className="min-w-0 flex-1">
                  <strong className="block truncate text-[11px] font-semibold text-zinc-800">
                    {field.label ?? "Unnamed field"}
                  </strong>

                  <span className="mt-0.5 block truncate text-[9px] text-zinc-400">
                    {field.type}
                    {field.name ? ` · ${field.name}` : ""}
                  </span>
                </div>

                {/* Detected indicator */}
                <span className="text-xs text-zinc-300">
                  ✓
                </span>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="flex items-center justify-between border-t border-zinc-200 bg-white px-5 py-2.5 text-[9px] text-zinc-400">
        <span>Fleeting Jobs</span>
        <span>v0.1.0</span>
      </footer>
    </main>
  );
}

function getFieldIcon(type: DetectedField["type"]) {
  switch (type) {
    case "email":
      return "@";

    case "tel":
      return "☎";

    case "textarea":
      return "≡";

    case "select":
      return "⌄";

    case "checkbox":
      return "✓";

    case "radio":
      return "●";

    case "date":
      return "◷";

    case "url":
      return "↗";

    case "number":
      return "#";

    case "password":
      return "•";

    default:
      return "T";
  }
}