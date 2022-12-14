import { Collection } from "./Collection";

export interface Service<T extends { id: string }, TData> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T>;
  create(data: TData): Promise<T>;
  update(id: string, data: TData): Promise<T>;
  delete(id: string): Promise<void>;
}

// export abstract class DataService<T, TData> implements Service<T, TData> {
export abstract class DataService<T extends { id: string }, TData>
  implements Service<T, TData>
{
  // private collection: Collection;
  private collection: Collection<T>;

  // constructor(collection: Collection) {
  constructor(collection: Collection<T>) {
    this.collection = collection;
  }

  async getAll(): Promise<T[]> {
    const records = (await this.collection.getAll()).map((x) =>
      this.parseRecord(x)
    );

    return records;
  }
  async getById(id: string): Promise<T> {
    const record = await this.collection.getById(id);

    return this.parseRecord(record);
  }
  async create(data: TData): Promise<T> {
    this.validate(data);

    const record = await this.collection.create(data);

    return this.parseRecord(record);
  }
  async update(id: string, data: TData): Promise<T> {
    this.validate(data);

    const record = await this.collection.update(id, data);

    return this.parseRecord(record);
  }
  delete(id: string): Promise<void> {
    return this.collection.delete(id);
  }

  // protected abstract parseRecord(data: { id: string }): T;
  protected abstract parseRecord(data: T): T;

  // protected abstract validate(data: any): void;
  protected abstract validate(data: TData): void;
}
