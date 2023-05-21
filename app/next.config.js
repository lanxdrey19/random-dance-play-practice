/** @type {import('next').NextConfig} */
require("dotenv").config();

const nextConfig = {
  env: {
    AUDIO_LINK: process.env.AUDIO_LINK,
    DB_CONNECTION_STRING: process.env.DB_CONNECTION_STRING,
    LOCALHOST_BASE_URL: process.env.LOCALHOST_BASE_URL,
    ONE_MILLISECOND: process.env.ONE_MILLISECOND,
  },
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ["mongoose"],
  },
  webpack(config) {
    config.experiments = { ...config.experiments, topLevelAwait: true };
    return config;
  },
};

module.exports = nextConfig;
