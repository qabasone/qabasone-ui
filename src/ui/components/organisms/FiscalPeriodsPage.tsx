import type { ReactNode } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Edit3,
  Lock,
  Plus,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { Button } from "../atoms/Button";
import { StatusBadge } from "../atoms/StatusBadge";
import { Text } from "../atoms/Typography";

export type FiscalPeriodStatus = "open" | "locked" | "final-closed";

export interface FiscalYear {
  id: string;
  label: string;
  startDate: string;
  endDate: string;
  active?: boolean;
}

export interface FiscalPeriod {
  id: string;
  fiscalYearId: string;
  label: string;
  startDate: string;
  endDate: string;
  status: FiscalPeriodStatus;
  entriesCount?: number;
}

export interface FiscalPeriodsPageProps {
  years: FiscalYear[];
  periods: FiscalPeriod[];
  selectedYearId: string;
  selectedPeriodId?: string;
  onSelectYear: (yearId: string) => void;
  onSelectPeriod: (periodId: string) => void;
  onCreateYear?: () => void;
  onCreatePeriod?: () => void;
  onEditPeriod?: (period: FiscalPeriod) => void;
  onLockPeriod?: (period: FiscalPeriod) => void;
  onFinalClosePeriod?: (period: FiscalPeriod) => void;
  children?: ReactNode;
}

const STATUS_META: Record<
  FiscalPeriodStatus,
  {
    label: string;
    variant: "success" | "warning" | "critical";
    icon: React.ElementType;
    description: string;
  }
> = {
  open: {
    label: "مفتوحة",
    variant: "success",
    icon: CheckCircle2,
    description: "تسمح بترحيل القيود والمستندات داخل تاريخ الفترة.",
  },
  locked: {
    label: "مقفولة",
    variant: "warning",
    icon: Lock,
    description: "تمنع ترحيل أي قيد جديد داخل الفترة حتى يتم فتحها أو مراجعتها.",
  },
  "final-closed": {
    label: "إقفال نهائي",
    variant: "critical",
    icon: ShieldCheck,
    description: "فترة مغلقة نهائيا ولا تقبل التعديل أو الترحيل.",
  },
};

function cx(...values: Array<string | undefined | null | false>) {
  return values.filter(Boolean).join(" ");
}

