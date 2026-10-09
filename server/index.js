import 'dotenv/config';
import { createApp } from './app.js';
import { connectDatabase, disconnectDatabase } from './database.js';
import { seedPortfolio } from './content.js';

try {
  await connectDatabase(process.env.MONGODB_URI);
  await seedPortfolio();

  const port = Number(process.env.PORT || 3001);
  const server = createApp().listen(port, '0.0.0.0', () => {
    console.log(`Portfolio server listening on http://localhost:${port}`);
  });

  async function stop() {
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  }
  process.once('SIGINT', stop);
  process.once('SIGTERM', stop);
  server.on('error', async (error) => {
    console.error(`Server startup failed: ${error.code || error.name}`);
    await disconnectDatabase();
    process.exit(1);
  });
} catch (error) {
  console.error('Unable to start the portfolio server. Check MONGODB_URI, database access, and content/portfolio.json.');
  console.error(`Failure type: ${error.name}`);
  await disconnectDatabase();
  process.exit(1);
}
