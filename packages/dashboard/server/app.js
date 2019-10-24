const express = require('express');
const path = require('path');
const app = (exports.app = express());

app.use(express.static(path.join(__dirname, '../dist')));
app.use((_, res) => {
  res.sendFile(path.join(__dirname, '../dist/', 'index.html'));
});
