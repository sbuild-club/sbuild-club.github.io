import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // stop `next dev` writing AGENTS.md and CLAUDE.md into the repo
  agentRules: false,
};

export default nextConfig;
