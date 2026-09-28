import express from 'express';
import { registerRoutes } from './routes';

export { authenticate, authorize, AuthRequest } from './middleware';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

registerRoutes(app);

app.listen(PORT, () => {
  console.log(`Identity service running on port ${PORT}`);
});
