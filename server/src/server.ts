// Server Entry Point
// Starts the HTTP server and connects to the database

import app from './app';
import { PORT } from './config/env';
import { connectDatabase, disconnectDatabase } from './config/database';

const startServer = async () => {
  try {
    // Try to connect to database with retries
    await connectDatabase();
  } catch (error) {
    console.error('\n⚠️  WARNING: Starting server without database connection');
    console.error('📖 See server/DATABASE_TROUBLESHOOTING.md for help\n');
    
    // Continue without database for frontend development
    // Comment out the line below if you want to exit on database failure
    // process.exit(1);
  }

  const server = app.listen(PORT, () => {
    console.log('\n🚀 Server started successfully!');
    console.log(`📍 Port: ${PORT}`);
    console.log(`🏥 Health check: http://localhost:${PORT}/health`);
    console.log(`🔌 API base: http://localhost:${PORT}/api`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}\n`);
  });

  const shutdown = async (signal: string) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      try {
        await disconnectDatabase();
        console.log('✅ Database disconnected');
      } catch (error) {
        console.log('⚠️  Database was not connected');
      }
      console.log('✅ Server closed');
      process.exit(0);
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
      console.error('⚠️  Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  process.on('unhandledRejection', (reason) => {
    console.error('❌ Unhandled Rejection:', reason);
    server.close(() => process.exit(1));
  });

  process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    server.close(() => process.exit(1));
  });
};

startServer().catch((error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});
