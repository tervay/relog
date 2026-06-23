import type amqplib from "amqplib";

export async function publish(
  channel: amqplib.Channel,
  queue: string,
  payload: unknown,
): Promise<void> {
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(payload)));
}
