/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir: '.next',
  images: {
    domains: [
      "ibj-hack.s3.ap-northeast-1.amazonaws.com", 
    ],
  },
};

module.exports = nextConfig; 