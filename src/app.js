import express from 'express';
import { router as notificationsRouter } from './routes/notifications.js';
import { router as webhooksRouter } from './routes/webhooks.js';
import { startDeliveryFeedbackConsumer } from './consumers/deliveryFeedbackConsumer.js';

const app = express();
app.use(express.json());
app.use(notificationsRouter);
app.use(webhooksRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'internal_error' });
});

startDeliveryFeedbackConsumer().catch((error) => {
  console.error('consumer bootstrap failed', error);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
