"use client";

import React from "react";
import { Building2, Bed, DollarSign, TrendingUp, Users, MapPin, Award, CheckCircle2 } from "lucide-react";

interface HotelProperty {
  id: string;
  name: string;
  location: string;
  roomCount: number;
  occupancyRate: string;
  revPar: number;
  adr: number;
  generalManager: string;
  rating: string;
  status: "Operational" | "Renovation";
}

const PROPERTIES: HotelProperty[] = [
  {
    id: "PROP-01",
    name: "Monday Hotels Grand Royale Mumbai",
    location: "Marine Drive, Mumbai, Maharashtra",
    roomCount: 240,
    occupancyRate: "88.5%",
    revPar: 1432,
    adr: 1619,
    generalManager: "Priya Sharma",
    rating: "5-Star Deluxe",
    status: "Operational",
  },
  {
    id: "PROP-02",
    name: "Monday Hotels Resort & Spa Goa",
    location: "Calangute Beach, North Goa",
    roomCount: 180,
    occupancyRate: "92.1%",
    revPar: 1290,
    adr: 1400,
    generalManager: "Rajesh Nair",
    rating: "Luxury Beach Resort",
    status: "Operational",
  },
  {
    id: "PROP-03",
    name: "Monday Hotels Palace Udaipur",
    location: "Lake Pichola, Udaipur, Rajasthan",
    roomCount: 110,
    occupancyRate: "84.0%",
    revPar: 1680,
    adr: 2000,
    generalManager: "Devendra Singh",
    rating: "Royal Heritage Palace",
    status: "Operational",
  },
  {
    id: "PROP-04",
    name: "Monday Hotels Tech Hub Bengaluru",
    location: "Indiranagar, Bengaluru, Karnataka",
    roomCount: 320,
    occupancyRate: "86.2%",
    revPar: 1120,
    adr: 1300,
    generalManager: "Sunita Rao",
    rating: "5-Star Business Hotel",
    status: "Operational",
  },
  {
    id: "PROP-05",
    name: "Monday Hotels Capital View New Delhi",
    location: "Chanakyapuri, New Delhi",
    roomCount: 260,
    occupancyRate: "81.4%",
    revPar: 1250,
    adr: 1535,
    generalManager: "Vikram Malhotra",
    rating: "Diplomatic Suite Hotel",
    status: "Operational",
  },
  {
    id: "PROP-06",
    name: "Monday Hotels Financial District Hyderabad",
    location: "Gachibowli, Hyderabad, Telangana",
    roomCount: 210,
    occupancyRate: "79.8%",
    revPar: 1040,
    adr: 1303,
    generalManager: "Kavita Reddy",
    rating: "Luxury Commercial Hub",
    status: "Operational",
  },
];

export default function PropertiesPage() {
  const totalRooms = PROPERTIES.reduce((acc, p) => acc + p.roomCount, 0);
  const avgRevPar = Math.round(PROPERTIES.reduce((acc, p) => acc + p.revPar, 0) / PROPERTIES.length);

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto text-stone-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400">
              <Building2 className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-stone-100">
              Monday Hotels Property Portfolio
            </h1>
          </div>
          <p className="text-sm text-stone-400">
            Enterprise Hotel Inventory, RevPAR Benchmarks & Property Performance Directory
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-400 font-medium">Total Properties</p>
            <h3 className="text-2xl font-bold text-amber-300 mt-1">6 Luxury Hotels</h3>
          </div>
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-400 font-medium">Total Room Key Inventory</p>
            <h3 className="text-2xl font-bold text-stone-100 mt-1">{totalRooms.toLocaleString()} Rooms</h3>
          </div>
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
            <Bed className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-400 font-medium">Portfolio Avg RevPAR</p>
            <h3 className="text-2xl font-bold text-emerald-400 mt-1">${avgRevPar}</h3>
          </div>
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-400 font-medium">Avg Portfolio Occupancy</p>
            <h3 className="text-2xl font-bold text-purple-400 mt-1">85.3%</h3>
          </div>
          <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400">
            <Award className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Property Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PROPERTIES.map((prop) => (
          <div
            key={prop.id}
            className="bg-stone-900 border border-stone-800 hover:border-amber-500/40 rounded-xl p-5 space-y-4 transition shadow-xl"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs bg-amber-500/10 text-amber-300 font-semibold px-2.5 py-0.5 rounded border border-amber-500/30">
                  {prop.rating}
                </span>
                <h3 className="font-bold text-stone-100 text-base mt-2">{prop.name}</h3>
                <p className="text-xs text-stone-400 flex items-center space-x-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                  <span>{prop.location}</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-stone-950 p-3 rounded-xl border border-stone-800">
              <div>
                <p className="text-stone-500">Room Keys</p>
                <p className="font-semibold text-stone-200 text-sm mt-0.5">{prop.roomCount} Rooms</p>
              </div>
              <div>
                <p className="text-stone-500">Occupancy Rate</p>
                <p className="font-semibold text-emerald-400 text-sm mt-0.5">{prop.occupancyRate}</p>
              </div>
              <div>
                <p className="text-stone-500">RevPAR</p>
                <p className="font-semibold text-amber-300 text-sm mt-0.5">${prop.revPar}</p>
              </div>
              <div>
                <p className="text-stone-500">Average Daily Rate</p>
                <p className="font-semibold text-stone-200 text-sm mt-0.5">${prop.adr}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-800 text-xs text-stone-400 flex items-center justify-between">
              <span>General Manager: <strong className="text-stone-200">{prop.generalManager}</strong></span>
              <span className="flex items-center space-x-1 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{prop.status}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
