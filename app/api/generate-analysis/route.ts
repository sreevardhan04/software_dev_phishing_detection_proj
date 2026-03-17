import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Analysis from "@/models/Analysis";

function generatePhishingAnalysis(url: string) {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname;

    // Initialize risk score
    let riskScore = 20; // Start with low baseline
    const riskIndicators: string[] = [];

    // 1. Domain Analysis
    const domainParts = domain.split(".");
    const hasSuspiciousDomain =
      domain.length > 30 ||
      domain.includes("--") ||
      /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(domain);
    if (hasSuspiciousDomain) {
      riskScore += 15;
      riskIndicators.push("Suspicious domain pattern detected");
    }

    // 2. URL Analysis
    const urlLength = url.length;
    const hasIpAddress = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(url);
    if (urlLength > 75) {
      riskScore += 10;
      riskIndicators.push("Unusually long URL");
    }
    if (hasIpAddress) {
      riskScore += 20;
      riskIndicators.push("Uses IP address instead of domain name");
    }

    // 3. Protocol Analysis
    const usesHttps = url.startsWith("https://");
    if (!usesHttps) {
      riskScore += 15;
      riskIndicators.push("Does not use HTTPS encryption");
    }

    // 4. Suspicious Keywords
    const suspiciousKeywords = [
      "login",
      "signin",
      "paypal",
      "amazon",
      "apple",
      "account",
      "verify",
      "update",
      "confirm",
      "secure",
    ];
    const foundKeywords = suspiciousKeywords.filter((keyword) =>
      url.toLowerCase().includes(keyword)
    );
    if (foundKeywords.length > 0) {
      riskScore += foundKeywords.length * 5;
      riskIndicators.push(
        `Contains suspicious keywords: ${foundKeywords.join(", ")}`
      );
    }

    // 5. URL Encoding or Special Characters
    const hasEncodedChars = /%[0-9A-Fa-f]{2}/.test(url);
    const hasSuspiciousChars = /[\<\>\"\{\}\|\\^`]/.test(url);
    if (hasEncodedChars) {
      riskScore += 10;
      riskIndicators.push("Contains URL-encoded characters");
    }
    if (hasSuspiciousChars) {
      riskScore += 15;
      riskIndicators.push("Contains suspicious special characters");
    }

    // 6. Subdomain Check
    if (domainParts.length > 3) {
      riskScore += 5;
      riskIndicators.push("Multiple subdomains detected");
    }

    // 7. Typosquatting patterns (simplified)
    const commonDomains = [
      "google",
      "facebook",
      "amazon",
      "apple",
      "microsoft",
      "paypal",
    ];
    const isSimilarToCommon = commonDomains.some((common) => {
      const similarity = domain.toLowerCase().includes(common);
      return similarity;
    });
    if (isSimilarToCommon) {
      riskScore += 15;
      riskIndicators.push("Potentially imitates popular service domains");
    }

    // Cap risk score at 100
    riskScore = Math.min(riskScore, 100);

    // Determine classification
    let classification: "Safe" | "Suspicious" | "High Risk";
    if (riskScore < 30) {
      classification = "Safe";
    } else if (riskScore < 70) {
      classification = "Suspicious";
    } else {
      classification = "High Risk";
    }

    // Generate verdict
    let verdict = "";
    let recommendedAction = "";

    if (classification === "Safe") {
      verdict = `This website appears to be legitimate based on URL structure analysis. The domain, protocol, and URL patterns do not show typical phishing indicators.`;
      recommendedAction = "Safe to proceed";
    } else if (classification === "Suspicious") {
      verdict = `This website shows some characteristics that warrant caution. While it may not be outright malicious, certain patterns suggest exercising care before entering sensitive information.`;
      recommendedAction = "Proceed with caution";
    } else {
      verdict = `This website exhibits multiple phishing characteristics and is likely a phishing attempt. It is strongly recommended to avoid this site and report it.`;
      recommendedAction = "Avoid - likely phishing";
    }

    const analysis = {
      url,
      riskScore,
      classification,
      domainAnalysis: {
        domainAge: "Unknown (requires WHOIS integration)",
        whoisInfo: "Not available in this demo",
        suspiciousPatterns: hasSuspiciousDomain
          ? ["Long domain", "Unusual characters"]
          : [],
        similarity: isSimilarToCommon
          ? "Similarity to known legitimate domains detected"
          : "No similarity to known phishing patterns",
      },
      sslAnalysis: {
        httpsUsed: usesHttps,
        certificateIssuer: usesHttps
          ? "Would be verified with real certificate check"
          : "Not applicable",
        certificateValidity: usesHttps ? "Unknown (requires cert check)" : "N/A",
        suspiciousIndicators: !usesHttps ? ["No HTTPS"] : [],
      },
      urlStructure: {
        urlLength,
        usesIpAddress: hasIpAddress,
        suspiciousCharacters: [...new Set([...foundKeywords, ...suspiciousKeywords])],
        multipleRedirects: false,
      },
      contentAnalysis: {
        hasLoginForms: foundKeywords.some((k) =>
          ["login", "signin", "verify"].includes(k)
        ),
        requestsSensitiveInfo: foundKeywords.some((k) =>
          ["account", "verify", "confirm"].includes(k)
        ),
        suspiciousKeywords: foundKeywords,
        brandImpersonation: isSimilarToCommon
          ? "Potential brand impersonation detected"
          : "No brand impersonation detected",
      },
      pageBehavior: {
        automaticRedirects: false,
        hiddenElements: false,
        suspiciousScripts: false,
        externalResources: false,
      },
      reputationChecks: {
        blacklistStatus: "Not checked in this demo",
        knownPhishingReports: 0,
        malwareDetected: false,
      },
      visualSimilarity: {
        imitatesPopularServices: isSimilarToCommon,
        logoSpoofing: false,
        details: isSimilarToCommon
          ? "This URL may imitate legitimate services"
          : "No visual similarity indicators detected",
      },
      riskIndicators,
      verdict,
      recommendedAction,
    };

    return analysis;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to analyze URL: ${errorMessage}`);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body || typeof body.url !== "string") {
      return NextResponse.json(
        { success: false, message: "Request body must include a 'url' string." },
        { status: 400 }
      );
    }

    const url = body.url.trim();

    if (!url) {
      return NextResponse.json(
        { success: false, message: "URL cannot be empty." },
        { status: 400 }
      );
    }

    // Generate analysis
    const analysis = generatePhishingAnalysis(url);

    // Save to database
    await connectToDatabase();
    await Analysis.create(analysis);

    return NextResponse.json(
      { success: true, message: "Analysis generated successfully", analysis },
      { status: 201 }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error in /api/generate-analysis:", errorMessage, error);
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred while generating analysis.",
        error: process.env.NODE_ENV === "development" ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}
