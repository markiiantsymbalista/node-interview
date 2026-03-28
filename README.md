# Node Reliability Interview Kit

A code-review exercise for backend Node.js engineers.

## Scenario
A generic **document delivery** service:
- create a delivery request
- receive client feedback via webhook
- feedback is put into RabbitMQ
- if delivery was successful, charge the customer and notify the end user
- delivery SLA is **20 seconds**

## Stack
- Node.js + Express
- PostgreSQL
- RabbitMQ

## Run locally
```bash
npm install
docker compose up -d
npm start
```

## Useful endpoints
- `POST /api/notifications`
- `GET /api/notifications/:deliveryId`
- `POST /api/webhooks/delivery-feedback`
- `GET /api/customers/:customerId/balance`

## Seed customer
- `customerId = 11111111-1111-1111-1111-111111111111`
- initial balance = `100.00`
