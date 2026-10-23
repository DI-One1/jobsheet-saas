"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  getNotifications,
  getUnreadCount,
  markAllAsRead,
  markOneAsRead,
  SerializedNotification,
} from "@/features/item/actions/notification";
import { timeAgo } from "@/lib/utils/dateFormat";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { createClient } from "@/lib/supabase";

export default function Notification() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<SerializedNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifs = async () => {
    try {
      const [count, notifs] = await Promise.all([
        getUnreadCount(),
        getNotifications(10),
      ]);
      setUnreadCount(count);
      setNotifications(notifs);
    } catch (err) {
      console.error("Gagal load notifikasi:", err);
    }
  };

  useEffect(() => {
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 30000); // Polling cadangan

    const supabase = createClient();
    const channel = supabase
      .channel("navbar-notifications-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications" },
        () => {
          fetchNotifs();
        }
      )
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, []);

  // Close on Click Outside
  useClickOutside(dropdownRef, () => {
    setIsOpen(false);
  });

  // Close on Escape
  useKeyboardShortcut("Escape", () => {
    setIsOpen(false);
  });

  const handleToggle = () => {
    if (!isOpen) {
      fetchNotifs();
    }
    setIsOpen(!isOpen);
  };

  const handleMarkAll = async () => {
    setIsLoading(true);
    await markAllAsRead();
    await fetchNotifs();
    setIsLoading(false);
  };

  const handleItemClick = async (notif: SerializedNotification) => {
    if (!notif.isRead) {
      await markOneAsRead(notif.id);
      fetchNotifs();
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Tombol Lonceng */}
      <button
        onClick={handleToggle}
        className="relative p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
        aria-label="Notifikasi"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z" />
        </svg>

        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Notifikasi */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 z-[2000] overflow-hidden text-gray-800 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between px-4 pb-2 border-b border-gray-100">
            <h3 className="font-bold text-sm text-green-dark flex items-center gap-2">
              Notifikasi
              {unreadCount > 0 && (
                <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-semibold">
                  {unreadCount} baru
                </span>
              )}
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAll}
                disabled={isLoading}
                className="text-xs text-green-accent hover:text-green-mid font-medium transition-colors cursor-pointer"
              >
                Tandai semua dibaca
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-sm text-gray-400">
                Belum ada notifikasi
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleItemClick(notif)}
                  className={`p-3.5 hover:bg-gray-50 transition-colors cursor-pointer ${!notif.isRead ? "bg-emerald-50/50" : ""
                    }`}
                >
                  {notif.link ? (
                    <Link href={notif.link} className="block">
                      <div className="flex justify-between items-start gap-2">
                        <p
                          className={`text-xs font-bold ${!notif.isRead ? "text-green-dark" : "text-gray-700"
                            }`}
                        >
                          {notif.title}
                        </p>
                        <span className="text-[10px] text-gray-400 shrink-0">
                          {timeAgo(notif.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {notif.message}
                      </p>
                    </Link>
                  ) : (
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <p
                          className={`text-xs font-bold ${!notif.isRead ? "text-green-dark" : "text-gray-700"
                            }`}
                        >
                          {notif.title}
                        </p>
                        <span className="text-[10px] text-gray-400 shrink-0">
                          {timeAgo(notif.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {notif.message}
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
