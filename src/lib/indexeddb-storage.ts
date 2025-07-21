export const idbStorage = {
  async getItem(key: string): Promise<string | null> {
    return new Promise((resolve) => {
      const request = indexedDB.open("AppDB", 1);
      request.onupgradeneeded = () => {
        request.result.createObjectStore("kv");
      };
      request.onsuccess = () => {
        const db = request.result;
        const tx = db.transaction("kv", "readonly");
        const store = tx.objectStore("kv");
        const getReq = store.get(key);
        getReq.onsuccess = () => resolve(getReq.result ?? null);
        getReq.onerror = () => resolve(null);
      };
      request.onerror = () => resolve(null);
    });
  },
  async setItem(key: string, value: string): Promise<void> {
    return new Promise((resolve) => {
      const request = indexedDB.open("AppDB", 1);
      request.onupgradeneeded = () => {
        request.result.createObjectStore("kv");
      };
      request.onsuccess = () => {
        const db = request.result;
        const tx = db.transaction("kv", "readwrite");
        const store = tx.objectStore("kv");
        store.put(value, key);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      };
      request.onerror = () => resolve();
    });
  },
  async removeItem(key: string): Promise<void> {
    return new Promise((resolve) => {
      const request = indexedDB.open("AppDB", 1);
      request.onupgradeneeded = () => {
        request.result.createObjectStore("kv");
      };
      request.onsuccess = () => {
        const db = request.result;
        const tx = db.transaction("kv", "readwrite");
        const store = tx.objectStore("kv");
        store.delete(key);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      };
      request.onerror = () => resolve();
    });
  },
};
