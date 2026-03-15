"use client";

import { FormEvent, useState } from "react";

type Status = {
  type: "idle" | "success" | "error";
  message: string;
};

type View = "check-link" | "check-email" | "check-blocklist" | "view-analysis";

export default function HomePage() {
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<Status>({ type: "idle", message: "" });
  const [currentView, setCurrentView] = useState<View>("check-link");

  const handleSubmitUrl = async (e: FormEvent<HTMLFormElement>) => {
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

  const handleSubmitEmail = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ type: "idle", message: "" });

    if (!email.trim()) {
      setStatus({ type: "error", message: "Please enter email content." });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/submit-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Something went wrong.");
      }

      setStatus({ type: "success", message: data.message });
      setEmail("");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to submit email.";
      setStatus({ type: "error", message });
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case "check-link":
        return (
          <div className="w-full max-w-md rounded-xl bg-gray-700 p-8 shadow-2xl border border-gray-600">
            <h1 className="mb-2 text-center text-2xl font-semibold text-gray-100">
              Phishing URL Reporter
            </h1>
            <p className="mb-6 text-center text-sm text-gray-300">
              Submit suspicious links so they can be reviewed and handled safely.
            </p>

            <form onSubmit={handleSubmitUrl} className="space-y-4">
              <div>
                <label
                  htmlFor="url"
                  className="mb-1 block text-sm font-medium text-gray-300"
                >
                  Suspicious URL
                </label>
                <input
                  id="url"
                  type="url"
                  placeholder="https://example.com/suspicious-link"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-gray-100 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 px-4 py-2 text-sm font-medium text-white shadow-lg transition hover:from-blue-700 hover:to-blue-900 disabled:cursor-not-allowed disabled:from-gray-600 disabled:to-gray-800"
              >
                {loading ? "Submitting..." : "Submit URL"}
              </button>
            </form>

            {status.type !== "idle" && (
              <p
                className={`mt-4 text-center text-sm ${
                  status.type === "success" ? "text-green-400" : "text-red-400"
                }`}
              >
                {status.message}
              </p>
            )}

            <p className="mt-6 text-center text-xs text-gray-500">
              This demo only stores URLs for educational purposes and does not
              perform any automatic analysis.
            </p>
          </div>
        );
      case "check-email":
        return (
          <div className="w-full max-w-md rounded-xl bg-gray-700 p-8 shadow-2xl border border-gray-600">
            <h1 className="mb-2 text-center text-2xl font-semibold text-gray-100">
              Check Email
            </h1>
            <p className="mb-6 text-center text-sm text-gray-300">
              Paste the email content to analyze for phishing indicators.
            </p>

            <form onSubmit={handleSubmitEmail} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="mb-1 block text-sm font-medium text-gray-300"
                >
                  Email Content
                </label>
                <textarea
                  id="email"
                  placeholder="Paste the full email here..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  rows={6}
                  className="w-full rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-gray-100 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 px-4 py-2 text-sm font-medium text-white shadow-lg transition hover:from-blue-700 hover:to-blue-900 disabled:cursor-not-allowed disabled:from-gray-600 disabled:to-gray-800"
              >
                {loading ? "Submitting..." : "Submit Email"}
              </button>
            </form>

            {status.type !== "idle" && (
              <p
                className={`mt-4 text-center text-sm ${
                  status.type === "success" ? "text-green-400" : "text-red-400"
                }`}
              >
                {status.message}
              </p>
            )}

            <p className="mt-6 text-center text-xs text-gray-500">
              This demo stores emails for educational purposes and does not
              perform any automatic analysis.
            </p>
          </div>
        );
      case "check-blocklist":
        return (
          <div className="w-full max-w-md rounded-xl bg-gray-700 p-8 shadow-2xl border border-gray-600">
            <h1 className="mb-2 text-center text-2xl font-semibold text-gray-100">
              Check Blocklist
            </h1>
            <p className="mb-6 text-center text-sm text-gray-300">
              Feature coming soon: Check URLs against known blocklists.
            </p>
          </div>
        );
      case "view-analysis":
        return (
          <div className="w-full max-w-md rounded-xl bg-gray-700 p-8 shadow-2xl border border-gray-600">
            <h1 className="mb-2 text-center text-2xl font-semibold text-gray-100">
              View Analysis
            </h1>
            <p className="mb-6 text-center text-sm text-gray-300">
              Feature coming soon: View stored URLs and emails with analysis.
            </p>
          </div>
        );
    }
  };

  return (
    <main className="flex min-h-screen bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 shadow-2xl p-6 border-r border-gray-700">
        <h2 className="text-lg font-semibold text-gray-100 mb-4">Phishing Detection</h2>
        <nav className="space-y-2">
          <button
            onClick={() => {
              setCurrentView("check-link");
              setStatus({ type: "idle", message: "" });
            }}
            className={`w-full text-left px-4 py-2 rounded-lg transition ${
              currentView === "check-link"
                ? "bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
            }`}
          >
            Check Link
          </button>
          <button
            onClick={() => {
              setCurrentView("check-email");
              setStatus({ type: "idle", message: "" });
            }}
            className={`w-full text-left px-4 py-2 rounded-lg transition ${
              currentView === "check-email"
                ? "bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
            }`}
          >
            Check Email
          </button>
          <button
            onClick={() => {
              setCurrentView("check-blocklist");
              setStatus({ type: "idle", message: "" });
            }}
            className={`w-full text-left px-4 py-2 rounded-lg transition ${
              currentView === "check-blocklist"
                ? "bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
            }`}
          >
            Check Blocklist
          </button>
          <button
            onClick={() => {
              setCurrentView("view-analysis");
              setStatus({ type: "idle", message: "" });
            }}
            className={`w-full text-left px-4 py-2 rounded-lg transition ${
              currentView === "view-analysis"
                ? "bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
            }`}
          >
            View Analysis
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4">
        {renderContent()}
      </div>
    </main>
  );
}


