import { useMemo, useState } from "react";
import { ArrowLeft, BookOpen, Route } from "lucide-react";
import {
  ChartOfAccountsPage,
  type AccountNode,
} from "@/ui/components";

const accounts: AccountNode[] = [
  {
    id: "assets",
    code: "1",
    name: "الأصول",
    type: "asset",
    kind: "main",
    status: "active",
    system: true,
    description: "مجموعة الأصول الرئيسية في دليل الحسابات.",
  },
  {
    id: "current-assets",
    code: "11",
    name: "الأصول المتداولة",
    type: "asset",
    kind: "main",
    status: "active",
    parentId: "assets",
    system: true,
  },
  {
    id: "cash",
    code: "1101",
    name: "النقدية وما في حكمها",
    type: "asset",
    kind: "main",
    status: "active",
    parentId: "current-assets",
    system: true,
  },
  {
    id: "main-cashbox",
    code: "110101",
    name: "الخزنة الرئيسية",
    type: "asset",
    kind: "detail",
    status: "active",
    parentId: "cash",
    system: true,
    balanceLabel: "85,430 ج.م",
    ledgerEntriesCount: 426,
    description: "حساب نظامي تفصيلي مرتبط بالخزنة الرئيسية ويستخدم في سندات القبض والصرف اليومية.",
  },
  {
    id: "branch-cashbox",
    code: "110102",
    name: "خزنة فرع الجيزة",
    type: "asset",
    kind: "detail",
    status: "active",
    parentId: "cash",
    balanceLabel: "-4,250 ج.م",
    ledgerEntriesCount: 88,
  },
  {
    id: "bank",
    code: "1102",
    name: "البنوك",
    type: "asset",
    kind: "main",
    status: "active",
    parentId: "current-assets",
  },
  {
    id: "bank-ahly",
    code: "110201",
    name: "البنك الأهلي",
    type: "asset",
    kind: "detail",
    status: "active",
    parentId: "bank",
    balanceLabel: "240,000 ج.م",
    ledgerEntriesCount: 140,
  },
  {
    id: "inventory",
    code: "1150",
    name: "المخزون",
    type: "asset",
    kind: "main",
    status: "active",
    parentId: "current-assets",
    system: true,
  },
  {
    id: "inventory-main",
    code: "115001",
    name: "مخزون المخزن الرئيسي",
    type: "asset",
    kind: "detail",
    status: "active",
    parentId: "inventory",
    balanceLabel: "310,500 ج.م",
    ledgerEntriesCount: 231,
  },
  {
    id: "liabilities",
    code: "2",
    name: "الالتزامات",
    type: "liability",
    kind: "main",
    status: "active",
    system: true,
  },
  {
    id: "suppliers",
    code: "2101",
    name: "الموردون",
    type: "liability",
    kind: "main",
    status: "active",
    parentId: "liabilities",
  },
  {
    id: "supplier-local",
    code: "210101",
    name: "موردون محليون",
    type: "liability",
    kind: "detail",
    status: "active",
    parentId: "suppliers",
    balanceLabel: "64,000 ج.م",
    ledgerEntriesCount: 76,
  },
  {
    id: "equity",
    code: "3",
    name: "حقوق الملكية",
    type: "equity",
    kind: "main",
    status: "active",
    system: true,
  },
  {
    id: "capital",
    code: "3101",
    name: "رأس المال",
    type: "equity",
    kind: "detail",
    status: "active",
    parentId: "equity",
    balanceLabel: "500,000 ج.م",
    ledgerEntriesCount: 4,
  },
  {
    id: "revenue",
    code: "4",
    name: "الإيرادات",
    type: "revenue",
    kind: "main",
    status: "active",
    system: true,
  },
  {
    id: "sales",
    code: "4101",
    name: "مبيعات المنتجات",
    type: "revenue",
    kind: "detail",
    status: "active",
    parentId: "revenue",
    balanceLabel: "248,500 ج.م",
    ledgerEntriesCount: 192,
  },
  {
    id: "expenses",
    code: "5",
    name: "المصروفات",
    type: "expense",
    kind: "main",
    status: "active",
    system: true,
  },
  {
    id: "old-rent",
    code: "510101",
    name: "إيجار قديم متوقف",
    type: "expense",
    kind: "detail",
    status: "disabled",
    parentId: "expenses",
    balanceLabel: "0 ج.م",
    ledgerEntriesCount: 18,
    description: "حساب تفصيلي متوقف محفوظ للأثر التاريخي ولا يستخدم في قيود جديدة.",
  },
];

