import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RWA Agent | AI-Powered RWA Portfolio Management on BNB Chain",
  description:
    "Multi-agent system for intelligent Real World Asset portfolio management on BNB Chain. Research, risk assessment, trading, and rebalancing powered by AI.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
