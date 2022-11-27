import { Storage, Record } from "./Storage";

export class Collection<T extends { id: string }> {
  constructor(private storage: Storage<T>, private name: string) {}

  // async getAll(): Promise<Record[]> {
  async getAll(): Promise<T[]> {
    return this.storage.getAll(this.name);
  }

  // async getById(id: string): Promise<Record> {
  async getById(id: string): Promise<T> {
    return this.storage.getById(this.name, id);
  }

  // async create(data: any): Promise<Record> {
  async create(data: any): Promise<T> {
    return this.storage.create(this.name, data);
  }

  // async update(id: string, data: any): Promise<Record> {
  async update(id: string, data: any): Promise<T> {
    return this.storage.update(this.name, id, data);
  }

  async delete(id: string): Promise<void> {
    return this.storage.delete(this.name, id);
  }
}
