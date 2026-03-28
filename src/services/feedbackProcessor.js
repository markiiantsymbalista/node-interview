import { pool } from '../db.js';
import { chargeCustomer } from './balanceService.js';
import { notifyUser } from './userNotificationService.js';

const DELIVERY_PRICE = 5;

export async function processFeedback(feedback) {
  const result = await pool.query(
    `SELECT delivery_id, customer_id, channel, status, expires_at
     FROM delivery_requests
     WHERE delivery_id = $1`,
    [feedback.deliveryId]
  );

  const request = result.rows[0];
  if (!request) {
    throw new Error('delivery_not_found');
  }

  if (feedback.status === 'delivered') {
    await pool.query(
      `UPDATE delivery_requests
       SET status = 'delivered',
           delivered_at = now()
       WHERE delivery_id = $1`,
      [feedback.deliveryId]
    );

    await chargeCustomer(request.customer_id, DELIVERY_PRICE, feedback.deliveryId);

    await pool.query(
      `UPDATE delivery_requests
       SET charged_at = now()
       WHERE delivery_id = $1`,
      [feedback.deliveryId]
    );

    await notifyUser({
      customerId: request.customer_id,
      deliveryId: feedback.deliveryId,
      channel: request.channel
    });
  } else {
    await pool.query(
      `UPDATE delivery_requests
       SET status = 'failed',
           last_error = $2
       WHERE delivery_id = $1`,
      [feedback.deliveryId, feedback.reason || 'delivery_failed']
    );
  }
}
