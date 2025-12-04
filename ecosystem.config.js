module.exports = {
  apps: [
    {
      name: "app",
      script: "./www/app.js",
      instances: 1,
      exec_mode: "cluster",
      max_memory_restart: "200M", // Mémoire maximum 200 Mo
      error_file: "./logs/err.log", // Log des erreurs
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
