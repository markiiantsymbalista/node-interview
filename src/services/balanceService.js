import { pool } from '../db.js';

export async function getBalance(customerId) {
  const result = await pool.query(
    `SELECT balance FROM customer_balances WHERE customer_id = $1`,
    [customerId]
  );

  return Number(result.rows[0].balance);
}

export async function chargeCustomer(customerId, amount, deliveryId) {
  const balance = await getBalance(customerId);

  if (balance < amount) {
    throw new Error('insufficient_funds');
  }

  await pool.query(
    `UPDATE customer_balances
     SET balance = balance - $2,
         updated_at = now()
     WHERE customer_id = $1`,
    [customerId, amount]
  );

  await pool.query(
    `INSERT INTO charges (delivery_id, customer_id, amount)
     VALUES ($1, $2, $3)`,
    [deliveryId, customerId, amount]
  );
}
