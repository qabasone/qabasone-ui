import type { ReactNode } from "react";
import { Text } from "../atoms/Typography";
import { FormattedAmount } from "../atoms";

export interface RankedListItem {
    id: string;
    label: string;
    value: number;
    detail?: string;
    icon?: ReactNode;
}

export interface RankedListProps {
    title: string;
    items: RankedListItem[];
    currency?: string;
    emptyLabel?: string;
    onItemClick?: (itemId: string) => void;
}

function cx(...values: Array<string | undefined | null | false>) {
    return values.filter(Boolean).join(" ");
}

export function RankedList({ title, items, currency, emptyLabel = "لا يوجد بيانات", onItemClick }: RankedListProps) {
    return (
        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <Text as="p" variant="body-sm" tone="muted">
                {title}
            </Text>
            {items.length === 0 ? (
                <Text as="p" variant="body-sm" tone="muted" className="mt-4">
                    {emptyLabel}
                </Text>
            ) : (
                <div className="mt-4 space-y-3">
                    {items.map((item, index) => (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => onItemClick?.(item.id)}
                            className={cx(
                                "w-full rounded-2xl border border-border px-4 py-4 text-right transition-colors hover:bg-muted",
                                onItemClick ? "cursor-pointer" : "cursor-default"
                            )}
                        >
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-primary/10 text-primary font-semibold">
                                        {index + 1}
                                    </div>
                                    <div className="text-right">
                                        <Text as="p" variant="body-lg" tone="default">
                                            {item.label}
                                        </Text>
                                        {item.detail ? (
                                            <Text as="p" variant="body-sm" tone="muted">
                                                {item.detail}
                                            </Text>
                                        ) : null}
                                    </div>
                                </div>
                                <FormattedAmount value={item.value} variant="body-lg" tone="default" format="auto" showTooltip={true} />
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
