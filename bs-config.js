module.exports = {
  port: process.env.PORT,
  server: {
    baseDir: ["./src", "./build/contracts"],
    routes: {
      "/vendor": "./node_modules",
    },
  },
};
