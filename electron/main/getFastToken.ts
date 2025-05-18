import fetch from "node-fetch";

async function fetchFastToken(): Promise<string> {
  const res = await fetchNode("https://api.fast.com/netflix/speedtest/v2");
  const json = await res.json() as { config?: { token?: string } };

  const token = json?.config?.token;
  if (!token) throw new Error("Geen token gevonden via Fast.com");

  return token;
}

