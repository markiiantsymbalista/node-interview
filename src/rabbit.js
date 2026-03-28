import amqp from 'amqplib';

let channelPromise;

export async function getChannel() {
  if (!channelPromise) {
    channelPromise = amqp.connect(process.env.RABBIT_URL || 'amqp://localhost:5672')
      .then(async (connection) => {
        const channel = await connection.createChannel();
        await channel.assertQueue('notification.send', { durable: true });
        await channel.assertQueue('delivery.feedback', { durable: true });
        return channel;
      });
  }

  return channelPromise;
}
