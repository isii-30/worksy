const fs = require("fs");
const path = require("path");

function loadRoutes(app) {
  const modulesPath = path.join(__dirname, "../modules");

  if (!fs.existsSync(modulesPath)) {
    return;
  }

  const modules = fs.readdirSync(modulesPath);

  modules.forEach((moduleName) => {
    const modulePath = path.join(modulesPath, moduleName);

    if (!fs.statSync(modulePath).isDirectory()) {
      return;
    }

    const routeFile = path.join(
      modulePath,
      `${moduleName}.routes.js`
    );

    if (!fs.existsSync(routeFile)) {
      return;
    }

    const routes = require(routeFile);

    app.use(`/api/${moduleName}`, routes);

    console.log(`Loaded route: /api/${moduleName}`);
  });
}

module.exports = loadRoutes;