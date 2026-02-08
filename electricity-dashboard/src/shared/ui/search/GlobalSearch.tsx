import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Region {
  id: string;
  name: string;
  nameFA: string;
  code: string;
}

interface Outage {
  id: string;
  title: string;
  regionName: string;
  city: string;
  status: string;
}

interface GlobalSearchProps {
  regions: Region[];
  outages: Outage[];
}

/* ------------------------------------------------------------------ */
/*  Result item used internally                                        */
/* ------------------------------------------------------------------ */

interface SearchResult {
  id: string;
  category: "regions" | "outages";
  label: string;
  subtitle: string;
  path: string;
}

/* ------------------------------------------------------------------ */
/*  Icons (inline SVG)                                                 */
/* ------------------------------------------------------------------ */

const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-400 dark:text-gray-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
    />
  </svg>
);

const MapPinIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 shrink-0 text-blue-500 dark:text-blue-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 21c-1.5-1.5-6-6.2-6-10a6 6 0 1112 0c0 3.8-4.5 8.5-6 10z"
    />
    <circle cx="12" cy="11" r="2" />
  </svg>
);

const LightningBoltIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 shrink-0 text-amber-500 dark:text-amber-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const MAX_PER_CATEGORY = 5;
const DEBOUNCE_MS = 200;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export const GlobalSearch = ({ regions, outages }: GlobalSearchProps) => {
  const { t } = useTranslation("common");
  const navigate = useNavigate();

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  /* ---- Debounce -------------------------------------------------- */

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query]);

  /* ---- Fuzzy search ---------------------------------------------- */

  const results = useMemo<SearchResult[]>(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (q.length === 0) return [];

    const matchedRegions: SearchResult[] = regions
      .filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.nameFA.toLowerCase().includes(q) ||
          r.code.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q),
      )
      .slice(0, MAX_PER_CATEGORY)
      .map((r) => ({
        id: r.id,
        category: "regions" as const,
        label: r.name,
        subtitle: r.code,
        path: `/regions/${r.id}`,
      }));

    const matchedOutages: SearchResult[] = outages
      .filter(
        (o) =>
          o.title.toLowerCase().includes(q) ||
          o.regionName.toLowerCase().includes(q) ||
          o.city.toLowerCase().includes(q) ||
          o.status.toLowerCase().includes(q) ||
          o.id.toLowerCase().includes(q),
      )
      .slice(0, MAX_PER_CATEGORY)
      .map((o) => ({
        id: o.id,
        category: "outages" as const,
        label: o.title,
        subtitle: `${o.city} \u00B7 ${o.status}`,
        path: `/outages/${o.id}`,
      }));

    return [...matchedRegions, ...matchedOutages];
  }, [debouncedQuery, regions, outages]);

  /* ---- Grouped results for rendering ----------------------------- */

  const groupedRegions = useMemo(
    () => results.filter((r) => r.category === "regions"),
    [results],
  );
  const groupedOutages = useMemo(
    () => results.filter((r) => r.category === "outages"),
    [results],
  );

  /* ---- Flat list for keyboard nav -------------------------------- */

  const flatResults = useMemo(
    () => [...groupedRegions, ...groupedOutages],
    [groupedRegions, groupedOutages],
  );

  /* ---- Open / close ---------------------------------------------- */

  useEffect(() => {
    if (debouncedQuery.trim().length > 0 && flatResults.length > 0) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
    setActiveIndex(-1);
  }, [debouncedQuery, flatResults.length]);

  /* ---- Click outside --------------------------------------------- */

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---- Navigation helper ----------------------------------------- */

  const navigateTo = useCallback(
    (path: string) => {
      setIsOpen(false);
      setQuery("");
      setDebouncedQuery("");
      navigate(path);
    },
    [navigate],
  );

  /* ---- Keyboard handling ----------------------------------------- */

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isOpen) return;

      switch (e.key) {
        case "ArrowDown": {
          e.preventDefault();
          setActiveIndex((prev) => (prev < flatResults.length - 1 ? prev + 1 : 0));
          break;
        }
        case "ArrowUp": {
          e.preventDefault();
          setActiveIndex((prev) => (prev > 0 ? prev - 1 : flatResults.length - 1));
          break;
        }
        case "Enter": {
          e.preventDefault();
          if (activeIndex >= 0 && activeIndex < flatResults.length) {
            navigateTo(flatResults[activeIndex].path);
          }
          break;
        }
        case "Escape": {
          e.preventDefault();
          setIsOpen(false);
          inputRef.current?.blur();
          break;
        }
      }
    },
    [isOpen, activeIndex, flatResults, navigateTo],
  );

  /* ---- Render helpers -------------------------------------------- */

  const renderItem = (item: SearchResult, globalIndex: number) => {
    const isActive = globalIndex === activeIndex;
    return (
      <button
        key={`${item.category}-${item.id}`}
        type="button"
        className={`flex w-full items-center gap-3 px-4 py-2 text-left transition-colors ${
          isActive
            ? "bg-blue-50 dark:bg-blue-900/30"
            : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
        }`}
        onMouseEnter={() => setActiveIndex(globalIndex)}
        onClick={() => navigateTo(item.path)}
      >
        {item.category === "regions" ? <MapPinIcon /> : <LightningBoltIcon />}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
            {item.label}
          </p>
          <p className="truncate text-xs text-gray-500 dark:text-gray-400">{item.subtitle}</p>
        </div>
      </button>
    );
  };

  const renderGroup = (
    label: string,
    items: SearchResult[],
    startIndex: number,
  ) => {
    if (items.length === 0) return null;
    return (
      <div key={label}>
        <div className="px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
          {label}
        </div>
        {items.map((item, i) => renderItem(item, startIndex + i))}
      </div>
    );
  };

  /* ---- Main render ----------------------------------------------- */

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      {/* Input */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <SearchIcon />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (flatResults.length > 0 && debouncedQuery.trim().length > 0) {
              setIsOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder={t("searchPlaceholder", "Search regions, outages, cities...")}
          className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-blue-400 dark:focus:ring-blue-400"
          aria-label={t("searchPlaceholder", "Search regions, outages, cities...")}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          role="combobox"
          aria-autocomplete="list"
        />
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && flatResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-1 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
            role="listbox"
          >
            <div className="max-h-80 overflow-y-auto py-1">
              {renderGroup(t("regions", "Regions"), groupedRegions, 0)}
              {renderGroup(
                t("outages", "Outages"),
                groupedOutages,
                groupedRegions.length,
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GlobalSearch;
