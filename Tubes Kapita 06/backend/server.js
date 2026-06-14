import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/apiRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // For development flexibility
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json({ limit: '2mb' })); // Support larger privacy policy texts

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date() });
});

// API Routes
app.use('/api', apiRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`  Privacy Policy Scanner Backend running on port ${PORT}`);
  console.log(`  Environment: ${process.env.LLM_PROVIDER || 'mock'} mode`);
  console.log(`===================================================`);
});
