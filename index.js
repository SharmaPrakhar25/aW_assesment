const express = require('express');

const app = express();
const port = 3000;

const routes = require('./routes/index');

routes(app);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Assesment app Running on port ${port}`);
});

module.exports = { app };
