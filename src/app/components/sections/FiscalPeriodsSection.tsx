import { useMemo, useState } from "react";
import { Lock, ShieldAlert } from "lucide-react";
import {
  ConfirmModal,
  FiscalPeriodsPage,
  type FiscalPeriod,
  type FiscalYear,
} from "@/ui/components";

const fiscalYears: FiscalYear[] = [
  { id: "fy-2024", label: "2024", startDate: "01/01/2024", endDate: "31/12/2024" },
  { id: "fy-2025", label: "2025", startDate: "01/01/2025", endDate: "31/12/2025" },
  { id: "fy-2026", label: "2026", startDate: "01/01/2026", endDate: "31/12/2026", active: true },
];

const initialPeriods: FiscalPeriod[] = [
  { id: "p-2026-01", fiscalYearId: "fy-2026", label: "يناير 2026", startDate: "01/01/2026", endDate: "31/01/2026", status: "open", entriesCount: 128 },
  { id: "p-2026-02", fiscalYearId: "fy-2026", label: "فبراير 2026", startDate: "01/02/2026", endDate: "28/02/2026", status: "open", entriesCount: 84 },
  { id: "p-2026-03", fiscalYearId: "fy-2026", label: "مارس 2026", startDate: "01/03/2026", endDate: "31/03/2026", status: "locked", entriesCount: 97 },
  { id: "p-2026-04", fiscalYearId: "fy-2026", label: "أبريل 2026", startDate: "01/04/2026", endDate: "30/04/2026", status: "open", entriesCount: 21 },
  { id: "p-2025-12", fiscalYearId: "fy-2025", label: "ديسمبر 2025", startDate: "01/12/2025", endDate: "31/12/2025", status: "final-closed", entriesCount: 204 },
  { id: "p-2025-11", fiscalYearId: "fy-2025", label: "نوفمبر 2025", startDate: "01/11/2025", endDate: "30/11/2025", status: "final-closed", entriesCount: 188 },
  { id: "p-2024-12", fiscalYearId: "fy-2024", label: "ديسمبر 2024", startDate: "01/12/2024", endDate: "31/12/2024", status: "final-closed", entriesCount: 176 },
];

export function FiscalPeriodsSection() {
  const [selectedYearId, setSelectedYearId] = useState("fy-2026");
  const [selectedPeriodId, setSelectedPeriodId] = useState("p-2026-01");
  const [periods, setPeriods] = useState(initialPeriods);
  const [lockTarget, setLockTarget] = useState<FiscalPeriod | null>(null);
  const [finalCloseTarget, setFinalCloseTarget] = useState<FiscalPeriod | null>(null);
  const [lastAction, setLastAction] = useState("يناير 2026 مفتوحة وتسمح بالترحيل.");

  const selectedPeriod = useMemo(
    () => periods.find((period) => period.id === selectedPeriodId),
    [periods, selectedPeriodId]
  );

  function selectYear(yearId: string) {
    setSelectedYearId(yearId);
    const firstPeriod = periods.find((period) => period.fiscalYearId === yearId);
    if (firstPeriod) setSelectedPeriodId(firstPeriod.id);
  }

  function lockPeriod(period: FiscalPeriod) {
    setPeriods((current) =>
      current.map((item) => (item.id === period.id ? { ...item, status: "locked" } : item))
    );
    setSelectedPeriodId(period.id);
    setLastAction(`تم قفل ${period.label}. أي قيد داخل هذه الفترة لن يتم ترحيله.`);
    setLockTarget(null);
  }

  function finalClosePeriod(period: FiscalPeriod) {
    setPeriods((current) =>
      current.map((item) => (item.id === period.id ? { ...item, status: "final-closed" } : item))
    );
    setSelectedPeriodId(period.id);
    setLastAction(`تم الإقفال النهائي لفترة ${period.label}.`);
    setFinalCloseTarget(null);
  }

  return (
    <>
      <FiscalPeriodsPage
        years={fiscalYears}
        periods={periods}
        selectedYearId={selectedYearId}
        selectedPeriodId={selectedPeriodId}
        onSelectYear={selectYear}
        onSelectPeriod={setSelectedPeriodId}
        onCreateYear={() => setLastAction("فتح نموذج إنشاء سنة مالية جديدة.")}
        onCreatePeriod={() => setLastAction("فتح نموذج إنشاء فترة مالية داخل السنة المختارة.")}
        onEditPeriod={(period) => setLastAction(`فتح تعديل ${period.label}.`)}
        onLockPeriod={setLockTarget}
        onFinalClosePeriod={setFinalCloseTarget}
      >
        <div className="qbs-surface p-4">
          <div className="flex items-start gap-3">
            <div className="qbs-icon-well h-10 w-10 bg-primary/10 text-primary">
              <Lock size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">أثر القفل على الترحيل</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">{lastAction}</p>
              {selectedPeriod?.status === "locked" ? (
                <p className="mt-2 rounded-lg border border-warning/20 bg-warning/10 p-2 text-xs font-semibold text-warning">
                  مثال: قيد بتاريخ {selectedPeriod.startDate} لن يترحل لأن الفترة مقفولة.
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </FiscalPeriodsPage>

      <ConfirmModal
        open={!!lockTarget}
        variant="warning"
        icon={Lock}
        title="قفل الفترة المالية؟"
        description={
          lockTarget
            ? `بعد قفل ${lockTarget.label} لن يتم ترحيل أي قيد أو مستند داخل تاريخ هذه الفترة.`
            : undefined
        }
        confirmLabel="قفل الفترة"
        cancelLabel="رجوع"
        onConfirm={() => lockTarget && lockPeriod(lockTarget)}
        onCancel={() => setLockTarget(null)}
      />

      <ConfirmModal
        open={!!finalCloseTarget}
        variant="danger"
        icon={ShieldAlert}
        title="إقفال نهائي للفترة؟"
        description={
          finalCloseTarget
            ? `الإقفال النهائي لفترة ${finalCloseTarget.label} يمنع التعديل والترحيل بشكل دائم.`
            : undefined
        }
        confirmLabel="إقفال نهائي"
        cancelLabel="رجوع"
        onConfirm={() => finalCloseTarget && finalClosePeriod(finalCloseTarget)}
        onCancel={() => setFinalCloseTarget(null)}
      />
    </>
  );
}
