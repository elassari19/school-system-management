module.exports = {
  apps: [
    {
      name: "app",
      script: "src/server.ts",
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
