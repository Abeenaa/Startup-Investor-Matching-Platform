// Server Entry Point
// Starts the HTTP server and connects to the database

import app from './app';
import { PORT } from './config/env';
import { connectDatabase, disconnectDatabase } from './config/database';

const startServer = async () => {
  await connectDatabase();

  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`API base: http://localhost:${PORT}/api`);
  });

  const shutdown = async (signal: string) => {
    console.log(`${signal} received. Shutting down...`);
    server.close(async () => {
      await disconnectDatabase();
      console.log('Server closed');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason);
    server.close(() => process.exit(1));
  });
};

startServer();
