import { generateId } from "../utils";

export interface Record {
  id: string;
}

/*
export interface Storage {
  getAll(collectionName: string): Promise<Record[]>;
  getById(collectionName: string, id: string): Promise<Record>;
  create(collectionName: string, data: any): Promise<Record>;
  update(collectionName: string, id: string, data: any): Promise<Record>;
  delete(collectionName: string, id: string): Promise<void>;
}
*/

export interface Storage<T> {
  getAll(collectionName: string): Promise<T[]>;
  getById(collectionName: string, id: string): Promise<T>;
  create(collectionName: string, data: any): Promise<T>;
  update(collectionName: string, id: string, data: any): Promise<T>;
  delete(collectionName: string, id: string): Promise<void>;
}
export class LocalStorage<T extends { id: string }> implements Storage<T> {
  // async getAll(collectionName: string): Promise<Record[]> {
  async getAll(collectionName: string): Promise<T[]> {
    return JSON.parse(localStorage.getItem(collectionName) || null) || [];
  }

  // async getById(collectionName: string, id: string): Promise<Record> {
  async getById(collectionName: string, id: string): Promise<T> {
    const items = await this.getAll(collectionName);
    const result = items.find((x) => x.id == id);

    return result;
  }

  // async create(collectionName: string, data: any): Promise<Record> {
  async create(collectionName: string, data: any): Promise<T> {
    const items = await this.getAll(collectionName);

    const record = Object.assign({}, data, { id: generateId() });

    items.push(record);

    localStorage.setItem(collectionName, JSON.stringify(items));

    return record;
  }

  // async update(collectionName: string, id: string, data: any): Promise<Record> {
  async update(collectionName: string, id: string, data: any): Promise<T> {
    const items = await this.getAll(collectionName);

    const index = this.findIndexOfItem(items, id);

    const record = Object.assign({}, data, { id });

    items[index] = record;

    localStorage.setItem(collectionName, JSON.stringify(items));

    return record;
  }

  async delete(collectionName: string, id: string): Promise<void> {
    const items = await this.getAll(collectionName);

    const index = this.findIndexOfItem(items, id);

    items.splice(index, 1);

    localStorage.setItem(collectionName, JSON.stringify(items));
  }

  private findIndexOfItem(collection: Record[], id: string): number {
    const index = collection.findIndex((x) => x.id == id);

    if (index == -1) {
      throw new ReferenceError(`No record with id ${id} found`);
    }

    return index;
  }
}
