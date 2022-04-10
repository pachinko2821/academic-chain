module.exports = {
  port: process.env.PORT,
  files: "*",
  notify: false,
  server: ["./src", "./build/contracts"],
  routes: {
    "/vendor": "./node_modules",
  },
};
