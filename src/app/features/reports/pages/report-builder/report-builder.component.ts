import {
  Component,
  inject,
  signal,
  computed,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { ReportsService } from '../../services/reports.service';
import { ToastService } from '@core/services/toast.service';
import { TranslationService } from '@core/services/translation.service';
import {
  ReportTypeDefinition,
  FieldDefinition,
  ReportFilter,
  ReportResult,
  EXPORT_FORMATS,
  FILTER_OPERATORS,
} from '../../models/report.models';

@Component({
  selector: 'app-report-builder',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './report-builder.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportBuilderComponent implements OnInit {
  private readonly reportsService = inject(ReportsService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly toast = inject(ToastService);
  readonly i18n = inject(TranslationService);

  // ── Catalog ──────────────────────────────────────────────────────────────
  readonly catalog = toSignal(
    this.reportsService.getCatalog().pipe(
      catchError(() => {
        this.toast.error(this.i18n.translate('reports.toast.catalog_error'));
        return of([] as ReportTypeDefinition[]);
      })
    ),
    { initialValue: [] as ReportTypeDefinition[] }
  );

  // ── Config state ─────────────────────────────────────────────────────────
  readonly templateId = signal<string | null>(null);
  readonly templateName = signal('');
  readonly templateDescription = signal('');
  readonly isShared = signal(false);

  readonly selectedReportType = signal('');
  readonly selectedFields = signal<string[]>([]);
  readonly filters = signal<ReportFilter[]>([]);
  readonly sortField = signal('');
  readonly sortOrder = signal<'asc' | 'desc'>('asc');
  readonly dateFrom = signal('');
  readonly dateTo = signal('');

  // ── Pagination ───────────────────────────────────────────────────────────
  readonly pageLimit = signal(50);
  readonly pageOffset = signal(0);

  // ── Results ──────────────────────────────────────────────────────────────
  readonly result = signal<ReportResult | null>(null);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly exporting = signal<string | null>(null);

  // ── Enhanced Features State ───────────────────────────────────────────────
  readonly reportViewMode = signal<'table' | 'chart'>('table');
  readonly chartField = signal<string>('');
  readonly chartLabelField = signal<string>('');

  readonly showScheduleModal = signal(false);
  readonly templateSchedules = signal<any[]>([]);
  readonly scheduleFrequency = signal('daily');
  readonly scheduleHour = signal('08:00');
  readonly scheduleEmail = signal('');
  readonly scheduleFormat = signal('pdf');
  readonly loadingSchedules = signal(false);

  // ── AI/Prompt state ──────────────────────────────────────────────────────
  readonly promptText = signal('');
  readonly promptLoading = signal(false);
  readonly isRecording = signal(false);
  private mediaRecorder: any = null;
  private audioChunks: Blob[] = [];

  // ── Derived ──────────────────────────────────────────────────────────────

  readonly availableFields = computed<FieldDefinition[]>(() => {
    const type = this.selectedReportType();
    const cat = this.catalog();
    return cat.find((c) => c.key === type)?.fields ?? [];
  });

  readonly hasNumericColumns = computed(() => {
    return this.selectedFields().some(key => this.getFieldType(key) === 'NUMBER');
  });

  readonly numericColumnSummaries = computed(() => {
    const rows = this.result()?.rows ?? [];
    const columns = this.selectedFields();
    const summaries: Record<string, { sum: number; avg: number }> = {};
    
    for (const col of columns) {
      if (this.getFieldType(col) === 'NUMBER') {
        let sum = 0;
        let count = 0;
        for (const row of rows) {
          const val = Number(row[col]);
          if (!isNaN(val)) {
            sum += val;
            count++;
          }
        }
        summaries[col] = {
          sum,
          avg: count > 0 ? sum / count : 0
        };
      }
    }
    return summaries;
  });

  readonly numericFields = computed(() => {
    return this.selectedFields().filter(key => this.getFieldType(key) === 'NUMBER');
  });

  readonly labelFields = computed(() => {
    return this.selectedFields().filter(key => this.getFieldType(key) !== 'NUMBER');
  });

  readonly chartData = computed(() => {
    const rows = this.result()?.rows ?? [];
    const valCol = this.chartField();
    const lblCol = this.chartLabelField();
    if (!valCol || !lblCol) return [];

    return rows.map(row => {
      const val = Number(row[valCol]);
      return {
        label: String(row[lblCol] ?? ''),
        value: isNaN(val) ? 0 : val
      };
    });
  });

  readonly maxChartValue = computed(() => {
    const data = this.chartData();
    if (!data.length) return 1;
    const max = Math.max(...data.map(d => d.value));
    return max > 0 ? max : 1;
  });

  readonly EXPORT_FORMATS = EXPORT_FORMATS;
  readonly FILTER_OPERATORS = FILTER_OPERATORS;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('templateId');
    if (id) {
      this.templateId.set(id);
      this._loadTemplate(id);
    }
  }

  private _loadTemplate(id: string): void {
    this.reportsService.getTemplates().pipe(
      catchError(() => of([]))
    ).subscribe((templates) => {
      const tpl = templates.find((t) => t.id === id);
      if (!tpl) {
        this.toast.error(this.i18n.translate('reports.toast.template_not_found'));
        return;
      }
      this.templateName.set(tpl.name);
      this.templateDescription.set(tpl.description ?? '');
      this.isShared.set(tpl.is_shared);
      this.selectedReportType.set(tpl.report_type);
      this.selectedFields.set([...tpl.selected_fields]);
      this.filters.set(tpl.filters.map((f) => ({ ...f })));
      this.sortField.set(tpl.sort_field ?? '');
      this.sortOrder.set((tpl.sort_order as 'asc' | 'desc') ?? 'asc');
      this.dateFrom.set(tpl.date_from ? tpl.date_from.split('T')[0] : '');
      this.dateTo.set(tpl.date_to ? tpl.date_to.split('T')[0] : '');
    });
  }

  // ── Report type change ────────────────────────────────────────────────────
  onReportTypeChange(type: string): void {
    this.selectedReportType.set(type);
    this.selectedFields.set([]);
    this.filters.set([]);
    this.sortField.set('');
    this.sortOrder.set('asc');
    this.result.set(null);
    this.pageOffset.set(0);
  }

  // ── Field selection ───────────────────────────────────────────────────────
  isFieldSelected(key: string): boolean {
    return this.selectedFields().includes(key);
  }

  toggleField(key: string): void {
    const current = this.selectedFields();
    if (current.includes(key)) {
      this.selectedFields.set(current.filter((f) => f !== key));
    } else {
      this.selectedFields.set([...current, key]);
    }
  }

  selectAllFields(): void {
    this.selectedFields.set(this.availableFields().map((f) => f.key));
  }

  clearAllFields(): void {
    this.selectedFields.set([]);
  }

  // ── Filters ───────────────────────────────────────────────────────────────
  addFilter(): void {
    const fields = this.availableFields();
    if (!fields.length) return;
    this.filters.update((f) => [
      ...f,
      { field: fields[0].key, operator: 'eq', value: '' },
    ]);
  }

  updateFilter(index: number, changes: Partial<ReportFilter>): void {
    this.filters.update((list) =>
      list.map((f, i) => (i === index ? { ...f, ...changes } : f))
    );
  }

  removeFilter(index: number): void {
    this.filters.update((f) => f.filter((_, i) => i !== index));
  }

  operatorNeedsValue(operator: string): boolean {
    return operator !== 'is_null' && operator !== 'is_not_null';
  }

  getFieldType(fieldKey: string): string {
    const field = this.availableFields().find((f) => f.key === fieldKey);
    return field ? field.type : 'STRING';
  }

  getFieldOptions(fieldKey: string): { value: string; label: string }[] | null {
    const field = this.availableFields().find((f) => f.key === fieldKey);
    return field && field.type === 'ENUM' && field.options ? field.options : null;
  }

  getOperatorsForField(fieldKey: string): { key: string; labelKey: string }[] {
    const field = this.availableFields().find((f) => f.key === fieldKey);
    if (!field) return this.FILTER_OPERATORS;

    const generalOps = [
      { key: 'eq',          labelKey: 'reports.operators.eq' },
      { key: 'ne',          labelKey: 'reports.operators.ne' },
      { key: 'is_null',     labelKey: 'reports.operators.is_null' },
      { key: 'is_not_null', labelKey: 'reports.operators.is_not_null' }
    ];

    if (field.type === 'STRING') {
      return [
        { key: 'like',        labelKey: 'reports.operators.like' },
        ...generalOps
      ];
    }

    if (field.type === 'NUMBER' || field.type === 'DATE') {
      return [
        ...generalOps,
        { key: 'gt',          labelKey: 'reports.operators.gt' },
        { key: 'gte',         labelKey: 'reports.operators.gte' },
        { key: 'lt',          labelKey: 'reports.operators.lt' },
        { key: 'lte',         labelKey: 'reports.operators.lte' }
      ];
    }

    return generalOps;
  }

  // ── Preview ───────────────────────────────────────────────────────────────
  previewReport(): void {
    if (!this.selectedReportType() || !this.selectedFields().length) {
      this.toast.warning(this.i18n.translate('reports.toast.preview_select'));
      return;
    }
    this.loading.set(true);
    const req = this._buildRequest();
    this.reportsService.runReport(req).subscribe({
      next: (res) => {
        this.result.set(res);
        this.loading.set(false);
        const numCols = this.numericFields();
        const lblCols = this.labelFields();
        if (numCols.length && !this.chartField()) {
          this.chartField.set(numCols[0]);
        }
        if (lblCols.length && !this.chartLabelField()) {
          this.chartLabelField.set(lblCols[0]);
        }
      },
      error: (err) => {
        this.toast.error(this.i18n.translate('reports.toast.preview_error'), err?.error?.detail);
        this.loading.set(false);
      },
    });
  }

  // ── Pagination ────────────────────────────────────────────────────────────
  prevPage(): void {
    const offset = Math.max(0, this.pageOffset() - this.pageLimit());
    this.pageOffset.set(offset);
    this.previewReport();
  }

  nextPage(): void {
    const total = this.result()?.total ?? 0;
    const newOffset = this.pageOffset() + this.pageLimit();
    if (newOffset < total) {
      this.pageOffset.set(newOffset);
      this.previewReport();
    }
  }

  onLimitChange(value: string): void {
    this.pageLimit.set(Number(value));
    this.pageOffset.set(0);
    if (this.result()) {
      this.previewReport();
    }
  }

  readonly currentPage = computed(() =>
    Math.floor(this.pageOffset() / this.pageLimit()) + 1
  );

  readonly totalPages = computed(() =>
    Math.ceil((this.result()?.total ?? 0) / this.pageLimit())
  );

  // ── Export ────────────────────────────────────────────────────────────────
  exportReport(format: string): void {
    if (!this.selectedReportType() || !this.selectedFields().length) {
      this.toast.warning(this.i18n.translate('reports.toast.export_warning'));
      return;
    }
    this.exporting.set(format);
    const columnLabelsOverride: Record<string, string> = {};
    for (const key of this.selectedFields()) {
      const i18nKey = `reports.fields.${key}`;
      const enLabel = this.i18n.translateInLang(i18nKey, 'en');
      columnLabelsOverride[key] = enLabel === i18nKey ? this.fieldLabel(key) : enLabel;
    }
    const req = { ...this._buildRequest(), limit: 5000, offset: 0, column_labels_override: columnLabelsOverride };
    const title = this.templateName() || 'report';
    this.reportsService.exportReport(req, format, title, 'en').subscribe({
      next: (blob) => {
        const ext = format === 'excel' ? 'xlsx' : format;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title}.${ext}`;
        a.click();
        URL.revokeObjectURL(url);
        this.exporting.set(null);
        this.toast.success(this.i18n.translate('reports.toast.export_success', { format: format.toUpperCase() }));
      },
      error: () => {
        this.toast.error(this.i18n.translate('reports.toast.export_error'));
        this.exporting.set(null);
      },
    });
  }

  // ── Save template ─────────────────────────────────────────────────────────
  saveTemplate(): void {
    if (!this.templateName().trim()) {
      this.toast.warning(this.i18n.translate('reports.toast.name_required'));
      return;
    }
    if (!this.selectedReportType() || !this.selectedFields().length) {
      this.toast.warning(this.i18n.translate('reports.toast.config_required'));
      return;
    }
    this.saving.set(true);
    const payload = {
      name: this.templateName().trim(),
      description: this.templateDescription().trim() || undefined,
      report_type: this.selectedReportType(),
      selected_fields: this.selectedFields(),
      filters: this.filters().map((f) => ({
        field: f.field,
        operator: f.operator,
        value: this.operatorNeedsValue(f.operator) ? f.value : undefined,
      })),
      sort_field: this.sortField() || undefined,
      sort_order: this.sortOrder(),
      date_from: this.dateFrom() ? `${this.dateFrom()}T00:00:00` : undefined,
      date_to: this.dateTo() ? `${this.dateTo()}T23:59:59` : undefined,
      is_shared: this.isShared(),
    };

    const id = this.templateId();
    const obs$ = id
      ? this.reportsService.updateTemplate(id, payload)
      : this.reportsService.saveTemplate(payload as Parameters<typeof this.reportsService.saveTemplate>[0]);

    obs$.subscribe({
      next: (saved) => {
        this.toast.success(this.i18n.translate(id ? 'reports.toast.update_success' : 'reports.toast.save_success'));
        this.saving.set(false);
        if (!id) {
          this.templateId.set(saved.id);
          this.router.navigate(['/app/reports/builder', saved.id], {
            replaceUrl: true,
          });
        }
      },
      error: (err) => {
        this.toast.error(this.i18n.translate('reports.toast.save_error'), err?.error?.detail);
        this.saving.set(false);
      },
    });
  }

  // ── AI Prompt & Voice Reports ─────────────────────────────────────────────
  runPromptReport(textPrompt?: string): void {
    const promptVal = textPrompt || this.promptText().trim();
    if (!promptVal) {
      this.toast.warning('El prompt no puede estar vacío');
      return;
    }

    this.promptLoading.set(true);
    this.reportsService.runReportByPrompt(promptVal).subscribe({
      next: (res) => {
        this.selectedReportType.set(res.query.report_type);
        this.selectedFields.set([...res.query.selected_fields]);
        this.filters.set(res.query.filters.map((f) => ({ field: f.field, operator: f.operator, value: f.value })));
        this.sortField.set(res.query.sort_field ?? '');
        this.sortOrder.set((res.query.sort_order as 'asc' | 'desc') ?? 'asc');
        if (res.query.limit) {
          this.pageLimit.set(res.query.limit);
        }
        if (res.query.offset !== undefined) {
          this.pageOffset.set(res.query.offset);
        }
        this.result.set(res.result);
        this.promptLoading.set(false);
        this.toast.success('Reporte generado por IA con éxito');
      },
      error: (err) => {
        this.toast.error('Error al procesar el prompt de IA', err?.error?.detail);
        this.promptLoading.set(false);
      }
    });
  }

  toggleRecording(): void {
    if (this.isRecording()) {
      this.stopRecording();
    } else {
      this.startRecording();
    }
  }

  private startRecording(): void {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      this.audioChunks = [];
      this.mediaRecorder = new MediaRecorder(stream);
      this.mediaRecorder.ondataavailable = (event: any) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };
      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        const audioFile = new File([audioBlob], 'report_command.webm', { type: 'audio/webm' });
        
        // Detener micrófono
        stream.getTracks().forEach(track => track.stop());

        this.promptLoading.set(true);
        this.reportsService.runReportByAudio(audioFile).subscribe({
          next: (res) => {
            this.promptText.set(res.transcript || '');
            this.selectedReportType.set(res.query.report_type);
            this.selectedFields.set([...res.query.selected_fields]);
            this.filters.set(res.query.filters.map((f) => ({ field: f.field, operator: f.operator, value: f.value })));
            this.sortField.set(res.query.sort_field ?? '');
            this.sortOrder.set((res.query.sort_order as 'asc' | 'desc') ?? 'asc');
            if (res.query.limit) {
              this.pageLimit.set(res.query.limit);
            }
            if (res.query.offset !== undefined) {
              this.pageOffset.set(res.query.offset);
            }
            this.result.set(res.result);
            this.promptLoading.set(false);
            this.toast.success('Audio transcrito y reporte generado por IA');
          },
          error: (err) => {
            this.toast.error('Error al procesar el audio de IA', err?.error?.detail);
            this.promptLoading.set(false);
          }
        });
      };

      this.mediaRecorder.start();
      this.isRecording.set(true);
      this.toast.info('Grabando audio...');
    }).catch(() => {
      this.toast.error('No se pudo acceder al micrófono');
    });
  }

  private stopRecording(): void {
    if (this.mediaRecorder && this.isRecording()) {
      this.mediaRecorder.stop();
      this.isRecording.set(false);
    }
  }

  // ── Clear ─────────────────────────────────────────────────────────────────
  clearAll(): void {
    this.selectedReportType.set('');
    this.selectedFields.set([]);
    this.filters.set([]);
    this.sortField.set('');
    this.sortOrder.set('asc');
    this.dateFrom.set('');
    this.dateTo.set('');
    this.result.set(null);
    this.pageOffset.set(0);
  }

  goBack(): void {
    this.router.navigate(['/app/reports']);
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  private _buildRequest() {
    return {
      report_type: this.selectedReportType(),
      selected_fields: this.selectedFields(),
      filters: this.filters()
        .filter((f) => f.field && f.operator)
        .map((f) => ({
          field: f.field,
          operator: f.operator,
          value: this.operatorNeedsValue(f.operator) ? f.value : undefined,
        })),
      sort_field: this.sortField() || undefined,
      sort_order: this.sortOrder(),
      date_from: this.dateFrom() ? `${this.dateFrom()}T00:00:00` : undefined,
      date_to: this.dateTo() ? `${this.dateTo()}T23:59:59` : undefined,
      limit: this.pageLimit(),
      offset: this.pageOffset(),
    };
  }

  fieldLabel(key: string): string {
    return this.availableFields().find((f) => f.key === key)?.label ?? key;
  }

  fieldI18nLabel(key: string, fallback?: string): string {
    const i18nKey = `reports.fields.${key}`;
    const translated = this.i18n.translate(i18nKey);
    return translated === i18nKey ? (fallback ?? key) : translated;
  }

  operatorLabel(op: string): string {
    const found = FILTER_OPERATORS.find((o) => o.key === op);
    return found ? this.i18n.translate(found.labelKey) : op;
  }

  formatCellValue(value: unknown): string {
    if (value === null || value === undefined) return '—';
    if (typeof value === 'boolean') return value ? this.i18n.translate('common.yes') : this.i18n.translate('common.no');
    return String(value);
  }

  loadSchedules(): void {
    const id = this.templateId();
    if (!id) return;
    this.loadingSchedules.set(true);
    this.reportsService.getSchedules(id).subscribe({
      next: (schedules) => {
        this.templateSchedules.set(schedules);
        this.loadingSchedules.set(false);
      },
      error: () => {
        this.toast.error(this.i18n.translate('reports.toast.load_schedules_error'));
        this.loadingSchedules.set(false);
      }
    });
  }

  openScheduleModal(): void {
    const id = this.templateId();
    if (!id) {
      this.toast.warning(this.i18n.translate('reports.toast.save_template_first'));
      return;
    }
    this.scheduleFrequency.set('daily');
    this.scheduleHour.set('08:00');
    this.scheduleEmail.set('');
    this.scheduleFormat.set('pdf');
    this.showScheduleModal.set(true);
    this.loadSchedules();
  }

  saveSchedule(): void {
    const id = this.templateId();
    if (!id) return;
    if (!this.scheduleEmail().trim()) {
      this.toast.warning(this.i18n.translate('reports.toast.email_required'));
      return;
    }
    const payload = {
      frequency: this.scheduleFrequency(),
      hour: this.scheduleHour(),
      email: this.scheduleEmail().trim(),
      format: this.scheduleFormat(),
      is_active: true
    };
    this.reportsService.createSchedule(id, payload).subscribe({
      next: () => {
        this.toast.success(this.i18n.translate('reports.toast.schedule_saved'));
        this.loadSchedules();
      },
      error: (err) => {
        this.toast.error(this.i18n.translate('reports.toast.schedule_save_error'), err?.error?.detail);
      }
    });
  }

  deleteSchedule(scheduleId: string): void {
    this.reportsService.deleteSchedule(scheduleId).subscribe({
      next: () => {
        this.toast.success(this.i18n.translate('reports.toast.schedule_deleted'));
        this.loadSchedules();
      },
      error: () => {
        this.toast.error(this.i18n.translate('reports.toast.schedule_delete_error'));
      }
    });
  }
}
