"use client";

import { FormEvent, useState } from "react";

type Status = {
  type: "idle" | "success" | "error";
  message: string;
};

export default function HomePage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<Status>({ type: "idle", message: "" });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ type: "idle", message: "" });

    if (!url.trim()) {
      setStatus({ type: "error", message: "Please enter a URL." });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/submit-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ url })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Something went wrong.");
      }

      setStatus({ type: "success", message: data.message });
      setUrl("");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to submit URL.";
      setStatus({ type: "error", message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-center text-2xl font-semibold text-slate-900">
          Phishing URL Reporter
        </h1>
        <p className="mb-6 text-center text-sm text-slate-600">
          Submit suspicious links so they can be reviewed and handled safely.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="url"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Suspicious URL
            </label>
            <input
              id="url"
              type="url"
              placeholder="https://example.com/suspicious-link"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
          >
            {loading ? "Submitting..." : "Submit URL"}
          </button>
        </form>

        {status.type !== "idle" && (
          <p
            className={`mt-4 text-center text-sm ${
              status.type === "success" ? "text-emerald-600" : "text-red-600"
            }`}
          >
            {status.message}
          </p>
        )}

        <p className="mt-6 text-center text-xs text-slate-400">
          This demo only stores URLs for educational purposes and does not
          perform any automatic analysis.
        </p>
      </div>
    </main>
  );
}


