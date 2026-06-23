import type amqplib from "amqplib";

export async function consume(
  channel: amqplib.Channel,
  queue: string,
  handler: (payload: unknown) => Promise<void>,
): Promise<void> {
  await channel.consume(queue, async (msg: amqplib.ConsumeMessage | null) => {
    if (msg === null) {
      return;
    }
    try {
      const payload = JSON.parse(msg.content.toString());
      await handler(payload);
      channel.ack(msg);
    } catch {
      channel.nack(msg, false, false);
    }
  });
}
