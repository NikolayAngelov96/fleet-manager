import { Storage } from "./Storage";
import { api } from "./request";

export class RemoteStorage<T extends { id: string }> implements Storage<T> {
  async getAll(collectionName: string): Promise<T[]> {
    const result = await api.get(collectionName);

    return result.results.map((r) => this.parse(r));
  }
  async getById(collectionName: string, id: string): Promise<T> {
    const result = await api.get(`${collectionName}/${id}`);

    return this.parse(result);
  }
  async create(collectionName: string, data: any): Promise<T> {
    const result = await api.post(collectionName, data);

    return this.parse({
      ...data,
      ...result,
    });
  }
  async update(collectionName: string, id: string, data: any): Promise<T> {
    const result = await api.put(
      `${collectionName}/${id}`,
      this.serialize(data)
    );

    return this.getById(collectionName, id);
  }
  async delete(collectionName: string, id: string): Promise<void> {
    await api.delete(`${collectionName}/${id}`);
  }

  private parse(record: any): T {
    record.id = record.objectId;
    delete record.objectId;
    return record;
  }

  private serialize(record: T): any {
    const result = Object.assign({}, record) as any;
    result.objectId = result.id;
    delete result.id;
    return result;
  }
}
