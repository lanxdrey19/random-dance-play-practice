/** @type {import('next').NextConfig} */
require("dotenv").config();

const nextConfig = {
  env: {
    AUDIO_LINK: process.env.AUDIO_LINK,
    DB_CONNECTION_STRING: process.env.DB_CONNECTION_STRING,
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
