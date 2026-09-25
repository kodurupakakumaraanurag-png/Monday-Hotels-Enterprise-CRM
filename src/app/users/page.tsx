"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  UserPlus,
  Users,
  Search,
  Filter,
  Crown,
  Building2,
  Lock,
  CheckCircle2,
  XCircle,
  Clock,
  Edit2,
  Trash2,
  KeyRound,
} from "lucide-react";
import { getUsers, deleteUser, SystemUser } from "@/lib/services/user-service";
import { UserFormModal } from "@/components/users/user-form-modal";

export default function UsersPage() {
  const [users, setUsers] = useState<SystemUser[]>(() => getUsers());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<SystemUser | undefined>(undefined);

  const refreshUsers = () => {
    setUsers([...getUsers()]);
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === "ALL" || u.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Revoke enterprise access for ${name}?`)) {
      deleteUser(id);
      refreshUsers();
    }
  };

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case "Super Admin":
        return "bg-rose-950/80 border border-rose-500/50 text-rose-300 font-bold";
      case "Corporate Sales Director":
        return "bg-amber-950/80 border border-amber-500/50 text-amber-300 font-semibold";
      case "Hotel General Manager":
        return "bg-purple-950/80 border border-purple-500/50 text-purple-300 font-semibold";
      case "Revenue Manager":
        return "bg-blue-950/80 border border-blue-500/50 text-blue-300";
      default:
        return "bg-stone-800 border border-stone-700 text-stone-300";
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto text-stone-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-stone-100">
              Enterprise User & RBAC Administration
            </h1>
          </div>
          <p className="text-sm text-stone-400">
            Role-Based Access Control, Staff Identity Provisioning & Security Credentials
          </p>
        </div>

        <button
          onClick={() => {
            setUserToEdit(undefined);
            setIsModalOpen(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-semibold rounded-lg text-sm shadow-lg shadow-amber-500/20 transition"
        >
          <UserPlus className="w-4 h-4" />
          <span>Provision New User</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-400 font-medium">Total Staff Users</p>
            <h3 className="text-2xl font-bold text-stone-100 mt-1">{users.length}</h3>
          </div>
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-400 font-medium">Active Accounts</p>
            <h3 className="text-2xl font-bold text-emerald-400 mt-1">
              {users.filter((u) => u.status === "Active").length}
            </h3>
          </div>
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-400 font-medium">MFA Enforced Rate</p>
            <h3 className="text-2xl font-bold text-amber-300 mt-1">
              {Math.round((users.filter((u) => u.mfaEnabled).length / users.length) * 100)}%
            </h3>
          </div>
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
            <Lock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-400 font-medium">Active Enterprise Roles</p>
            <h3 className="text-2xl font-bold text-purple-400 mt-1">5 Roles</h3>
          </div>
          <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400">
            <KeyRound className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, department..."
            className="w-full bg-stone-950 border border-stone-800 rounded-lg pl-9 pr-4 py-2 text-sm text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500/50"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-amber-500" />
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-300 focus:outline-none focus:border-amber-500/50"
          >
            <option value="ALL">All Enterprise Roles</option>
            <option value="Super Admin">Super Admin</option>
            <option value="Corporate Sales Director">Corporate Sales Director</option>
            <option value="Hotel General Manager">Hotel General Manager</option>
            <option value="Revenue Manager">Revenue Manager</option>
            <option value="Front Desk Concierge">Front Desk Concierge</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-800 bg-stone-950/60 text-stone-400 text-xs uppercase tracking-wider font-semibold">
                <th className="py-3.5 px-4">User Identity</th>
                <th className="py-3.5 px-4">Enterprise Role & Scope</th>
                <th className="py-3.5 px-4">Property Access</th>
                <th className="py-3.5 px-4">MFA Security</th>
                <th className="py-3.5 px-4">Account Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800 text-sm">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-stone-800/40 transition">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-900/40 border border-amber-500/40 flex items-center justify-center font-bold text-amber-300 text-xs">
                        {user.fullName[0]}
                      </div>
                      <div>
                        <div className="font-semibold text-stone-100">{user.fullName}</div>
                        <div className="text-xs text-stone-400">{user.email}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded text-xs ${getRoleBadgeStyle(user.role)}`}>
                      {user.role}
                    </span>
                    <div className="text-xs text-stone-500 mt-1">{user.department}</div>
                  </td>

                  <td className="py-3.5 px-4 max-w-xs">
                    <div className="text-xs text-stone-300 truncate">
                      {user.propertyAccess.join(", ")}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    {user.mfaEnabled ? (
                      <span className="inline-flex items-center space-x-1 text-xs text-emerald-400 font-medium">
                        <Lock className="w-3.5 h-3.5 text-emerald-400" />
                        <span>MFA Enforced</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 text-xs text-stone-500">
                        <span>Disabled</span>
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                        user.status === "Active"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                          : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => {
                          setUserToEdit(user);
                          setIsModalOpen(true);
                        }}
                        className="p-1.5 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-lg transition"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id, user.fullName)}
                        className="p-1.5 text-stone-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={refreshUsers}
        userToEdit={userToEdit}
      />
    </div>
  );
}
