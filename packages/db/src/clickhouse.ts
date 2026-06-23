import { createClient } from "@clickhouse/client";

const url = process.env["CLICKHOUSE_URL"];
const database = process.env["CLICKHOUSE_DB"];

export const clickhouse = createClient({
  ...(url ? { url } : {}),
  ...(database ? { database } : {}),
});
