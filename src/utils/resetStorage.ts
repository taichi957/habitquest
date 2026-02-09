/**
 * ✅ XÓA HẾT TẤT CẢ LOCALSTORAGE + INDEXEDDB
 */
export async function resetAllStorage() {
  // 1️⃣ XÓA LOCALSTORAGE
  const storageKeys = [
    "habitquest-player",
    "habitquest-storage",
    "habitquest-achievements",
    "habitquest-avatars",
    "habitquest-backgrounds",
    "habitquest-pets",
    "habitquest-victory-log",
    "habitquest-shop-v12",
    "habitquest-time",
    "habitquest-sound",
    "habitquest-language",
  ];

  storageKeys.forEach((key) => {
    localStorage.removeItem(key);
  });

  // 2️⃣ XÓA INDEXEDDB (cho PWA)
  return new Promise<void>((resolve) => {
    const databases = indexedDB.databases?.() || [];
    
    databases.then((dbs) => {
      dbs.forEach((db) => {
        if (db.name) {
          indexedDB.deleteDatabase(db.name);
        }
      });
      resolve();
    }).catch(() => resolve());
  });
}
