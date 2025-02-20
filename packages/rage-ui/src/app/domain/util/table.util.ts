import { Table } from 'primeng/table';


export function filterGlobal(membersTable: Table, target: EventTarget) {
  membersTable.filterGlobal((<HTMLInputElement>target).value, 'contains');
}