export function FiscalPeriodsPage({
  years,
  periods,
  selectedYearId,
  selectedPeriodId,
  onSelectYear,
  onSelectPeriod,
  onCreateYear,
  onCreatePeriod,
  onEditPeriod,
  onLockPeriod,
  onFinalClosePeriod,
  children,
}: FiscalPeriodsPageProps) {
  const selectedYear = years.find((year) => year.id === selectedYearId) ?? years[0];
  const yearPeriods = periods.filter((period) => period.fiscalYearId === selectedYear?.id);
  const selectedPeriod =
    yearPeriods.find((period) => period.id === selectedPeriodId) ?? yearPeriods[0];
  const openPeriods = yearPeriods.filter((period) => period.status === "open").length;
  const lockedPeriods = yearPeriods.filter((period) => period.status === "locked").length;
  const finalClosedPeriods = yearPeriods.filter((period) => period.status === "final-closed").length;

  return (
    <section dir="rtl" className="space-y-5">
      <div className="qbs-surface overflow-hidden">
        <div className="grid gap-5 p-5 lg:grid-cols-[1fr_auto] lg:p-6">
          <div className="space-y-3">
            <StatusBadge label="إدارة الترحيل المالي" variant="info" />
            <div className="space-y-2">
              <Text as="h1" variant="display-2xl">
                السنوات والفترات المالية
              </Text>
              <Text as="p" variant="body-sm" tone="muted" className="max-w-3xl leading-7">
                إدارة السنوات والفترات التي تحدد هل يسمح النظام بترحيل القيود والمستندات
                أم يمنعها عند القفل أو الإقفال النهائي.
              </Text>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" startIcon={<Plus size={15} />} onClick={onCreateYear}>
              إنشاء سنة
            </Button>
            <Button startIcon={<Plus size={15} />} onClick={onCreatePeriod}>
              إنشاء فترة
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[280px_1fr_340px]">
        <aside className="qbs-surface overflow-hidden">
          <div className="border-b border-border px-4 py-3">
            <Text as="h2" variant="title-lg">
              السنوات المالية
            </Text>
          </div>
          <div className="divide-y divide-border">
            {years.map((year) => {
              const selected = year.id === selectedYear?.id;
              return (
                <button
                  key={year.id}
                  type="button"
                  className={cx(
                    "qbs-focus block w-full px-4 py-3 text-right transition-colors",
                    selected ? "bg-primary/10" : "hover:bg-muted"
                  )}
                  onClick={() => onSelectYear(year.id)}
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="font-semibold text-foreground">{year.label}</span>
                    {year.active ? <StatusBadge label="نشطة" variant="success" size="sm" /> : null}
                  </span>
                  <span className="mt-1 block text-xs text-muted-foreground amount">
                    {year.startDate} - {year.endDate}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        <div className="qbs-surface overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
            <div>
              <Text as="h2" variant="title-lg">
                فترات {selectedYear?.label}
              </Text>
              <Text as="p" variant="body-sm" tone="muted" className="mt-1">
                اختر فترة لعرض حالتها والتحكم في السماح أو منع الترحيل.
              </Text>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusBadge label={`${openPeriods} مفتوحة`} variant="success" size="sm" />
              <StatusBadge label={`${lockedPeriods} مقفولة`} variant="warning" size="sm" />
              <StatusBadge label={`${finalClosedPeriods} نهائية`} variant="critical" size="sm" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-sm">
              <thead className="bg-secondary text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-right font-semibold">الفترة</th>
                  <th className="px-4 py-3 text-right font-semibold">البداية</th>
                  <th className="px-4 py-3 text-right font-semibold">النهاية</th>
                  <th className="px-4 py-3 text-right font-semibold">الحالة</th>
                  <th className="px-4 py-3 text-right font-semibold">القيود</th>
                  <th className="px-4 py-3 text-right font-semibold">إجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {yearPeriods.map((period) => {
                  const meta = STATUS_META[period.status];
                  const selected = period.id === selectedPeriod?.id;
                  return (
                    <tr key={period.id} className={selected ? "bg-primary/5" : undefined}>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          className="qbs-focus rounded-lg text-right font-semibold text-foreground hover:text-primary"
                          onClick={() => onSelectPeriod(period.id)}
                        >
                          {period.label}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground amount">{period.startDate}</td>
                      <td className="px-4 py-3 text-muted-foreground amount">{period.endDate}</td>
                      <td className="px-4 py-3">
                        <StatusBadge label={meta.label} variant={meta.variant} size="sm" />
                      </td>
                      <td className="px-4 py-3 text-muted-foreground amount">
                        {period.entriesCount ?? 0}
                      </td>
                      <td className="px-4 py-3">
                        <Button size="sm" variant="ghost" onClick={() => onSelectPeriod(period.id)}>
                          عرض
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="space-y-4">
          {selectedPeriod ? (
            <div className="qbs-surface p-4">
              {(() => {
                const meta = STATUS_META[selectedPeriod.status];
                const StatusIcon = meta.icon;
                return (
                  <>
                    <div className="flex items-start gap-3">
                      <div className="qbs-icon-well h-11 w-11 bg-primary/10 text-primary">
                        <CalendarDays size={20} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <Text as="h3" variant="title-lg">
                          {selectedPeriod.label}
                        </Text>
                        <div className="mt-2">
                          <StatusBadge label={meta.label} variant={meta.variant} />
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 rounded-lg border border-border bg-secondary p-4">
                      <div className="flex items-start gap-2">
                        <StatusIcon size={17} className="mt-0.5 text-primary" />
                        <Text as="p" variant="body-sm" tone="muted" className="leading-6">
                          {meta.description}
                        </Text>
                      </div>
                    </div>

                    <dl className="mt-4 space-y-2 text-sm">
                      <div className="flex items-center justify-between gap-3">
                        <dt className="text-muted-foreground">تاريخ البداية</dt>
                        <dd className="font-semibold text-foreground amount">{selectedPeriod.startDate}</dd>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <dt className="text-muted-foreground">تاريخ النهاية</dt>
                        <dd className="font-semibold text-foreground amount">{selectedPeriod.endDate}</dd>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <dt className="text-muted-foreground">عدد القيود</dt>
                        <dd className="font-semibold text-foreground amount">
                          {selectedPeriod.entriesCount ?? 0}
                        </dd>
                      </div>
                    </dl>

                    <div className="mt-5 grid gap-2">
                      <Button
                        variant="outline"
                        startIcon={<Edit3 size={15} />}
                        onClick={() => onEditPeriod?.(selectedPeriod)}
                      >
                        تعديل الفترة
                      </Button>
                      <Button
                        variant="warning"
                        startIcon={<Lock size={15} />}
                        disabled={selectedPeriod.status !== "open"}
                        onClick={() => onLockPeriod?.(selectedPeriod)}
                      >
                        قفل الفترة
                      </Button>
                      <Button
                        variant="danger"
                        startIcon={<ShieldAlert size={15} />}
                        disabled={selectedPeriod.status === "final-closed"}
                        onClick={() => onFinalClosePeriod?.(selectedPeriod)}
                      >
                        إقفال نهائي
                      </Button>
                    </div>
                  </>
                );
              })()}
            </div>
          ) : null}

          {children}
        </aside>
      </div>
    </section>
  );
}
