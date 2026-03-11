import { useEffect, useMemo, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import type { Tag } from "../../types/tag";
import "../../styles/TagDropdown.css";

/* ── public API ── */
export interface TagDropdownProps {
  /** All available tags from the store */
  tags: Tag[];
  /** Currently selected tag names */
  selectedTagNames: string[];
  /** Callback when a tag is toggled on/off */
  onToggle: (tagName: string) => void;

  /** Custom (new) tag names the user has typed */
  customTags?: string[];
  /** Callback when a custom tag is added */
  onAddCustomTag?: (tagName: string) => void;
  /** Callback when a custom tag chip is removed */
  onRemoveCustomTag?: (tagName: string) => void;
  /** Whether the user is allowed to create custom tags */
  allowCustomTags?: boolean;

  /** Placeholder shown when nothing is selected */
  placeholder?: string;
}

export default function TagDropdown({
  tags,
  selectedTagNames,
  onToggle,
  customTags = [],
  onAddCustomTag,
  onRemoveCustomTag,
  allowCustomTags = false,
  placeholder = "Select tags…",
}: TagDropdownProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  /* ── close on outside click ── */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ── filtered list ── */
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return tags;
    return tags.filter((t) => t.name.toLowerCase().includes(q));
  }, [tags, search]);

  /* ── can we add a brand-new tag? ── */
  const canAdd = useMemo(() => {
    if (!allowCustomTags) return false;
    const q = search.trim().toLowerCase();
    if (!q) return false;
    const inStore = tags.some((t) => t.name.toLowerCase() === q);
    const inCustom = customTags.some((n) => n.toLowerCase() === q);
    const inSelected = selectedTagNames.some((n) => n.toLowerCase() === q);
    return !inStore && !inCustom && !inSelected;
  }, [allowCustomTags, tags, customTags, selectedTagNames, search]);

  const handleAdd = () => {
    const name = search.trim();
    if (!name || !canAdd || !onAddCustomTag) return;
    onAddCustomTag(name);
    setSearch("");
  };

  const hasSelection = selectedTagNames.length > 0 || customTags.length > 0;

  return (
    <div className="tag-select-wrapper" ref={wrapperRef}>
      {/* ── selected chips bar ── */}
      <div className="tags-selected" onClick={() => setOpen((o) => !o)}>
        {!hasSelection ? (
          <span className="tags-placeholder">{placeholder}</span>
        ) : (
          <>
            {selectedTagNames.map((name) => (
              <span key={name} className="tag-chip">
                {name}
                <button
                  type="button"
                  className="tag-remove-btn"
                  onClick={(e) => { e.stopPropagation(); onToggle(name); }}
                >
                  ×
                </button>
              </span>
            ))}
            {customTags.map((name) => (
              <span key={`custom-${name}`} className="tag-chip tag-chip-custom">
                {name}
                <button
                  type="button"
                  className="tag-remove-btn"
                  onClick={(e) => { e.stopPropagation(); onRemoveCustomTag?.(name); }}
                >
                  ×
                </button>
              </span>
            ))}
          </>
        )}
      </div>

      {/* ── dropdown ── */}
      {open && (
        <div className="tag-dropdown">
          <div className="tag-dropdown-search">
            <input
              type="text"
              placeholder={allowCustomTags ? "Search or create tag\u2026" : "Search tags\u2026"}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              autoFocus
            />
          </div>

          <div className="tag-dropdown-items">
            {filtered.map((t) => {
              const checked = selectedTagNames.includes(t.name);
              return (
                <div
                  key={t.tagId}
                  className={`tag-dropdown-item${checked ? " selected" : ""}`}
                  onClick={() => onToggle(t.name)}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    readOnly
                    tabIndex={-1}
                  />
                  <span>{t.name}</span>
                </div>
              );
            })}

            {filtered.length === 0 && !canAdd && (
              <div className="tag-dropdown-empty">No tags found</div>
            )}

            {canAdd && (
              <div className="tag-create-option" onClick={handleAdd}>
                <FaPlus />
                Add &ldquo;{search.trim()}&rdquo;
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
