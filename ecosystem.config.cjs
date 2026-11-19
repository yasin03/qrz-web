// pm2 ile yayın: `pm2 start ecosystem.config.cjs` (build sonrası .next/standalone dizininde,
// .next/static ve public kopyalanmış olarak).
module.exports = {
  apps: [
    {
      name: "qrz-web",
      script: "server.js",
      env: {
        NODE_ENV: "production",
        PORT: 3002,
        HOSTNAME: "0.0.0.0",
      },
    },
  ],
};
