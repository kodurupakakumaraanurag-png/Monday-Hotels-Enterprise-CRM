"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  UserCheck,
  Building2,
  Contact,
  Users,
  TrendingUp,
  ClipboardList,
  CalendarDays,
  ArrowRight,
  Sparkles,
  Command,
  CornerDownLeft,
  Clock,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  performGlobalSearch,
  SearchResultItem,
  SearchEntityCategory,
  GroupedSearchResults,
} from "@/lib/services/global-search-service";

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  // Debounce search query input (120ms)
  useEffect(() => {
    setIsSearching(true);
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
      setIsSearching(false);
    }, 120);
    return () => clearTimeout(handler);
  }, [query]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Execute global search
  const searchResults: GroupedSearchResults = useMemo(() => {
    return performGlobalSearch(debouncedQuery);
  }, [debouncedQuery]);

  // Flattened items list for keyboard navigation
  const flatResults = useMemo(() => {
    const list: SearchResultItem[] = [];
    Object.values(searchResults.grouped).forEach((items) => {
      list.push(...items);
    });
    return list;
  }, [searchResults]);

  // Keyboard Navigation Handler (ArrowUp, ArrowDown, Enter, Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < flatResults.length - 1 ? prev + 1 : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : flatResults.length - 1));
      } else if (e.key === "Enter" && flatResults[selectedIndex]) {
        e.preventDefault();
        handleNavigate(flatResults[selectedIndex].targetHref);
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, flatResults, selectedIndex]);

  const handleNavigate = (href: string) => {
    onClose();
    router.push(href);
  };

  if (!isOpen) return null;

  const getEntityIcon = (cat: SearchEntityCategory) => {
    switch (cat) {
      case "LEAD":
        return <UserCheck className="w-4 h-4 text-amber-400" />;
      case "COMPANY":
        return <Building2 className="w-4 h-4 text-emerald-400" />;
      case "CONTACT":
        return <Contact className="w-4 h-4 text-cyan-400" />;
      case "GUEST":
        return <Users className="w-4 h-4 text-purple-400" />;
      case "OPPORTUNITY":
        return <TrendingUp className="w-4 h-4 text-amber-400" />;
      case "ENQUIRY":
        return <ClipboardList className="w-4 h-4 text-blue-400" />;
      case "RESERVATION":
        return <CalendarDays className="w-4 h-4 text-emerald-400" />;
    }
  };

  let cumulativeIndex = 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 bg-[#18332B]/60 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-white border border-[#E5E2D9] rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden text-[#18332B] flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#E5E2D9] flex items-center space-x-3 bg-[#F7F4EC]">
          <Search className="w-5 h-5 text-[#285943] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search leads, corporate clients, guests, reservations, opps..."
            className="w-full bg-transparent text-sm text-[#18332B] placeholder:text-[#6B766F] focus:outline-none"
          />
          {isSearching ? (
            <Loader2 className="w-4 h-4 text-[#285943] animate-spin shrink-0" />
          ) : (
            query && (
              <button onClick={() => setQuery("")} className="text-[#6B766F] hover:text-[#18332B]">
                <X className="w-4 h-4" />
              </button>
            )
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 bg-[#DDE9E1] hover:bg-[#A8C3B2] text-[#173F32] rounded-lg text-xs font-mono font-bold"
          >
            ESC
          </button>
        </div>

        {/* Results Body Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 bg-white">
          {!query.trim() ? (
            <div className="py-8 text-center space-y-2">
              <Command className="w-8 h-8 text-[#6B766F] mx-auto" />
              <p className="text-xs text-[#6B766F] font-medium">
                Type keywords to search across all Monday Hotels Enterprise CRM records.
              </p>
              <div className="flex justify-center space-x-3 text-[11px] text-[#6B766F] pt-2">
                <span>⚡ Real-time index</span>
                <span>•</span>
                <span>Keyboard Navable</span>
                <span>•</span>
                <span>Sub-15ms response</span>
              </div>
            </div>
          ) : searchResults.totalCount === 0 ? (
            <div className="py-10 text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-[#C9A15B] mx-auto" />
              <div className="text-sm font-bold text-[#18332B]">No matching CRM records found</div>
              <p className="text-xs text-[#6B766F] max-w-sm mx-auto">
                No results for &quot;<strong className="text-[#18332B]">{query}</strong>&quot;. Try checking POC names, emails, company codes, or reservation numbers.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-[#6B766F] px-1 border-b border-[#E5E2D9] pb-2">
                <span>
                  Found <strong className="text-[#18332B]">{searchResults.totalCount}</strong> matching record{searchResults.totalCount > 1 ? "s" : ""}
                </span>
                <span className="text-[10px] text-[#6B766F] font-mono">
                  {searchResults.executionTimeMs} ms execution
                </span>
              </div>

              {(["LEAD", "COMPANY", "CONTACT", "GUEST", "OPPORTUNITY", "ENQUIRY", "RESERVATION"] as SearchEntityCategory[]).map(
                (cat) => {
                  const items = searchResults.grouped[cat];
                  if (!items || items.length === 0) return null;

                  return (
                    <div key={cat} className="space-y-2">
                      <div className="text-[10px] font-extrabold uppercase text-[#285943] tracking-wider flex items-center space-x-1.5 px-1">
                        {getEntityIcon(cat)}
                        <span>
                          {items[0].categoryLabel} ({items.length})
                        </span>
                      </div>

                      <div className="space-y-1">
                        {items.map((item) => {
                          const currentIndex = cumulativeIndex++;
                          const isSelected = currentIndex === selectedIndex;

                          return (
                            <div
                              key={item.id}
                              onClick={() => handleNavigate(item.targetHref)}
                              onMouseEnter={() => setSelectedIndex(currentIndex)}
                              className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                                isSelected
                                  ? "bg-[#DDE9E1] border-[#285943] text-[#173F32]"
                                  : "bg-white border-[#E5E2D9] hover:bg-[#F7F4EC]"
                              }`}
                            >
                              <div className="flex items-center space-x-3 min-w-0">
                                <div className="p-2 rounded-lg bg-[#F7F4EC] border border-[#E5E2D9] shrink-0">
                                  {getEntityIcon(item.category)}
                                </div>
                                <div className="min-w-0">
                                  <div className="text-xs font-bold truncate text-[#18332B] flex items-center space-x-2">
                                    <span>{item.title}</span>
                                    {item.badge && (
                                      <span
                                        className={`px-2 py-0.5 text-[9px] font-bold rounded ${
                                          item.badgeColor || "bg-[#F7F4EC] text-[#18332B] border border-[#E5E2D9]"
                                        }`}
                                      >
                                        {item.badge}
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[11px] text-[#6B766F] truncate mt-0.5">
                                    {item.subtitle}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center space-x-3 shrink-0 text-right">
                                {item.metadataText && (
                                  <span className="text-xs font-bold text-[#18332B] hidden sm:inline-block">
                                    {item.metadataText}
                                  </span>
                                )}
                                <ArrowRight
                                  className={`w-4 h-4 transition ${
                                    isSelected ? "text-[#285943] translate-x-1" : "text-[#6B766F]"
                                  }`}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </div>

        {/* Footer Navigation Hints */}
        <div className="p-3 bg-[#F7F4EC] border-t border-[#E5E2D9] flex items-center justify-between text-[11px] text-[#6B766F]">
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-[#E5E2D9] rounded font-mono text-[10px] text-[#18332B]">↑↓</kbd> Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-[#E5E2D9] rounded font-mono text-[10px] text-[#18332B]">↵</kbd> Select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-[#E5E2D9] rounded font-mono text-[10px] text-[#18332B]">ESC</kbd> Close
            </span>
          </div>
          <span className="font-semibold text-[#285943]">Monday Hotels Search Engine</span>
        </div>
      </div>
    </div>
  );
}
