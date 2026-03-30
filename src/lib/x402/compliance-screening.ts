import {
  ComplianceReport,
  ComplianceFlag,
  AuditEntry,
} from "./types";

// OFAC-style blocklist (simplified demo)
const SANCTIONED_WALLETS = new Set([
  "0x0000000000000000000000000000000000000001",
  "0x0000000000000000000000000000000000000002",
  "0x7f367cc41522ce07e53ee2460c02f1919c8ba3d1", // Example OFAC wallet
]);

// High-risk jurisdictions for geographic restriction
const RESTRICTED_JURISDICTIONS = [
  "Iran",
  "North Korea",
  "Syria",
  "Crimea",
  "Cuba",
];

interface WalletProfile {
  address: string;
  age: number; // days since first activity
  transactionCount: number;
  uniqueTokens: number;
  suspiciousPatterns: string[];
}

class ComplianceEngine {
  private auditLog: AuditEntry[] = [];
  private screeningCache: Map<string, ComplianceReport> = new Map();

  screenWallet(
    walletAddress: string,
    jurisdiction?: string,
    profile?: WalletProfile
  ): ComplianceReport {
    // Check cache first
    const cached = this.screeningCache.get(walletAddress);
    if (cached && Date.now() - cached.timestamp < 3600000) {
      // 1 hour cache
      return cached;
    }

    const flags: ComplianceFlag[] = [];
    let riskScore = 0;

    // Check sanctions list
    if (SANCTIONED_WALLETS.has(walletAddress.toLowerCase())) {
      flags.push({
        type: "sanctions",
        severity: "high",
        description: "Wallet appears on OFAC sanctions list",
      });
      riskScore += 50;
    }

    // Check wallet age
    if (profile) {
      if (profile.age < 7) {
        flags.push({
          type: "wallet_age",
          severity: "medium",
          description: `Very new wallet (${profile.age} days old)`,
        });
        riskScore += 15;
      } else if (profile.age < 30) {
        flags.push({
          type: "wallet_age",
          severity: "low",
          description: `Young wallet (${profile.age} days old)`,
        });
        riskScore += 5;
      }

      // Check transaction patterns
      if (profile.transactionCount > 1000) {
        flags.push({
          type: "transaction_pattern",
          severity: "low",
          description: "High transaction frequency detected",
        });
        riskScore += 10;
      } else if (profile.transactionCount < 3) {
        flags.push({
          type: "transaction_pattern",
          severity: "low",
          description: "Minimal transaction history",
        });
        riskScore += 5;
      }

      // Check token exposure
      if (profile.uniqueTokens > 50) {
        flags.push({
          type: "token_exposure",
          severity: "medium",
          description: "Exposure to many different tokens suggests high risk",
        });
        riskScore += 20;
      }

      // Check for suspicious patterns
      if (profile.suspiciousPatterns && profile.suspiciousPatterns.length > 0) {
        for (const pattern of profile.suspiciousPatterns) {
          flags.push({
            type: "transaction_pattern",
            severity: "high",
            description: `Suspicious pattern detected: ${pattern}`,
          });
          riskScore += 25;
        }
      }
    }

    // Geographic check
    if (jurisdiction && RESTRICTED_JURISDICTIONS.includes(jurisdiction)) {
      flags.push({
        type: "geographic",
        severity: "high",
        description: `Activity from restricted jurisdiction: ${jurisdiction}`,
      });
      riskScore += 50;
    }

    riskScore = Math.min(100, riskScore);

    const report: ComplianceReport = {
      walletAddress,
      isBlacklisted: SANCTIONED_WALLETS.has(walletAddress.toLowerCase()),
      riskScore,
      riskLevel: this.calculateRiskLevel(riskScore),
      flags,
      timestamp: Date.now(),
      auditTrail: [
        {
          timestamp: Date.now(),
          action: "wallet_screened",
          actor: "compliance-engine",
          result: `Risk score: ${riskScore}, Risk level: ${this.calculateRiskLevel(riskScore)}`,
        },
      ],
    };

    // Cache the result
    this.screeningCache.set(walletAddress, report);

    // Add to audit log
    this.auditLog.push({
      timestamp: Date.now(),
      action: "wallet_screening",
      actor: "compliance-engine",
      result: `${walletAddress} screened with risk level ${report.riskLevel}`,
    });

    return report;
  }

  private calculateRiskLevel(
    score: number
  ): "low" | "medium" | "high" | "critical" {
    if (score >= 80) return "critical";
    if (score >= 60) return "high";
    if (score >= 40) return "medium";
    return "low";
  }

  blockWallet(walletAddress: string, reason: string): void {
    SANCTIONED_WALLETS.add(walletAddress.toLowerCase());
    this.auditLog.push({
      timestamp: Date.now(),
      action: "wallet_blocked",
      actor: "compliance-engine",
      result: `${walletAddress} added to blocklist: ${reason}`,
    });
  }

  unblockWallet(walletAddress: string, reason: string): void {
    SANCTIONED_WALLETS.delete(walletAddress.toLowerCase());
    this.auditLog.push({
      timestamp: Date.now(),
      action: "wallet_unblocked",
      actor: "compliance-engine",
      result: `${walletAddress} removed from blocklist: ${reason}`,
    });
  }

  isBlacklisted(walletAddress: string): boolean {
    return SANCTIONED_WALLETS.has(walletAddress.toLowerCase());
  }

  getAuditLog(): AuditEntry[] {
    return [...this.auditLog];
  }

  clearCache(): void {
    this.screeningCache.clear();
  }
}

// Singleton instance
let complianceEngine: ComplianceEngine | null = null;

export function getComplianceEngine(): ComplianceEngine {
  if (!complianceEngine) {
    complianceEngine = new ComplianceEngine();
  }
  return complianceEngine;
}

export function screenWallet(
  walletAddress: string,
  jurisdiction?: string,
  profile?: WalletProfile
): ComplianceReport {
  return getComplianceEngine().screenWallet(walletAddress, jurisdiction, profile);
}

export function isWalletBlacklisted(walletAddress: string): boolean {
  return getComplianceEngine().isBlacklisted(walletAddress);
}

export function addToBlocklist(walletAddress: string, reason: string): void {
  getComplianceEngine().blockWallet(walletAddress, reason);
}

export function removeFromBlocklist(walletAddress: string, reason: string): void {
  getComplianceEngine().unblockWallet(walletAddress, reason);
}

export function getComplianceAuditLog(): AuditEntry[] {
  return getComplianceEngine().getAuditLog();
}
