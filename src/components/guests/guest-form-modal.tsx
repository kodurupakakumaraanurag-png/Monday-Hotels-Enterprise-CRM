"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, UserCheck, Crown, Sparkles, Building2, Utensils, Thermometer, SlidersHorizontal } from "lucide-react";
import { guestSchema, GuestFormValues } from "@/lib/validations/guest-schema";
import { createGuest, updateGuest, GuestProfile } from "@/lib/services/guest-service";

interface GuestFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  guestToEdit?: GuestProfile;
}

export function GuestFormModal({
  isOpen,
  onClose,
  onSuccess,
  guestToEdit,
}: GuestFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GuestFormValues>({
    resolver: zodResolver(guestSchema),
    defaultValues: guestToEdit
      ? {
          firstName: guestToEdit.firstName,
          lastName: guestToEdit.lastName,
          email: guestToEdit.email,
          phone: guestToEdit.phone,
          vipTier: guestToEdit.vipTier,
          status: guestToEdit.status,
          totalStays: guestToEdit.totalStays,
          totalNights: guestToEdit.totalNights,
          lifetimeSpend: guestToEdit.lifetimeSpend,
          averageDailyRate: guestToEdit.averageDailyRate,
          preferredProperty: guestToEdit.preferredProperty,
          preferredRoomType: guestToEdit.preferredRoomType,
          pillowType: guestToEdit.pillowType || "",
          floorPreference: guestToEdit.floorPreference || "",
          roomLocation: guestToEdit.roomLocation || "",
          temperatureSetting: guestToEdit.temperatureSetting || "",
          dietaryRestrictions: guestToEdit.dietaryRestrictions || "",
          anniversary: guestToEdit.anniversary || "",
          birthday: guestToEdit.birthday || "",
          specialRequests: guestToEdit.specialRequests || "",
          corporateCompanyName: guestToEdit.corporateCompanyName || "",
        }
      : {
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          vipTier: "Standard",
          status: "Active",
          totalStays: 1,
          totalNights: 2,
          lifetimeSpend: 2500,
          averageDailyRate: 1250,
          preferredProperty: "Monday Hotels Grand Royale Mumbai",
          preferredRoomType: "Deluxe Executive King",
          pillowType: "Goose Down Soft",
          floorPreference: "High Floor",
          temperatureSetting: "21°C",
        },
  });

  React.useEffect(() => {
    if (guestToEdit) {
      reset({
        firstName: guestToEdit.firstName,
        lastName: guestToEdit.lastName,
        email: guestToEdit.email,
        phone: guestToEdit.phone,
        vipTier: guestToEdit.vipTier,
        status: guestToEdit.status,
        totalStays: guestToEdit.totalStays,
        totalNights: guestToEdit.totalNights,
        lifetimeSpend: guestToEdit.lifetimeSpend,
        averageDailyRate: guestToEdit.averageDailyRate,
        preferredProperty: guestToEdit.preferredProperty,
        preferredRoomType: guestToEdit.preferredRoomType,
        pillowType: guestToEdit.pillowType || "",
        floorPreference: guestToEdit.floorPreference || "",
        roomLocation: guestToEdit.roomLocation || "",
        temperatureSetting: guestToEdit.temperatureSetting || "",
        dietaryRestrictions: guestToEdit.dietaryRestrictions || "",
        anniversary: guestToEdit.anniversary || "",
        birthday: guestToEdit.birthday || "",
        specialRequests: guestToEdit.specialRequests || "",
        corporateCompanyName: guestToEdit.corporateCompanyName || "",
      });
    }
  }, [guestToEdit, reset]);

  if (!isOpen) return null;

  const onSubmit = (data: GuestFormValues) => {
    try {
      if (guestToEdit) {
        updateGuest(guestToEdit.id, data);
      } else {
        createGuest(data);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to save guest", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-stone-900 border border-amber-500/30 rounded-xl shadow-2xl text-stone-100 p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-amber-200">
                {guestToEdit ? `Edit Guest 360 Profile (${guestToEdit.id})` : "Create VIP Guest 360 Profile"}
              </h2>
              <p className="text-xs text-stone-400">
                Capture high-touch guest preferences, VIP tier credentials, and stay metrics
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-amber-400/90 flex items-center space-x-2">
              <UserCheck className="w-4 h-4 text-amber-500" />
              <span>Personal & Contact Credentials</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">First Name *</label>
                <input
                  {...register("firstName")}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-stone-200 focus:outline-none focus:border-amber-500/50"
                  placeholder="e.g. Vikramaditya"
                />
                {errors.firstName && <p className="text-xs text-rose-400 mt-1">{errors.firstName.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">Last Name *</label>
                <input
                  {...register("lastName")}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-stone-200 focus:outline-none focus:border-amber-500/50"
                  placeholder="e.g. Singhania"
                />
                {errors.lastName && <p className="text-xs text-rose-400 mt-1">{errors.lastName.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">Email Address *</label>
                <input
                  {...register("email")}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-stone-200 focus:outline-none focus:border-amber-500/50"
                  placeholder="v.singhania@domain.com"
                />
                {errors.email && <p className="text-xs text-rose-400 mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">Phone Number *</label>
                <input
                  {...register("phone")}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-stone-200 focus:outline-none focus:border-amber-500/50"
                  placeholder="+91 98200 11223"
                />
                {errors.phone && <p className="text-xs text-rose-400 mt-1">{errors.phone.message}</p>}
              </div>
            </div>
          </div>

          {/* Tier & Status */}
          <div className="space-y-4 pt-4 border-t border-stone-800">
            <h3 className="text-sm font-medium text-amber-400/90 flex items-center space-x-2">
              <Crown className="w-4 h-4 text-amber-500" />
              <span>VIP Loyalty Status & Tiering</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">VIP Loyalty Tier</label>
                <select
                  {...register("vipTier")}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-stone-200 focus:outline-none focus:border-amber-500/50"
                >
                  <option value="Black Diamond">Black Diamond (Highest Luxury Tier)</option>
                  <option value="Platinum">Platinum Tier</option>
                  <option value="Gold">Gold Tier</option>
                  <option value="Silver">Silver Tier</option>
                  <option value="Standard">Standard Tier</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">Account Status</label>
                <select
                  {...register("status")}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-stone-200 focus:outline-none focus:border-amber-500/50"
                >
                  <option value="Active">Active Guest</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Blacklisted">Blacklisted / DNC</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">Corporate Affiliation</label>
                <input
                  {...register("corporateCompanyName")}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-stone-200 focus:outline-none focus:border-amber-500/50"
                  placeholder="e.g. Reliance Enterprise Solutions"
                />
              </div>
            </div>
          </div>

          {/* Preferences & Personalization */}
          <div className="space-y-4 pt-4 border-t border-stone-800">
            <h3 className="text-sm font-medium text-amber-400/90 flex items-center space-x-2">
              <SlidersHorizontal className="w-4 h-4 text-amber-500" />
              <span>Personalization & Stay Preferences</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">Preferred Hotel Property</label>
                <select
                  {...register("preferredProperty")}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-stone-200 focus:outline-none focus:border-amber-500/50"
                >
                  <option value="Monday Hotels Grand Royale Mumbai">Monday Hotels Grand Royale Mumbai</option>
                  <option value="Monday Hotels Resort & Spa Goa">Monday Hotels Resort & Spa Goa</option>
                  <option value="Monday Hotels Palace Udaipur">Monday Hotels Palace Udaipur</option>
                  <option value="Monday Hotels Tech Hub Bengaluru">Monday Hotels Tech Hub Bengaluru</option>
                  <option value="Monday Hotels Capital View New Delhi">Monday Hotels Capital View New Delhi</option>
                  <option value="Monday Hotels Financial District Hyderabad">Monday Hotels Financial District Hyderabad</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">Preferred Room Type</label>
                <input
                  {...register("preferredRoomType")}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-stone-200 focus:outline-none focus:border-amber-500/50"
                  placeholder="e.g. Presidential Sky Suite"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">Pillow Preference</label>
                <input
                  {...register("pillowType")}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-stone-200 focus:outline-none focus:border-amber-500/50"
                  placeholder="e.g. Goose Down Soft, Memory Foam"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">Room Location / Floor</label>
                <input
                  {...register("floorPreference")}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-stone-200 focus:outline-none focus:border-amber-500/50"
                  placeholder="e.g. Top Floor / Away from Elevator"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">Temperature Setting</label>
                <input
                  {...register("temperatureSetting")}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-stone-200 focus:outline-none focus:border-amber-500/50"
                  placeholder="e.g. 21°C Constant"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">Dietary Restrictions & F&B Notes</label>
                <input
                  {...register("dietaryRestrictions")}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-stone-200 focus:outline-none focus:border-amber-500/50"
                  placeholder="e.g. Strictly Vegetarian, Gluten-Sensitive"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">Special Concierge Instructions</label>
              <textarea
                {...register("specialRequests")}
                rows={2}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-stone-200 focus:outline-none focus:border-amber-500/50"
                placeholder="Enter any VIP butler requests, preferred newspaper, sparkling water, or anniversary details..."
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-stone-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-sm font-semibold bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 rounded-lg shadow-lg shadow-amber-500/20 transition disabled:opacity-50"
            >
              {guestToEdit ? "Update Guest 360 Profile" : "Save Guest Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
