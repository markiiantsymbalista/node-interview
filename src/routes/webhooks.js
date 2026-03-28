import express from 'express';
import { getChannel } from '../rabbit.js';

export const router = express.Router();

router.post('/api/webhooks/delivery-feedback', async (req, res, next) => {
  try {
    const channel = await getChannel();
    const payload = {
      deliveryId: req.body.deliveryId,
      status: req.body.status,
      providerEventId: req.body.providerEventId,
      deliveredAt: req.body.deliveredAt,
      reason: req.body.reason
    };

    channel.sendToQueue('delivery.feedback', Buffer.from(JSON.stringify(payload)), {
      persistent: true
    });

    res.status(202).json({ queued: true });
  } catch (error) {
    next(error);
  }
});
