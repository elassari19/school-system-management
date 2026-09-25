module.exports = {
  apps: [
    {
      name: "app",
      script: "dist/main.js",
      interpreter: "node",
      watch: true,
      ignore_watch: ["node_modules", "logs", "dist"],
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "app-dev",
      script: "src/main.ts",
      interpreter: "node",
      interpreter_args: "--require ts-node/register",
      watch: true,
      ignore_watch: ["node_modules", "logs"],
      env: {
        NODE_ENV: "development",
      },
    },
  ],
};
