"use client";

import React, { useState, useEffect } from "react";
import { X, ShieldCheck, UserPlus, Building2 } from "lucide-react";
import { SystemUser, EnterpriseRole, createUser, updateUser } from "@/lib/services/user-service";

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userToEdit?: SystemUser;
}

export function UserFormModal({
  isOpen,
  onClose,
  onSuccess,
  userToEdit,
}: UserFormModalProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<EnterpriseRole>("Corporate Sales Director");
  const [department, setDepartment] = useState("B2B Enterprise Sales");
  const [status, setStatus] = useState<"Active" | "Suspended" | "Pending">("Active");
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [propertyAccess, setPropertyAccess] = useState("All Properties (Enterprise Master)");

  useEffect(() => {
    if (userToEdit) {
      setFullName(userToEdit.fullName);
      setEmail(userToEdit.email);
      setRole(userToEdit.role);
      setDepartment(userToEdit.department);
      setStatus(userToEdit.status);
      setMfaEnabled(userToEdit.mfaEnabled);
      setPropertyAccess(userToEdit.propertyAccess[0] || "All Properties (Enterprise Master)");
    } else {
      setFullName("");
      setEmail("");
      setRole("Corporate Sales Director");
      setDepartment("B2B Enterprise Sales");
      setStatus("Active");
      setMfaEnabled(true);
      setPropertyAccess("All Properties (Enterprise Master)");
    }
  }, [userToEdit]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) return;

    if (userToEdit) {
      updateUser(userToEdit.id, {
        fullName,
        email,
        role,
        department,
        status,
        mfaEnabled,
        propertyAccess: [propertyAccess],
      });
    } else {
      createUser({
        fullName,
        email,
        role,
        department,
        status,
        mfaEnabled,
        propertyAccess: [propertyAccess],
      });
    }

    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg bg-white border border-[#E2E8F0] rounded-xl shadow-2xl text-[#1E293B] p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#E8F0EC] border border-[#A8C3B2] rounded-lg text-[#1E4D3B]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-[#1E293B]">
              {userToEdit ? "Edit Staff User Credentials" : "Provision New Staff User"}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 text-[#64748B] hover:text-[#1E293B]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#1E293B] mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-[#F8F6F0] border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm text-[#1E293B] focus:outline-none focus:border-[#1E4D3B]"
              placeholder="e.g. Priya Sharma"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1E293B] mb-1">Work Email Address *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#F8F6F0] border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm text-[#1E293B] focus:outline-none focus:border-[#1E4D3B]"
              placeholder="p.sharma@mondayhotels.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">Enterprise Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as EnterpriseRole)}
                className="w-full bg-[#F8F6F0] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#1E293B] focus:outline-none focus:border-[#1E4D3B]"
              >
                <option value="Super Admin">Super Admin</option>
                <option value="Corporate Sales Director">Corporate Sales Director</option>
                <option value="Hotel General Manager">Hotel General Manager</option>
                <option value="Revenue Manager">Revenue Manager</option>
                <option value="Front Desk Concierge">Front Desk Concierge</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-[#F8F6F0] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#1E293B] focus:outline-none focus:border-[#1E4D3B]"
                placeholder="e.g. Hotel Operations"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1E293B] mb-1">Property Scope Access</label>
            <select
              value={propertyAccess}
              onChange={(e) => setPropertyAccess(e.target.value)}
              className="w-full bg-[#F8F6F0] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#1E293B] focus:outline-none focus:border-[#1E4D3B]"
            >
              <option value="All Properties (Enterprise Master)">All Properties (Enterprise Master)</option>
              <option value="Monday Hotels Grand Royale Mumbai">Monday Hotels Grand Royale Mumbai</option>
              <option value="Monday Hotels Resort & Spa Goa">Monday Hotels Resort & Spa Goa</option>
              <option value="Monday Hotels Palace Udaipur">Monday Hotels Palace Udaipur</option>
              <option value="Monday Hotels Tech Hub Bengaluru">Monday Hotels Tech Hub Bengaluru</option>
            </select>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="mfa"
                checked={mfaEnabled}
                onChange={(e) => setMfaEnabled(e.target.checked)}
                className="rounded border-[#E2E8F0] text-[#1E4D3B] focus:ring-[#1E4D3B]"
              />
              <label htmlFor="mfa" className="text-xs text-[#1E293B] font-medium">Require Multi-Factor Auth (MFA)</label>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-xs text-[#64748B]">Account Status:</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="bg-[#F8F6F0] border border-[#E2E8F0] rounded px-2 py-1 text-xs text-[#1E293B]"
              >
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:text-[#1E293B]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold bg-[#1E4D3B] hover:bg-[#163B2D] text-white rounded-lg shadow-sm"
            >
              {userToEdit ? "Update Credentials" : "Save & Provision User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
