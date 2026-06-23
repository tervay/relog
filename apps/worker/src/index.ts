import { connect } from "@relog/queue";

async function main(): Promise<void> {
  await connect();
  console.log("Worker connected, waiting for messages");
}

main().catch((error) => {
  console.error("Worker failed to start", error);
  process.exit(1);
});
