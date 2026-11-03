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
    let isSubscribed = true;

    const loadData = async () => {
      try {
        const [count, notifs] = await Promise.all([
          getUnreadCount(),
          getNotifications(10),
        ]);
        if (isSubscribed) {
          setUnreadCount(count);
          setNotifications(notifs);
        }
      } catch (err) {
        console.error("Gagal load notifikasi:", err);
      }
    };

    void loadData();
    const interval = setInterval(loadData, 60000); // Polling cadangan 60s

    const supabase = createClient();
    const channel = supabase
      .channel("navbar-notifications-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications" },
        () => {
          void loadData();
        }
      )
      .subscribe();

    return () => {
      isSubscribed = false;
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
        className="relative p-2 text-[#4a6b63] hover:text-[#0d7565] hover:bg-[#eef7f4] rounded-xl border border-[#d6e5df] transition-colors cursor-pointer"
        aria-label="Notifikasi"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9.5px] font-bold text-white shadow-xs">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Notifikasi */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-[#e2ece8] py-3 z-[2000] overflow-hidden text-[#102824] animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between px-4 pb-2.5 border-b border-[#e2ece8]">
            <h3 className="font-bold text-sm text-[#102824] flex items-center gap-2">
              <span>Notifikasi</span>
              {unreadCount > 0 && (
                <span className="bg-red-50 text-red-700 text-xs px-2 py-0.5 rounded-full font-semibold border border-red-200">
                  {unreadCount} baru
                </span>
              )}
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAll}
                disabled={isLoading}
                className="text-xs text-[#0d7565] hover:text-[#0a5d50] font-semibold transition-colors cursor-pointer"
              >
                Tandai semua dibaca
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-[#edf4f1]">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#526b65]">
                Belum ada notifikasi
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleItemClick(notif)}
                  className={`p-3.5 hover:bg-[#f6faf8] transition-colors cursor-pointer ${
                    !notif.isRead ? "bg-[#eef7f4]/60" : ""
                  }`}
                >
                  {notif.link ? (
                    <Link href={notif.link} className="block">
                      <div className="flex justify-between items-start gap-2">
                        <p
                          className={`text-xs font-bold ${
                            !notif.isRead ? "text-[#0d7565]" : "text-[#102824]"
                          }`}
                        >
                          {notif.title}
                        </p>
                        <span className="text-[10px] text-[#526b65] shrink-0">
                          {timeAgo(notif.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-[#526b65] mt-1 line-clamp-2">
                        {notif.message}
                      </p>
                    </Link>
                  ) : (
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <p
                          className={`text-xs font-bold ${
                            !notif.isRead ? "text-[#0d7565]" : "text-[#102824]"
                          }`}
                        >
                          {notif.title}
                        </p>
                        <span className="text-[10px] text-[#526b65] shrink-0">
                          {timeAgo(notif.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-[#526b65] mt-1 line-clamp-2">
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
