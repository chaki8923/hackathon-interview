import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  distDir: '.next',
  images: {
    // X(Twitter)とGoogleのプロフィール画像、およびMicroCMSの画像を表示するために追加
    domains: [
      "ibj-hack.s3.ap-northeast-1.amazonaws.com", 
    ],
  },
};

export default nextConfig;
