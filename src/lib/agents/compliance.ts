import { AgentMessage, AgentRole, AgentDecision } from "./types";
import { RWA_TOKENS, RWAToken } from "../rwa/tokens";

const AGENT: AgentRole = "compliance";

function generateId() {
  return `${AGENT}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

interface ComplianceCheck {
  token: string;
  kycRequired: boolean;
  jurisdictionRestrictions: string[];
  regulatoryStatus: "compliant" | "pending" | "restricted";
  issuerVerified: boolean;
  auditStatus: "audited" | "partial" | "unaudited";
  sanctionsClean: boolean;
}

const COMPLIANCE_DB: Record<string, Partial<ComplianceCheck>> = {
  USDY: {
    kycRequired: true,
    jurisdictionRestrictions: ["US (accredited only)", "OFAC sanctioned countries"],
    regulatoryStatus: "compliant",
    issuerVerified: true,
    auditStatus: "audited",
    sanctionsClean: true,
  },
  BUIDL: {
    kycRequired: true,
    jurisdictionRestrictions: ["US (qualified purchasers)", "OFAC sanctioned countries"],
    regulatoryStatus: "compliant",
    issuerVerified: true,
    auditStatus: "audited",
    sanctionsClean: true,
  },
  PAXG: {
    kycRequired: false,
    jurisdictionRestrictions: ["OFAC sanctioned countries"],
    regulatoryStatus: "compliant",
    issuerVerified: true,
    auditStatus: "audited",
    sanctionsClean: true,
  },
  slisBNB: {
    kycRequired: false,
    jurisdictionRestrictions: [],
    regulatoryStatus: "pending",
    issuerVerified: true,
    auditStatus: "audited",
    sanctionsClean: true,
  },
  lisUSD: {
    kycRequired: false,
    jurisdictionRestrictions: [],
    regulatoryStatus: "pending",
    issuerVerified: true,
    auditStatus: "partial",
    sanctionsClean: true,
  },
  ankrBNB: {
    kycRequired: false,
    jurisdictionRestrictions: [],
    regulatoryStatus: "pending",
    issuerVerified: true,
    auditStatus: "audited",
    sanctionsClean: true,
  },
};

function checkTokenCompliance(token: RWAToken): ComplianceCheck {
  const db = COMPLIANCE_DB[token.symbol] || {};
  return {
    token: token.symbol,
    kycRequired: db.kycRequired ?? false,
    jurisdictionRestrictions: db.jurisdictionRestrictions ?? [],
    regulatoryStatus: db.regulatoryStatus ?? "pending",
    issuerVerified: db.issuerVerified ?? false,
    auditStatus: db.auditStatus ?? "unaudited",
    sanctionsClean: db.sanctionsClean ?? true,
  };
}

export function runComplianceCycle(
  pendingDecisions: AgentDecision[]
): { messages: AgentMessage[]; approvedDecisions: AgentDecision[] } {
  const messages: AgentMessage[] = [];
  const approvedDecisions: AgentDecision[] = [];

  // Check each token's compliance status
  for (const token of RWA_TOKENS) {
    const check = checkTokenCompliance(token);

    const flags: string[] = [];
    if (check.kycRequired) flags.push("KYC required");
    if (check.jurisdictionRestrictions.length > 0) {
      flags.push(`Restricted: ${check.jurisdictionRestrictions.join(", ")}`);
    }
    if (check.auditStatus !== "audited") flags.push(`Audit: ${check.auditStatus}`);
    if (!check.issuerVerified) flags.push("Issuer not verified");

    messages.push({
      id: generateId(),
      agent: AGENT,
      timestamp: Date.now(),
      type: flags.length > 2 ? "alert" : "analysis",
      content: `[${token.symbol}] ${check.regulatoryStatus.toUpperCase()} | Issuer: ${check.issuerVerified ? "verified" : "unverified"} | Audit: ${check.auditStatus}${flags.length > 0 ? ` | Flags: ${flags.join("; ")}` : ""}`,
      confidence: 0.9,
      data: { compliance: check },
    });
  }

  // Review pending trade decisions for compliance
  for (const decision of pendingDecisions) {
    const token = RWA_TOKENS.find(t => t.symbol === decision.token);
    if (!token) continue;

    const check = checkTokenCompliance(token);

    if (!check.sanctionsClean) {
      messages.push({
        id: generateId(),
        agent: AGENT,
        timestamp: Date.now(),
        type: "alert",
        content: `BLOCKED: ${decision.token} ${decision.action} rejected. Sanctions check failed.`,
        confidence: 1.0,
        data: { blocked: true, token: decision.token, reason: "sanctions" },
      });
      continue;
    }

    if (check.regulatoryStatus === "restricted") {
      messages.push({
        id: generateId(),
        agent: AGENT,
        timestamp: Date.now(),
        type: "alert",
        content: `BLOCKED: ${decision.token} ${decision.action} rejected. Token restricted in current jurisdiction.`,
        confidence: 1.0,
        data: { blocked: true, token: decision.token, reason: "jurisdiction" },
      });
      continue;
    }

    if (decision.action === "buy" && check.auditStatus === "unaudited") {
      messages.push({
        id: generateId(),
        agent: AGENT,
        timestamp: Date.now(),
        type: "alert",
        content: `WARNING: ${decision.token} buy proceeding with caution. Token protocol is unaudited.`,
        confidence: 0.6,
        data: { warning: true, token: decision.token, reason: "unaudited" },
      });
    }

    approvedDecisions.push(decision);
  }

  const blocked = pendingDecisions.length - approvedDecisions.length;
  messages.push({
    id: generateId(),
    agent: AGENT,
    timestamp: Date.now(),
    type: "analysis",
    content: `Compliance review: ${approvedDecisions.length}/${pendingDecisions.length} decisions approved${blocked > 0 ? `, ${blocked} blocked` : ""}. Portfolio meets regulatory requirements.`,
    confidence: 0.95,
    data: { approved: approvedDecisions.length, blocked, total: pendingDecisions.length },
  });

  return { messages, approvedDecisions };
}
