import fs from 'fs';
import path from 'path';

const STORAGE_DIR = path.join(process.cwd(), '.storage');
const STORAGE_FILE = path.join(STORAGE_DIR, 'page-content.json');

// Ensure storage directory exists
const ensureStorageDir = () => {
  if (!fs.existsSync(STORAGE_DIR)) {
    fs.mkdirSync(STORAGE_DIR, { recursive: true });
  }
};

// Read all content from file
export const readStorage = (): any[] => {
  ensureStorageDir();

  if (!fs.existsSync(STORAGE_FILE)) {
    return [];
  }

  try {
    const data = fs.readFileSync(STORAGE_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading storage file:', error);
    return [];
  }
};

// Write all content to file
export const writeStorage = (content: any[]): void => {
  ensureStorageDir();

  try {
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(content, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing storage file:', error);
  }
};

// Get items by slug and section
export const getItems = (slug?: string, section?: string): any[] => {
  const allItems = readStorage();

  let filtered = allItems;

  if (slug) {
    filtered = filtered.filter(item => item.page_slug === slug);
  }

  if (section) {
    filtered = filtered.filter(item => item.section === section);
  }

  return filtered.sort((a, b) => a.order_index - b.order_index);
};

// Create new item
export const createItem = (data: any): any => {
  const allItems = readStorage();

  const newItem = {
    ...data,
    id: data.id || `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  allItems.push(newItem);
  writeStorage(allItems);

  return newItem;
};

// Update existing item
export const updateItem = (id: string, data: any): any => {
  const allItems = readStorage();
  const index = allItems.findIndex(item => item.id === id);

  if (index === -1) {
    return null;
  }

  allItems[index] = {
    ...allItems[index],
    ...data,
    id, // Ensure ID doesn't change
    updated_at: new Date().toISOString()
  };

  writeStorage(allItems);

  return allItems[index];
};

// Delete item
export const deleteItem = (id: string): boolean => {
  const allItems = readStorage();
  const filtered = allItems.filter(item => item.id !== id);

  if (filtered.length === allItems.length) {
    return false; // Item not found
  }

  writeStorage(filtered);
  return true;
};
