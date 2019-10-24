const { app } = require('./app');

const PORT = process.env.PORT || 3333;
async function main() {
  app.on('error', error => {
    throw error;
  });
  app.listen(PORT, () => {
    console.log(`Listening on ${PORT}...`);
  });
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