export function ChartOfAccountsSection() {
  const [selectedAccountId, setSelectedAccountId] = useState("main-cashbox");
  const [ledgerAccount, setLedgerAccount] = useState<AccountNode | null>(
    accounts.find((account) => account.id === "main-cashbox") ?? null
  );
  const [lastAction, setLastAction] = useState("تم البحث عن الخزنة الرئيسية وفتح تفاصيل الحساب.");

  const selectedAccount = useMemo(
    () => accounts.find((account) => account.id === selectedAccountId),
    [selectedAccountId]
  );

  function openLedger(account: AccountNode) {
    setLedgerAccount(account);
    setLastAction(`تم فتح دفتر الأستاذ للحساب ${account.code} - ${account.name}.`);
  }

  return (
    <ChartOfAccountsPage
      accounts={accounts}
      selectedAccountId={selectedAccountId}
      initialSearch="الخزنة الرئيسية"
      onSelectAccount={(accountId) => {
        setSelectedAccountId(accountId);
        const account = accounts.find((item) => item.id === accountId);
        if (account) setLastAction(`تم فتح تفاصيل ${account.name}.`);
      }}
      onAddAccount={(parent) =>
        setLastAction(parent ? `فتح إضافة حساب فرعي تحت ${parent.name}.` : "فتح إضافة حساب جديد.")
      }
      onEditAccount={(account) => setLastAction(`فتح تعديل الحساب ${account.code}.`)}
      onToggleAccountStatus={(account) =>
        setLastAction(
          account.status === "active"
            ? `طلب تعطيل الحساب ${account.code}.`
            : `طلب تفعيل الحساب ${account.code}.`
        )
      }
      onOpenLedger={openLedger}
    >
      <div className="qbs-surface p-4">
        <div className="flex items-start gap-3">
          <div className="qbs-icon-well h-10 w-10 bg-primary/10 text-primary">
            <Route size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">قصة الاستخدام الحالية</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              مدير النظام يبحث عن "الخزنة الرئيسية"، يفتح تفاصيل الحساب، يتأكد من الكود
              والنوع والحالة، ثم يفتح دفتر الأستاذ من نفس الشاشة.
            </p>
          </div>
        </div>
      </div>

      <div className="qbs-surface p-4">
        <div className="flex items-start gap-3">
          <div className="qbs-icon-well h-10 w-10 bg-success/10 text-success">
            <BookOpen size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">دفتر الأستاذ المفتوح</p>
            {ledgerAccount ? (
              <p className="mt-1 text-sm text-muted-foreground">
                {ledgerAccount.code} - {ledgerAccount.name}
              </p>
            ) : (
              <p className="mt-1 text-sm text-muted-foreground">لم يتم فتح دفتر أستاذ بعد.</p>
            )}
            <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
              <ArrowLeft size={12} />
              {lastAction}
            </p>
          </div>
        </div>
      </div>

      {selectedAccount?.id === "main-cashbox" ? (
        <div className="qbs-surface p-4">
          <p className="text-sm font-semibold text-foreground">نتيجة السيناريو</p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            الحساب المحدد هو حساب تفصيلي، نوعه أصول، حالته نشط، وهو حساب نظامي محمي
            لأنه مرتبط بتشغيل الخزنة الرئيسية.
          </p>
        </div>
      ) : null}
    </ChartOfAccountsPage>
  );
}
