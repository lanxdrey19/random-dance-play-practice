/** @type {import('next').NextConfig} */
require("dotenv").config();

const nextConfig = {
  env: {
    AUDIO_LINK: process.env.AUDIO_LINK,
  },
};

module.exports = nextConfig;
