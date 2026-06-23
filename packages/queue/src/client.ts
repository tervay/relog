import amqplib from "amqplib";

type Connection = Awaited<ReturnType<typeof amqplib.connect>>;

export async function connect(): Promise<Connection> {
  const url = process.env["RABBITMQ_URL"];
  if (!url)
    throw new Error("RABBITMQ_URL environment variable is not set; cannot connect to RabbitMQ");

  return await amqplib.connect(url);
}
