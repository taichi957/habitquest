export async function fetchServerDate(): Promise<string> {
  try {
    const res = await fetch("https://worldtimeapi.org/api/timezone/Asia/Tokyo");

    if (!res.ok) {
      throw new Error(`Failed to fetch time: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();

    if (!data || typeof data.datetime !== "string") {
      throw new Error("Invalid time data from server");
    }

    // yyyy-mm-dd
    return data.datetime.slice(0, 10);
  } catch (err) {
    // ブラウザのCORSやネットワーク障害でfetchが失敗することがあるため、
    // フォールバックでローカル日時を返すようにする
    // ログは開発時のみの参考として出力
    // yyyy-mm-dd
    console.warn("fetchServerDate failed, falling back to local date:", err);
    return new Date().toISOString().slice(0, 10);
  }
}
