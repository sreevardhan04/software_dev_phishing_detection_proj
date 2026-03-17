"use client";

import { FormEvent, useState, useEffect } from "react";

type Status = {
  type: "idle" | "success" | "error";
  message: string;
};

type View = "check-link" | "check-email" | "check-blocklist" | "view-analysis";

type Analysis = {
  _id: string;
  url: string;
  riskScore: number;
  classification: "Safe" | "Suspicious" | "High Risk";
  domainAnalysis: {
    domainAge: string;
    whoisInfo: string;
    suspiciousPatterns: string[];
    similarity: string;
  };
  sslAnalysis: {
    httpsUsed: boolean;
    certificateIssuer: string;
    certificateValidity: string;
    suspiciousIndicators: string[];
  };
  urlStructure: {
    urlLength: number;
    usesIpAddress: boolean;
    suspiciousCharacters: string[];
    multipleRedirects: boolean;
  };
  contentAnalysis: {
    hasLoginForms: boolean;
    requestsSensitiveInfo: boolean;
    suspiciousKeywords: string[];
    brandImpersonation: string;
  };
  pageBehavior: {
    automaticRedirects: boolean;
    hiddenElements: boolean;
    suspiciousScripts: boolean;
    externalResources: boolean;
  };
  reputationChecks: {
    blacklistStatus: string;
    knownPhishingReports: number;
    malwareDetected: boolean;
  };
  visualSimilarity: {
    imitatesPopularServices: boolean;
    logoSpoofing: boolean;
    details: string;
  };
  riskIndicators: string[];
  verdict: string;
  recommendedAction: string;
  createdAt: string;
};

export default function HomePage() {
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<Status>({ type: "idle", message: "" });
  const [currentView, setCurrentView] = useState<View>("check-link");
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [analyseLoading, setAnalyseLoading] = useState(false);
  const [expandedAnalysisId, setExpandedAnalysisId] = useState<string | null>(null);

  // Fetch analyses when View Analysis tab is open
  useEffect(() => {
    if (currentView === "view-analysis") {
      fetchAnalyses();
    }
  }, [currentView]);

  const fetchAnalyses = async () => {
    setAnalyseLoading(true);
    try {
      const res = await fetch("/api/get-analyses");
      const data = await res.json();
      if (data.success) {
        setAnalyses(data.analyses);
      }
    } catch (error) {
      console.error("Failed to fetch analyses:", error);
    } finally {
      setAnalyseLoading(false);
    }
  };

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
          <div className="w-full max-w-4xl">
            <div className="rounded-xl bg-gray-700 p-8 shadow-2xl border border-gray-600">
              <h1 className="mb-2 text-center text-2xl font-semibold text-gray-100">
                Analysis Reports
              </h1>
              <p className="mb-6 text-center text-sm text-gray-300">
                Detailed phishing risk analysis for submitted URLs
              </p>

              {analyseLoading ? (
                <p className="text-center text-gray-300">Loading analyses...</p>
              ) : analyses.length === 0 ? (
                <p className="text-center text-gray-300">
                  No analyses yet. Submit URLs from the "Check Link" tab to see reports here.
                </p>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {analyses.map((analysis) => (
                    <div
                      key={analysis._id}
                      className="bg-gray-800 rounded-lg border border-gray-600 p-4 cursor-pointer hover:border-blue-500 transition"
                      onClick={() =>
                        setExpandedAnalysisId(
                          expandedAnalysisId === analysis._id ? null : analysis._id
                        )
                      }
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-gray-300 truncate">{analysis.url}</p>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            analysis.classification === "Safe"
                              ? "bg-green-900 text-green-200"
                              : analysis.classification === "Suspicious"
                              ? "bg-yellow-900 text-yellow-200"
                              : "bg-red-900 text-red-200"
                          }`}
                        >
                          {analysis.classification}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex-1 bg-gray-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              analysis.riskScore < 30
                                ? "bg-green-500"
                                : analysis.riskScore < 70
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                            style={{ width: `${analysis.riskScore}%` }}
                          />
                        </div>
                        <span className="text-gray-300 text-sm font-semibold">
                          {analysis.riskScore}/100
                        </span>
                      </div>

                      {expandedAnalysisId === analysis._id && (
                        <div className="mt-4 pt-4 border-t border-gray-600 text-sm text-gray-300 space-y-3">
                          <div>
                            <h3 className="font-semibold text-gray-100 mb-1">Verdict</h3>
                            <p>{analysis.verdict}</p>
                          </div>

                          <div>
                            <h3 className="font-semibold text-gray-100 mb-1">
                              Recommended Action
                            </h3>
                            <p className="text-blue-400">{analysis.recommendedAction}</p>
                          </div>

                          <div>
                            <h3 className="font-semibold text-gray-100 mb-1">
                              Risk Indicators
                            </h3>
                            <ul className="list-disc list-inside space-y-1">
                              {analysis.riskIndicators.map((indicator, idx) => (
                                <li key={idx}>{indicator}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div>
                              <h4 className="font-semibold text-gray-100">Domain Analysis</h4>
                              <p>
                                Similarity:{" "}
                                <span className="text-gray-400">
                                  {analysis.domainAnalysis.similarity}
                                </span>
                              </p>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-100">SSL/TLS Security</h4>
                              <p>
                                HTTPS:{" "}
                                <span className={analysis.sslAnalysis.httpsUsed ? "text-green-400" : "text-red-400"}>
                                  {analysis.sslAnalysis.httpsUsed ? "Yes" : "No"}
                                </span>
                              </p>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-100">URL Structure</h4>
                              <p>
                                Uses IP Address:{" "}
                                <span className={analysis.urlStructure.usesIpAddress ? "text-red-400" : "text-green-400"}>
                                  {analysis.urlStructure.usesIpAddress ? "Yes" : "No"}
                                </span>
                              </p>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-100">Content Analysis</h4>
                              <p>
                                Brand Impersonation:{" "}
                                <span className="text-gray-400">
                                  {analysis.contentAnalysis.brandImpersonation}
                                </span>
                              </p>
                            </div>
                          </div>

                          <div>
                            <h3 className="font-semibold text-gray-100 mb-1">Suspicious Keywords</h3>
                            {analysis.contentAnalysis.suspiciousKeywords.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {analysis.contentAnalysis.suspiciousKeywords.map((keyword, idx) => (
                                  <span
                                    key={idx}
                                    className="bg-red-900 text-red-200 px-2 py-1 rounded text-xs"
                                  >
                                    {keyword}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-400">None detected</p>
                            )}
                          </div>

                          <div>
                            <h3 className="font-semibold text-gray-100 mb-1">
                              Visual Similarity Check
                            </h3>
                            <p>{analysis.visualSimilarity.details}</p>
                          </div>

                          <div className="text-xs text-gray-500">
                            Analyzed on:{" "}
                            {new Date(analysis.createdAt).toLocaleString()}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
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


