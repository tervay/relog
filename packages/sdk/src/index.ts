export interface RelogOptions {
  apiKey: string;
  ingestUrl?: string;
}

export function createRelog(options: RelogOptions) {
  const { apiKey, ingestUrl = "http://localhost:3001" } = options;

  async function track(event: string, properties?: Record<string, unknown>) {
    await fetch(`${ingestUrl}/ingest`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ event, properties }),
    });
  }

  return { track };
}
