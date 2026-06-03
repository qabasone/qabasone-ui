import type { ReactNode } from "react";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  Edit3,
  FileText,
  FolderTree,
  Landmark,
  LockKeyhole,
  Plus,
  Search,
  ToggleLeft,
  ToggleRight,
  Wallet,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "../atoms/Button";
import { StatusBadge } from "../atoms/StatusBadge";
import { Text } from "../atoms/Typography";

export type AccountNodeKind = "main" | "detail";
export type AccountStatus = "active" | "disabled";
export type AccountType = "asset" | "liability" | "equity" | "revenue" | "expense";

export interface AccountNode {
  id: string;
  code: string;
  name: string;
  type: AccountType;
  kind: AccountNodeKind;
  status: AccountStatus;
  system?: boolean;
  parentId?: string;
  balanceLabel?: string;
  ledgerEntriesCount?: number;
  description?: string;
}

export interface ChartOfAccountsPageProps {
  accounts: AccountNode[];
  selectedAccountId?: string;
  initialSearch?: string;
  onSelectAccount: (accountId: string) => void;
  onAddAccount?: (parentAccount?: AccountNode) => void;
  onEditAccount?: (account: AccountNode) => void;
  onToggleAccountStatus?: (account: AccountNode) => void;
  onOpenLedger?: (account: AccountNode) => void;
  children?: ReactNode;
}

const TYPE_LABELS: Record<AccountType, string> = {
  asset: "أصول",
  liability: "التزامات",
  equity: "حقوق ملكية",
  revenue: "إيرادات",
  expense: "مصروفات",
};

const TYPE_ICONS: Record<AccountType, React.ElementType> = {
  asset: Wallet,
  liability: Landmark,
  equity: FolderTree,
  revenue: BookOpen,
  expense: FileText,
};

function cx(...values: Array<string | undefined | null | false>) {
  return values.filter(Boolean).join(" ");
}

function accountMatches(account: AccountNode, search: string, type: string, status: string) {
  const normalizedSearch = search.trim().toLowerCase();
  const searchMatches =
    !normalizedSearch ||
    account.code.toLowerCase().includes(normalizedSearch) ||
    account.name.toLowerCase().includes(normalizedSearch);
  const typeMatches = type === "all" || account.type === type;
  const statusMatches =
    status === "all" ||
    (status === "system" ? account.system : account.status === status);

  return searchMatches && typeMatches && statusMatches;
}

function collectVisibleAccounts(accounts: AccountNode[], search: string, type: string, status: string) {
  const childrenByParent = new Map<string | undefined, AccountNode[]>();
  accounts.forEach((account) => {
    const list = childrenByParent.get(account.parentId) ?? [];
    list.push(account);
    childrenByParent.set(account.parentId, list);
  });

  const visible = new Set<string>();

  function visit(account: AccountNode): boolean {
    const children = childrenByParent.get(account.id) ?? [];
    const childMatches = children.map(visit).some(Boolean);
    const selfMatches = accountMatches(account, search, type, status);
    if (selfMatches || childMatches) {
      visible.add(account.id);
      let parentId = account.parentId;
      while (parentId) {
        visible.add(parentId);
        parentId = accounts.find((item) => item.id === parentId)?.parentId;
      }
      return true;
    }
    return false;
  }

  (childrenByParent.get(undefined) ?? []).forEach(visit);
  return { visible, childrenByParent };
}

