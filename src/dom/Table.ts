export class Table {
  private records: any[] = [];
  // private rows: Map<object, HTMLTableRowElement> = new Map();

  constructor(
    private element: HTMLTableSectionElement,
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
    console.log("get row func", id);
    const row = this.element.querySelector(`#${id}`) as HTMLTableRowElement;

    return row;
  }

  updateRow(rowId: string, record: any) {
    const row = this.getRow(rowId);

    const indexOfOldRecord = this.records.findIndex((x) => x.id == record.id);

    this.records[indexOfOldRecord] = record;

    const nextSibling = row.nextElementSibling;

    const newRow = this.createRow(record);
    row.remove();

    if (nextSibling != null) {
      nextSibling.parentElement.insertBefore(newRow, nextSibling);
    } else {
      this.element.appendChild(newRow);
    }
  }
}
