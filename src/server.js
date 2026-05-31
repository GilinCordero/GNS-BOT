import dotenv from 'dotenv';
import Fastify from 'fastify';

//Import routes

// Load environment variables from .env file
dotenv.config();

// Create Fastify instance
const fastify = Fastify({ logger: true });

//Register routes


// Start the server
await fastify.listen({
  port: process.env.PORT || 3000,
});