export interface FieldDefinition {
  key: string;
  label: string;
}

export interface ReportTypeDefinition {
  key: string;
  label: string;
  fields: FieldDefinition[];
}

export interface ReportFilter {
  field: string;
  operator: string;
  value?: unknown;
}

export interface ReportRunRequest {
  report_type: string;
  selected_fields: string[];
  filters: ReportFilter[];
  sort_field?: string;
  sort_order: 'asc' | 'desc';
  date_from?: string;
  date_to?: string;
  limit: number;
  offset: number;
  column_labels_override?: Record<string, string>;
}

export interface ReportResult {
  columns: string[];
  column_labels: Record<string, string>;
  rows: Record<string, unknown>[];
  total: number;
  offset: number;
  limit: number;
}

export interface ReportTemplate {
  id: string;
  name: string;
  description?: string;
  owner_id: string;
  report_type: string;
  selected_fields: string[];
  filters: ReportFilter[];
  sort_field?: string;
  sort_order: string;
  date_from?: string;
  date_to?: string;
  is_shared: boolean;
  created_at: string;
  updated_at: string;
}

export interface ReportTemplateCreate {
  name: string;
  description?: string;
  report_type: string;
  selected_fields: string[];
  filters: ReportFilter[];
  sort_field?: string;
  sort_order: string;
  date_from?: string;
  date_to?: string;
  is_shared: boolean;
}

export const EXPORT_FORMATS = [
  {
    key: 'csv',
    label: 'CSV',
    icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  },
  {
    key: 'excel',
    label: 'Excel',
    icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  },
  {
    key: 'pdf',
    label: 'PDF',
    icon: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z',
  },
  {
    key: 'html',
    label: 'HTML',
    icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
  },
];

export const FILTER_OPERATORS = [
  { key: 'eq',          labelKey: 'reports.operators.eq' },
  { key: 'ne',          labelKey: 'reports.operators.ne' },
  { key: 'gt',          labelKey: 'reports.operators.gt' },
  { key: 'lt',          labelKey: 'reports.operators.lt' },
  { key: 'gte',         labelKey: 'reports.operators.gte' },
  { key: 'lte',         labelKey: 'reports.operators.lte' },
  { key: 'like',        labelKey: 'reports.operators.like' },
  { key: 'is_null',     labelKey: 'reports.operators.is_null' },
  { key: 'is_not_null', labelKey: 'reports.operators.is_not_null' },
];
