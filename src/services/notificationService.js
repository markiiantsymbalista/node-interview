import { v4 as uuid } from 'uuid';
import { pool } from '../db.js';

const SLA_SECONDS = 20;

export async function createDeliveryRequest({ customerId, channel, messageText }) {
  const deliveryId = uuid();
  const expiresAt = new Date(Date.now() + SLA_SECONDS * 1000);

  await pool.query(
    `INSERT INTO delivery_requests (delivery_id, customer_id, channel, message_text, status, expires_at)
     VALUES ($1, $2, $3, $4, 'pending', $5)`,
    [deliveryId, customerId, channel, messageText, expiresAt]
  );

  return { deliveryId, expiresAt };
}

export async function getDeliveryRequest(deliveryId) {
  const result = await pool.query(
    `SELECT delivery_id, customer_id, channel, message_text, status, created_at, expires_at, delivered_at, last_error
     FROM delivery_requests
     WHERE delivery_id = $1`,
    [deliveryId]
  );

  return result.rows[0] || null;
}
