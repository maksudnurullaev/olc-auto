const app = require("./app-ws");
const PORT = process.env.PORT || 8181;

app.listen(PORT, () => {
  console.log('Server listening on port: ' + PORT);
});

