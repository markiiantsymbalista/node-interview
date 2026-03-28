CREATE TABLE IF NOT EXISTS customer_balances (
  customer_id uuid PRIMARY KEY,
  balance numeric(12,2) NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS delivery_requests (
  delivery_id uuid PRIMARY KEY,
  customer_id uuid NOT NULL,
  channel text NOT NULL,
  message_text text NOT NULL,
  status text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  delivered_at timestamptz NULL,
  charged_at timestamptz NULL,
  last_error text NULL
);

CREATE TABLE IF NOT EXISTS charges (
  id bigserial PRIMARY KEY,
  delivery_id uuid NOT NULL,
  customer_id uuid NOT NULL,
  amount numeric(12,2) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO customer_balances (customer_id, balance)
VALUES ('11111111-1111-1111-1111-111111111111', 100.00)
ON CONFLICT (customer_id) DO NOTHING;
