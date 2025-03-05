import { Table } from 'primeng/table';


export function filterGlobal(table: Table, target: EventTarget) {
  table.filterGlobal((<HTMLInputElement>target).value, 'contains');
}