export function ChartOfAccountsPage({
  accounts,
  selectedAccountId,
  initialSearch = "",
  onSelectAccount,
  onAddAccount,
  onEditAccount,
  onToggleAccountStatus,
  onOpenLedger,
  children,
}: ChartOfAccountsPageProps) {
  const [search, setSearch] = useState(initialSearch);
  const [typeFilter, setTypeFilter] = useState<AccountType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<AccountStatus | "system" | "all">("all");
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(accounts.filter((account) => account.kind === "main").map((account) => account.id))
  );

  const selectedAccount = accounts.find((account) => account.id === selectedAccountId) ?? accounts[0];
  const { visible, childrenByParent } = useMemo(
    () => collectVisibleAccounts(accounts, search, typeFilter, statusFilter),
    [accounts, search, statusFilter, typeFilter]
  );
  const visibleAccountsCount = accounts.filter((account) => visible.has(account.id)).length;
  const detailAccountsCount = accounts.filter((account) => account.kind === "detail").length;
  const activeAccountsCount = accounts.filter((account) => account.status === "active").length;
  const systemAccountsCount = accounts.filter((account) => account.system).length;

  function toggleExpanded(accountId: string) {
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(accountId)) next.delete(accountId);
      else next.add(accountId);
      return next;
    });
  }

  function renderAccount(account: AccountNode, level = 0): ReactNode {
    if (!visible.has(account.id)) return null;

    const children = childrenByParent.get(account.id) ?? [];
    const hasChildren = children.some((child) => visible.has(child.id));
    const open = expanded.has(account.id);
    const selected = account.id === selectedAccount?.id;
    const TypeIcon = TYPE_ICONS[account.type];

    return (
      <div key={account.id}>
        <div
          className={cx(
            "grid grid-cols-[1fr_auto] items-center gap-3 rounded-lg px-2 py-1.5 transition-colors",
            selected ? "bg-primary/10" : "hover:bg-muted"
          )}
          style={{ paddingInlineStart: `${8 + level * 18}px` }}
        >
          <button
            type="button"
            className="qbs-focus flex min-w-0 items-center gap-2 text-right"
            onClick={() => onSelectAccount(account.id)}
          >
            {hasChildren ? (
              <span
                role="button"
                tabIndex={-1}
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-card"
                onClick={(event) => {
                  event.stopPropagation();
                  toggleExpanded(account.id);
                }}
              >
                {open ? <ChevronDown size={14} /> : <ChevronLeft size={14} />}
              </span>
            ) : (
              <span className="h-6 w-6 shrink-0" />
            )}
            <span className="qbs-icon-well h-8 w-8 shrink-0 bg-primary/10 text-primary">
              <TypeIcon size={15} />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-foreground">{account.name}</span>
              <span className="block text-xs text-muted-foreground amount">{account.code}</span>
            </span>
          </button>

          <div className="flex items-center gap-1.5">
            {account.system ? <StatusBadge label="نظامي" variant="info" size="sm" /> : null}
            <StatusBadge
              label={account.kind === "main" ? "رئيسي" : "تفصيلي"}
              variant={account.kind === "main" ? "warning" : "normal"}
              size="sm"
            />
            <StatusBadge
              label={account.status === "active" ? "نشط" : "متوقف"}
              variant={account.status === "active" ? "success" : "critical"}
              size="sm"
            />
          </div>
        </div>

        {hasChildren && open ? children.map((child) => renderAccount(child, level + 1)) : null}
      </div>
    );
  }

  return (
    <section dir="rtl" className="space-y-5">
      <div className="qbs-surface overflow-hidden">
        <div className="grid gap-5 p-5 lg:grid-cols-[1fr_auto] lg:p-6">
          <div className="space-y-3">
            <StatusBadge label="إعدادات محاسبية أساسية" variant="info" />
            <div className="space-y-2">
              <Text as="h1" variant="display-2xl">
                دليل الحسابات
              </Text>
              <Text as="p" variant="body-sm" tone="muted" className="max-w-3xl leading-7">
                عرض وإدارة شجرة الحسابات مع البحث بالكود أو الاسم، فلترة حسب النوع
                والحالة، ثم فتح تفاصيل الحساب أو دفتر الأستاذ من نفس الشاشة.
              </Text>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button startIcon={<Plus size={15} />} onClick={() => onAddAccount?.()}>
              إضافة حساب
            </Button>
            {selectedAccount ? (
              <Button
                variant="outline"
                startIcon={<Plus size={15} />}
                onClick={() => onAddAccount?.(selectedAccount)}
              >
                إضافة فرعي
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="qbs-surface overflow-hidden">
          <div className="grid gap-3 border-b border-border p-4 lg:grid-cols-[1fr_180px_180px]">
            <div className="qbs-field flex h-10 items-center gap-2 px-3">
              <Search size={15} className="text-muted-foreground" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                placeholder="بحث بالكود أو الاسم..."
              />
            </div>
            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value as AccountType | "all")}
              className="qbs-field h-10 px-3 text-sm"
            >
              <option value="all">كل الأنواع</option>
              {Object.entries(TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as AccountStatus | "system" | "all")
              }
              className="qbs-field h-10 px-3 text-sm"
            >
              <option value="all">كل الحالات</option>
              <option value="active">نشط</option>
              <option value="disabled">متوقف</option>
              <option value="system">نظامي</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3 border-b border-border bg-secondary p-4 lg:grid-cols-4">
            {[
              { label: "ظاهر الآن", value: visibleAccountsCount },
              { label: "تفصيلي", value: detailAccountsCount },
              { label: "نشط", value: activeAccountsCount },
              { label: "نظامي", value: systemAccountsCount },
            ].map((item) => (
              <div key={item.label} className="rounded-lg bg-card p-3">
                <Text as="p" variant="caption" tone="muted">
                  {item.label}
                </Text>
                <Text as="p" variant="title-lg" className="mt-1 amount">
                  {item.value}
                </Text>
              </div>
            ))}
          </div>

          <div className="max-h-[620px] overflow-y-auto p-3 dropdown-scroll">
            {(childrenByParent.get(undefined) ?? []).map((account) => renderAccount(account))}
          </div>
        </div>

        <aside className="space-y-4">
          {selectedAccount ? (
            <div className="qbs-surface p-4">
              <div className="flex items-start gap-3">
                <div className="qbs-icon-well h-11 w-11 bg-primary/10 text-primary">
                  <BookOpen size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <Text as="h2" variant="title-lg">
                    {selectedAccount.name}
                  </Text>
                  <Text as="p" variant="body-sm" tone="muted" className="mt-1 amount">
                    {selectedAccount.code}
                  </Text>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <StatusBadge
                  label={TYPE_LABELS[selectedAccount.type]}
                  variant="info"
                />
                <StatusBadge
                  label={selectedAccount.kind === "main" ? "حساب رئيسي" : "حساب تفصيلي"}
                  variant={selectedAccount.kind === "main" ? "warning" : "normal"}
                />
                <StatusBadge
                  label={selectedAccount.status === "active" ? "حساب نشط" : "حساب متوقف"}
                  variant={selectedAccount.status === "active" ? "success" : "critical"}
                />
                {selectedAccount.system ? <StatusBadge label="حساب نظامي" variant="info" /> : null}
              </div>

              <dl className="mt-5 space-y-2 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-muted-foreground">الكود</dt>
                  <dd className="font-semibold text-foreground amount">{selectedAccount.code}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-muted-foreground">النوع</dt>
                  <dd className="font-semibold text-foreground">{TYPE_LABELS[selectedAccount.type]}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-muted-foreground">الحالة</dt>
                  <dd className="font-semibold text-foreground">
                    {selectedAccount.status === "active" ? "نشط" : "متوقف"}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-muted-foreground">الرصيد</dt>
                  <dd className="font-semibold text-foreground amount">
                    {selectedAccount.balanceLabel ?? "0 ج.م"}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-muted-foreground">حركات الأستاذ</dt>
                  <dd className="font-semibold text-foreground amount">
                    {selectedAccount.ledgerEntriesCount ?? 0}
                  </dd>
                </div>
              </dl>

              {selectedAccount.description ? (
                <div className="mt-4 rounded-lg border border-border bg-secondary p-3">
                  <Text as="p" variant="body-sm" tone="muted" className="leading-6">
                    {selectedAccount.description}
                  </Text>
                </div>
              ) : null}

              <div className="mt-5 grid gap-2">
                <Button
                  action="view"
                  endIcon={<ArrowLeft size={15} />}
                  onClick={() => onOpenLedger?.(selectedAccount)}
                >
                  فتح دفتر الأستاذ
                </Button>
                <Button
                  variant="outline"
                  startIcon={<Edit3 size={15} />}
                  onClick={() => onEditAccount?.(selectedAccount)}
                >
                  تعديل الحساب
                </Button>
                <Button
                  variant={selectedAccount.status === "active" ? "warning" : "success"}
                  startIcon={
                    selectedAccount.status === "active" ? (
                      <ToggleLeft size={15} />
                    ) : (
                      <ToggleRight size={15} />
                    )
                  }
                  disabled={selectedAccount.system}
                  onClick={() => onToggleAccountStatus?.(selectedAccount)}
                >
                  {selectedAccount.status === "active" ? "تعطيل الحساب" : "تفعيل الحساب"}
                </Button>
              </div>
            </div>
          ) : null}

          <div className="qbs-surface p-4">
            <div className="flex items-start gap-3">
              <div className="qbs-icon-well h-10 w-10 bg-success/10 text-success">
                <CheckCircle2 size={18} />
              </div>
              <div>
                <Text as="h3" variant="title-lg">
                  استخدام الشاشة
                </Text>
                <Text as="p" variant="body-sm" tone="muted" className="mt-2 leading-6">
                  يستخدمها مدير النظام لبناء دليل الحسابات، مراجعة الحسابات النظامية،
                  إيقاف الحسابات غير المستخدمة، وفتح دفتر الأستاذ للحساب المحدد بدون
                  الخروج من نفس السياق.
                </Text>
              </div>
            </div>
          </div>

          <div className="qbs-surface p-4">
            <div className="flex items-start gap-3">
              <div className="qbs-icon-well h-10 w-10 bg-warning/10 text-warning">
                <LockKeyhole size={18} />
              </div>
              <div>
                <Text as="h3" variant="title-lg">
                  حالات الحسابات
                </Text>
                <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                  <li>حساب رئيسي: للتجميع ولا يستخدم غالبا في القيود.</li>
                  <li>حساب تفصيلي: يقبل الحركات ويفتح له دفتر أستاذ.</li>
                  <li>حساب نشط: يظهر في القيود والفواتير.</li>
                  <li>حساب متوقف: محفوظ تاريخيا ولا يستخدم في ترحيل جديد.</li>
                  <li>حساب نظامي: محمي لأنه مطلوب لتشغيل النظام.</li>
                </ul>
              </div>
            </div>
          </div>

          {children}
        </aside>
      </div>
    </section>
  );
}
