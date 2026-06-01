import type { ElementType } from "react";
import { AlertTriangle, ArrowRight, Home } from "lucide-react";
import { Button, type ButtonVariant } from "../atoms/Button";
import { Text } from "../atoms/Typography";

export interface ErrorPageAction {
  label: string;
  onClick?: () => void;
  variant?: ButtonVariant;
  icon?: ElementType;
}

export interface ErrorPageProps {
  code: string;
  title: string;
  description: string;
  hint?: string;
  icon?: ElementType;
  primaryAction?: ErrorPageAction;
  secondaryAction?: ErrorPageAction;
  compact?: boolean;
}

export function ErrorPage({
  code,
  title,
  description,
  hint,
  icon: Icon = AlertTriangle,
  primaryAction,
  secondaryAction,
  compact = false,
}: ErrorPageProps) {
  return (
    <section
      dir="rtl"
      className="bg-card rounded-2xl border border-border"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div
        className={compact ? "px-6 py-8 text-center space-y-4" : "px-8 py-10 text-center space-y-5"}
      >
        {/* we don't need this for now */}
        {/* <div className="mx-auto w-fit px-3 py-1 rounded-full bg-muted border border-border">
          <Text variant="caption" className="amount" tone="muted">
            {code}
          </Text>
        </div> */}

        <div className="mx-auto w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
          <Icon size={28} className="text-muted-foreground" />
        </div>

        <div className="space-y-2">
          <Text as="h2" variant={compact ? "title-xl" : "display-2xl"}>
            {title}
          </Text>
          <Text as="p" variant="body" tone="muted" className="max-w-xl mx-auto">
            {description}
          </Text>
          {hint ? (
            <Text as="p" variant="body-sm" tone="muted" className="max-w-xl mx-auto">
              {hint}
            </Text>
          ) : null}
        </div>

        {(primaryAction || secondaryAction) && (
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            {primaryAction ? (
              <Button
                variant={primaryAction.variant ?? "primary"}
                startIcon={
                  primaryAction.icon ? <primaryAction.icon size={15} /> : <Home size={15} />
                }
                onClick={primaryAction.onClick}
              >
                {primaryAction.label}
              </Button>
            ) : null}

            {secondaryAction ? (
              <Button
                variant={secondaryAction.variant ?? "ghost"}
                startIcon={
                  secondaryAction.icon ? (
                    <secondaryAction.icon size={15} />
                  ) : (
                    <ArrowRight size={15} />
                  )
                }
                onClick={secondaryAction.onClick}
              >
                {secondaryAction.label}
              </Button>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}
