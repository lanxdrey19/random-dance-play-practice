/** @type {import('next').NextConfig} */
require("dotenv").config();

const nextConfig = {
  env: {
    DB_CONNECTION_STRING: process.env.DB_CONNECTION_STRING,
    LOCALHOST_BASE_URL: process.env.LOCALHOST_BASE_URL,
    ONE_MILLISECOND: process.env.ONE_MILLISECOND,
    WEATHER_API_URL: process.env.WEATHER_API_URL,
    FANDOM_BASE_URL: process.env.FANDOM_BASE_URL,
    FANDOM_MAINPAGE: process.env.FANDOM_MAINPAGE,
    NEWS_SOURCE: process.env.NEWS_SOURCE,
    NEWS_BASE: process.env.NEWS_BASE,
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
