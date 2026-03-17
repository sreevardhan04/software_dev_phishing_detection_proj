import { Schema, model, models } from "mongoose";

const AnalysisSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true
    },
    riskScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    classification: {
      type: String,
      enum: ["Safe", "Suspicious", "High Risk"],
      required: true
    },
    domainAnalysis: {
      domainAge: String,
      whoisInfo: String,
      suspiciousPatterns: [String],
      similarity: String
    },
    sslAnalysis: {
      httpsUsed: Boolean,
      certificateIssuer: String,
      certificateValidity: String,
      suspiciousIndicators: [String]
    },
    urlStructure: {
      urlLength: Number,
      usesIpAddress: Boolean,
      suspiciousCharacters: [String],
      multipleRedirects: Boolean
    },
    contentAnalysis: {
      hasLoginForms: Boolean,
      requestsSensitiveInfo: Boolean,
      suspiciousKeywords: [String],
      brandImpersonation: String
    },
    pageBehavior: {
      automaticRedirects: Boolean,
      hiddenElements: Boolean,
      suspiciousScripts: Boolean,
      externalResources: Boolean
    },
    reputationChecks: {
      blacklistStatus: String,
      knownPhishingReports: Number,
      malwareDetected: Boolean
    },
    visualSimilarity: {
      imitatesPopularServices: Boolean,
      logoSpoofing: Boolean,
      details: String
    },
    riskIndicators: [String],
    verdict: String,
    recommendedAction: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: false
  }
);

const Analysis = models.Analysis || model("Analysis", AnalysisSchema);

export default Analysis;
