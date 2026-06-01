import { ChevronDown } from "lucide-react";
import { Button, type ButtonProps } from "../atoms/Button";

export interface SplitButtonProps {
  primary: Omit<ButtonProps, "className" | "endIcon" | "iconOnly">;
  onToggle?: () => void;
  toggleAriaLabel?: string;
  disabled?: boolean;
  className?: string;
}

export function SplitButton({
  primary,
  onToggle,
  toggleAriaLabel = "Open button menu",
  disabled = false,
  className,
}: SplitButtonProps) {
  return (
    <div className={className ?? "flex rounded-lg overflow-hidden border border-border"}>
      <Button {...primary} className="rounded-none border-0" disabled={disabled || primary.disabled} />
      <div className="w-px bg-border" />
      <Button
        variant={primary.variant}
        action={primary.action}
        size={primary.size}
        iconOnly
        aria-label={toggleAriaLabel}
        disabled={disabled}
        onClick={onToggle}
        className="rounded-none border-0 px-2"
        startIcon={<ChevronDown size={14} />}
      />
    </div>
  );
}
