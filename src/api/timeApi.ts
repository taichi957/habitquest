export async function fetchServerDate(): Promise<string> {
  const res = await fetch(
    "https://worldtimeapi.org/api/timezone/Asia/Tokyo"
  );

  if (!res.ok) {
    throw new Error("Failed to fetch time");
  }

  const data = await res.json();

  // yyyy-mm-dd
  return data.datetime.slice(0, 10);
}
