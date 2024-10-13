// src/redisClient.ts
import { createClient } from 'redis';

const redisClient = createClient({
  url: 'redis://default:AXS8AAIjcDEzMzViM2U1MGQ5N2Q0YjBhYTIyNGU4ZjgxMzc4OWI3NHAxMA@sensible-scorpion-29884.upstash.io:6379',
  socket: {
    tls: true,
  },
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

export default redisClient;
