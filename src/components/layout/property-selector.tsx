"use client";

import React, { useState } from "react";
import { Hotel, ChevronDown, Check, Building } from "lucide-react";

export interface PropertyOption {
  id: string;
  name: string;
  location: string;
  roomsCount: number;
}

export const MOCK_PROPERTIES: PropertyOption[] = [
  { id: "all", name: "All Properties (Global Portfolio)", location: "Global", roomsCount: 1240 },
  { id: "prop-1", name: "Monday Grand Luxe Hotel & Suites", location: "New York, USA", roomsCount: 350 },
  { id: "prop-2", name: "Monday Bay Resort & Spa", location: "Miami, USA", roomsCount: 280 },
  { id: "prop-3", name: "Monday Business Tower Hotel", location: "Chicago, USA", roomsCount: 410 },
  { id: "prop-4", name: "Monday Heritage Palace", location: "London, UK", roomsCount: 200 },
];

export function PropertySelector() {
  const [selectedProperty, setSelectedProperty] = useState<PropertyOption>(MOCK_PROPERTIES[0]);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-[#E5E2D9] bg-[#F7F4EC] hover:bg-[#DDE9E1] text-[#1E293B] text-xs sm:text-sm font-medium transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-[#285943]/40"
        aria-expanded={isOpen}
      >
        <div className="flex items-center justify-center w-7 h-7 rounded-md bg-[#DDE9E1] text-[#285943] border border-[#A8C3B2] shrink-0">
          <Hotel className="w-4 h-4" />
        </div>
        <div className="text-left hidden sm:block">
          <div className="font-semibold text-[#1E293B] text-xs truncate max-w-[180px]">
            {selectedProperty.name}
          </div>
          <div className="text-[10px] text-[#6B766F] font-normal">
            {selectedProperty.location} • {selectedProperty.roomsCount} rooms
          </div>
        </div>
        <span className="sm:hidden text-xs font-semibold text-[#285943] truncate max-w-[110px]">
          {selectedProperty.name.replace("Monday ", "")}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-[#6B766F] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-30"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute left-0 mt-2 w-72 z-40 bg-white border border-[#E5E2D9] rounded-xl shadow-xl py-2 divide-y divide-[#E5E2D9] animate-in fade-in zoom-in-95 duration-150">
            <div className="px-3 py-1.5 text-[11px] font-semibold text-[#285943] uppercase tracking-wider">
              Select Active Property
            </div>

            <div className="py-1 max-h-64 overflow-y-auto">
              {MOCK_PROPERTIES.map((prop) => {
                const isSelected = prop.id === selectedProperty.id;
                return (
                  <button
                    key={prop.id}
                    onClick={() => {
                      setSelectedProperty(prop);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-left text-xs transition-colors ${
                      isSelected
                        ? "bg-[#DDE9E1] text-[#1E4D3B] font-semibold"
                        : "text-[#1E293B] hover:bg-[#F7F4EC] hover:text-[#1E4D3B]"
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <Building className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? "text-[#285943]" : "text-[#6B766F]"}`} />
                      <div>
                        <div className="font-medium text-[#1E293B]">{prop.name}</div>
                        <div className="text-[10px] text-[#6B766F]">{prop.location}</div>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#285943] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
