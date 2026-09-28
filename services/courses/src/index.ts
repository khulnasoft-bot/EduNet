import express from 'express';
import { registerRoutes } from './routes';

const app = express();
const PORT = process.env.PORT || 3004;

app.use(express.json());

registerRoutes(app);

app.listen(PORT, () => {
  console.log(`Courses service running on port ${PORT}`);
});
