import express from 'express';
import { registerRoutes } from './routes';

const app = express();
const PORT = process.env.PORT || 3006;

app.use(express.json());

registerRoutes(app);

app.listen(PORT, () => {
  console.log(`Assignments service running on port ${PORT}`);
});
