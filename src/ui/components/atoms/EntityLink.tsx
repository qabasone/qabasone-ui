import { useState } from "react";
import { ExternalLink, ArrowUpLeft } from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface EntityLinkProps {
  /** The display text */
  label: string;
  /**
   * Visual style:
   * - "default"  — plain text, primary color + underline on hover (for names, titles)
   * - "id"       — monospace, styled like a code token (for IDs, reference numbers)
   * - "badge"    — pill badge that activates on hover (for tags, categories)
   */
  variant?: "default" | "id" | "badge";
  /**
   * Navigate via URL. Renders an <a> tag.
   * If combined with onClick, onClick fires first then navigation happens.
   */
  href?: string;
  /** Open href in a new tab. Default: false */
  external?: boolean;
  /**
   * Navigate via callback (SPA routing, modal open, etc.).
   * Renders a <button> tag when no href is provided.
   */
  onClick?: () => void;
  /** Extra class names forwarded to the root element */
  className?: string;
}

// ── Component ──────────────────────────────────────────────────────────────────

/**
 * EntityLink — a table cell value that doubles as a navigation affordance.
 *
 * Use it for any field that represents a navigable entity (invoice ID, customer
 * name, product, account, etc.). The link indicator appears only on hover so
 * dense tables stay readable.
 *
 * @example
 * // ID column — SPA navigation
 * <EntityLink variant="id" label="INV-2024-0130" onClick={() => openInvoice(id)} />
 *
 * // Name column — opens detail page
 * <EntityLink label="شركة النور" href="/customers/1" />
 *
 * // External link — opens in new tab
 * <EntityLink label="تقرير المبيعات" href="/reports/42" external />
 *
 * // Badge style — for categories / tags
 * <EntityLink variant="badge" label="حبوب ومحاصيل" onClick={() => filterByCategory()} />
 */
export function EntityLink({
  label,
  variant = "default",
  href,
  external = false,
  onClick,
  className = "",
}: EntityLinkProps) {
  const [hovered, setHovered] = useState(false);

  const Icon = external ? ExternalLink : ArrowUpLeft;
  const isInteractive = !!(href || onClick);

  // ── Shared interaction handlers ──────────────────────────────────────────────
  const handlers = isInteractive
    ? {
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => setHovered(false),
      onFocus: () => setHovered(true),
      onBlur: () => setHovered(false),
    }
    : {};

  // ── Variant styles ───────────────────────────────────────────────────────────

  if (variant === "id") {
    const content = (
      <span
        className={`inline-flex items-center gap-1 font-mono text-sm amount group ${className}`}
        style={{
          color: hovered ? "var(--primary)" : "var(--primary)",
          opacity: hovered ? 1 : 0.85,
          cursor: isInteractive ? "pointer" : "default",
          transition: "opacity 0.15s",
        }}
        {...handlers}
      >
        <span
          style={{
            textDecoration: hovered ? "underline" : "none",
            textUnderlineOffset: "3px",
            textDecorationColor: "var(--primary)",
            transition: "text-decoration 0.1s",
          }}
        >
          {label}
        </span>
        {isInteractive && (
          <Icon
            size={11}
            style={{
              opacity: hovered ? 1 : 0,
              transform: hovered ? "scale(1)" : "scale(0.7)",
              transition: "opacity 0.15s, transform 0.15s",
              flexShrink: 0,
            }}
          />
        )}
      </span>
    );

    if (href) {
      return (
        <a
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          onClick={onClick}
          style={{ textDecoration: "none" }}
          {...handlers}
        >
          {content}
        </a>
      );
    }
    if (onClick) {
      return <button onClick={onClick} style={{ background: "none", border: "none", padding: 0 }}>{content}</button>;
    }
    return content;
  }

  if (variant === "badge") {
    const badgeContent = (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs transition-all ${className}`}
        style={{
          backgroundColor: hovered ? "var(--accent)" : "var(--muted)",
          color: hovered ? "var(--primary)" : "var(--muted-foreground)",
          fontWeight: 500,
          cursor: isInteractive ? "pointer" : "default",
        }}
        {...handlers}
      >
        {label}
        {isInteractive && (
          <Icon
            size={10}
            style={{
              opacity: hovered ? 1 : 0,
              transition: "opacity 0.15s",
              flexShrink: 0,
            }}
          />
        )}
      </span>
    );

    if (href) {
      return (
        <a href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} onClick={onClick} style={{ textDecoration: "none" }} {...handlers}>
          {badgeContent}
        </a>
      );
    }
    if (onClick) {
      return <button onClick={onClick} style={{ background: "none", border: "none", padding: 0 }}>{badgeContent}</button>;
    }
    return badgeContent;
  }

  // ── Default variant ──────────────────────────────────────────────────────────
  const defaultContent = (
    <span
      className={`inline-flex items-center gap-1 text-sm ${className}`}
      style={{
        color: hovered ? "var(--primary)" : "var(--foreground)",
        cursor: isInteractive ? "pointer" : "default",
        transition: "color 0.15s",
      }}
      {...handlers}
    >
      <span
        style={{
          textDecoration: hovered ? "underline" : "none",
          textUnderlineOffset: "3px",
          textDecorationColor: "color-mix(in srgb, var(--primary) 50%, transparent)",
          transition: "text-decoration 0.1s",
        }}
      >
        {label}
      </span>
      {isInteractive && (
        <Icon
          size={12}
          style={{
            opacity: hovered ? 0.7 : 0,
            transform: hovered ? "scale(1)" : "scale(0.6)",
            transition: "opacity 0.15s, transform 0.15s",
            flexShrink: 0,
            color: "var(--primary)",
          }}
        />
      )}
    </span>
  );

  if (href) {
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        onClick={onClick}
        style={{ textDecoration: "none" }}
        {...handlers}
      >
        {defaultContent}
      </a>
    );
  }
  if (onClick) {
    return (
      <button onClick={onClick} style={{ background: "none", border: "none", padding: 0 }}>
        {defaultContent}
      </button>
    );
  }
  return defaultContent;
}
