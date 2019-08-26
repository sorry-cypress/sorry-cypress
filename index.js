const { app } = require('./app.js');

const PORT = process.env.PORT || 1234;

async function main() {
  app.on('error', error => {
    throw new Error(error);
  });
  app.listen(PORT, () => {
    console.log(`Listening on ${PORT}...`);
  });
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
