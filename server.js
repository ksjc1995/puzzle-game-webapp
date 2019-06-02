const express = require('express');
const serveStatic = require('serve-static');

let app = express();
app.use(serveStatic(__dirname + "/static"));

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log('Listening on port ' + port)
});