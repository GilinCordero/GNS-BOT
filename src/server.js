import dotenv from 'dotenv';
import fastify from 'fastify';

//Import routes

// Load environment variables from .env file
dotenv.config();

// Create Fastify instance
const fastify = fastify({ logger: true });

//Register routes


// Start the server
await fastify.listen({
  port: process.env.PORT || 3000,
});