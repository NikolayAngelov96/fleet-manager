import { Storage, Record } from "./Storage";

export class Collection {
  constructor(private storage: Storage, private name: string) {}

  async getAll(): Promise<Record[]> {
    return this.storage.getAll(this.name);
  }

  async getById(id: string): Promise<Record> {
    return this.storage.getById(this.name, id);
  }

  async create(data: any): Promise<Record> {
    return this.storage.create(this.name, data);
  }

  async update(id: string, data: any): Promise<Record> {
    return this.storage.update(this.name, id, data);
  }

  async delete(id: string): Promise<void> {
    return this.storage.delete(this.name, id);
  }
}
