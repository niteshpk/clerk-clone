import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class LocalStorageService {
  constructor() {}

  /**
   * Set an item in localStorage
   * @param key - The key to store the value under
   * @param value - The value to store
   */
  setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  /**
   * Get an item from localStorage
   * @param key - The key to retrieve
   * @returns The stored value or null if not found
   */
  getItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  /**
   * Remove an item from localStorage
   * @param key - The key to remove
   */
  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  /**
   * Clear all items from localStorage
   */
  clear(): void {
    localStorage.clear();
  }

  /**
   * Check if a key exists in localStorage
   * @param key - The key to check
   * @returns True if the key exists, false otherwise
   */
  hasItem(key: string): boolean {
    try {
      return localStorage.getItem(key) !== null;
    } catch (error) {
      console.error("Error checking localStorage:", error);
      return false;
    }
  }
}
