import express from 'express';
import { createDeliveryRequest, getDeliveryRequest } from '../services/notificationService.js';
import { getBalance } from '../services/balanceService.js';

export const router = express.Router();

router.post('/api/notifications', async (req, res, next) => {
  try {
    const { customerId, channel, messageText } = req.body;

    const request = await createDeliveryRequest({ customerId, channel, messageText });
    res.status(202).json(request);
  } catch (error) {
    next(error);
  }
});

router.get('/api/notifications/:deliveryId', async (req, res, next) => {
  try {
    const row = await getDeliveryRequest(req.params.deliveryId);
    if (!row) {
      res.status(404).json({ error: 'not_found' });
      return;
    }

    res.json(row);
  } catch (error) {
    next(error);
  }
});

router.get('/api/customers/:customerId/balance', async (req, res, next) => {
  try {
    const balance = await getBalance(req.params.customerId);
    res.json({ balance });
  } catch (error) {
    next(error);
  }
});
