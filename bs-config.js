module.exports = {
  port: process.env.PORT,
  files: "*",
  server: {
    baseDir: ["./src", "./build/contracts"],
    routes: {
      "/vendor": "./node_modules",
    },
  },
};
