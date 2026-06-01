import type { ElementType } from "react";

export interface SidebarIconButtonProps {
  icon: ElementType;
  label: string;
  active?: boolean;
  badge?: number;
  onClick?: () => void;
}

export function SidebarIconButton({
  icon: Icon,
  label,
  active = false,
  badge,
  onClick,
}: SidebarIconButtonProps) {
  return (
    <button
      title={label}
      onClick={onClick}
      className="relative w-10 h-10 rounded-xl flex items-center justify-center transition-all group"
      style={{
        backgroundColor: active ? "var(--primary-muted)" : "transparent",
        color: active ? "var(--primary)" : "var(--muted-foreground)",
      }}
      onMouseEnter={(e) => {
        if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = "var(--muted)";
      }}
      onMouseLeave={(e) => {
        if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
      }}
    >
      <Icon size={17} />
      {badge ? (
        <span
          className="absolute top-1 end-1 w-[14px] h-[14px] rounded-full text-white flex items-center justify-center"
          style={{ backgroundColor: "var(--destructive)", fontSize: "9px", fontWeight: 700 }}
        >
          {badge > 9 ? "9+" : badge}
        </span>
      ) : null}
    </button>
  );
}
