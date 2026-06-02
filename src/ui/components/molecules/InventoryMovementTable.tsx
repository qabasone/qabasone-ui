import type { HTMLAttributes } from "react";
import { Text, AmountText } from "../atoms/Typography";

export interface InventoryMovementRow {
    id: string;
    date: string;
    document: string;
    type: string;
    quantity: number;
    unit: string;
    balance: number;
    onClick?: () => void;
}

export interface InventoryMovementTableProps extends HTMLAttributes<HTMLDivElement> {
    rows: InventoryMovementRow[];
    currency?: string;
    emptyLabel?: string;
}

export function InventoryMovementTable({ rows, currency, emptyLabel = "لا يوجد حركات", className, ...props }: InventoryMovementTableProps) {
    return (
        <div className={className} {...props}>
            <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
                <table className="min-w-full text-right text-sm">
                    <thead className="bg-muted text-muted-foreground">
                        <tr>
                            <th className="px-4 py-3 text-left">التاريخ</th>
                            <th className="px-4 py-3">المستند</th>
                            <th className="px-4 py-3">النوع</th>
                            <th className="px-4 py-3">الكمية</th>
                            <th className="px-4 py-3">الرصيد</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                                    {emptyLabel}
                                </td>
                            </tr>
                        ) : (
                            rows.map((row) => (
                                <tr
                                    key={row.id}
                                    className={row.onClick ? "cursor-pointer hover:bg-muted/50" : ""}
                                    onClick={row.onClick}
                                >
                                    <td className="px-4 py-3">{row.date}</td>
                                    <td className="px-4 py-3">{row.document}</td>
                                    <td className="px-4 py-3">{row.type}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-col items-end">
                                            <AmountText value={row.quantity} currency={row.unit} variant="body-sm" />
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-col items-end">
                                            <AmountText value={row.balance} currency={currency} variant="body-sm" />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
