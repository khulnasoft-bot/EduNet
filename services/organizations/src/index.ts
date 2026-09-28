import express from 'express';
import { registerRoutes } from './routes';

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());

registerRoutes(app);

app.listen(PORT, () => {
  console.log(`Organizations service running on port ${PORT}`);
});
