export class Table {
  private records: any[] = [];
  // private rows: Map<object, HTMLTableRowElement> = new Map();

  constructor(
    private element: HTMLTableElement,
    private createRow: (record: any) => HTMLTableRowElement,
    records?: any[]
  ) {
    if (records) {
      this.records = records;
    }
    // this.records.forEach(this.addRow.bind(this));
  }

  addRow(record: any) {
    const row = this.createRow(record);
    this.element.appendChild(row);

    this.records.push(record);
  }

  get(id: string) {
    return this.records.find((x) => x.id == id);
  }

  getRow(id: string): HTMLTableRowElement {
    const row = this.element.querySelector(`#${id}`) as HTMLTableRowElement;

    return row;
  }
}
