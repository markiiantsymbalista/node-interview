import { getChannel } from '../rabbit.js';
import { processFeedback } from '../services/feedbackProcessor.js';

export async function startDeliveryFeedbackConsumer() {
  const channel = await getChannel();

  channel.consume('delivery.feedback', async (message) => {
    if (!message) {
      return;
    }

    const payload = JSON.parse(message.content.toString('utf8'));
    channel.ack(message);

    try {
      await processFeedback(payload);
    } catch (error) {
      console.error('feedback processing failed', error);
    }
  });
}
