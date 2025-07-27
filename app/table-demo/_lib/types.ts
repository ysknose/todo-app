export type ViewType = 'table' | 'kanban' | 'gantt';

export interface ViewProps {
  form: any; // React Hook Formのform instance
  fields: any[]; // useFieldArrayのfields
  onEditUser: (user: any) => void;
  onDeleteUser: (user: any) => void;
  onAddUser: () => void;
  onReset: () => void;
}

export interface TableViewProps {
  form: any;
  fields: any[];
  onEditUser: (user: any) => void;
  onDeleteUser: (user: any) => void;
  onAddUser: () => void;
  onReset: () => void;
}
