'use client';

import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '@/hooks/useNotifications';
import { Notification } from '@/types';
import { Trash2, Inbox, AlertTriangle, X } from 'lucide-react';

interface NotificationDropdownProps {
  onClose: () => void;
}

export default function NotificationDropdown({ onClose }: NotificationDropdownProps) {
  const router = useRouter();
  const {
    notifications,
    markAsRead,
    clearAllNotifications,
    deleteNotification
  } = useNotifications();

  // Clear all confirmation logic
  const [confirmClear, setConfirmClear] = useState(false);
  const confirmTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleClearClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirmClear) {
      clearAllNotifications();
      setConfirmClear(false);
      if (confirmTimerRef.current) {
        clearTimeout(confirmTimerRef.current);
      }
    } else {
      setConfirmClear(true);
      confirmTimerRef.current = setTimeout(() => {
        setConfirmClear(false);
      }, 3000);
    }
  };

  useEffect(() => {
    return () => {
      if (confirmTimerRef.current) {
        clearTimeout(confirmTimerRef.current);
      }
    };
  }, []);

  // Helper to format timestamps like "25 Jun" or relative if recent
  const formatNotificationTime = (dateString?: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    
    // Check if it's today
    const isToday = new Date().toDateString() === date.toDateString();
    if (isToday) {
      const diffMs = Date.now() - date.getTime();
      const diffMin = Math.floor(diffMs / 60000);
      if (diffMin < 1) return 'Just now';
      if (diffMin < 60) return `${diffMin}m ago`;
      const diffHr = Math.floor(diffMin / 60);
      return `${diffHr}h ago`;
    }

    // Format as "DD MMM" (e.g., "25 Jun")
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  };

  // Maps notification type to colored status dot class
  const getDotColor = (type: Notification['type'], isRead: boolean) => {
    if (isRead) {
      return 'bg-gray-300 dark:bg-gray-700 opacity-60';
    }
    switch (type) {
      case 'task':
        return 'bg-emerald-500'; // Green
      case 'calendar':
        return 'bg-amber-500'; // Amber/Orange
      case 'gmail':
      case 'message':
        return 'bg-blue-500'; // Blue
      case 'document':
        return 'bg-purple-500'; // Purple
      case 'ai':
        return 'bg-indigo-500'; // Indigo
      case 'integration':
        return 'bg-pink-500'; // Pink
      case 'profile':
        return 'bg-teal-500'; // Teal
      case 'settings':
        return 'bg-zinc-500'; // Zinc
      case 'admin':
        return 'bg-rose-500'; // Rose
      default:
        return 'bg-emerald-500'; // Fallback to green
    }
  };

  const handleCardClick = (notification: Notification) => {
    // Mark as read
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
    // Navigate if link exists
    if (notification.link) {
      router.push(notification.link);
    }
    // Close dropdown
    onClose();
  };

  // Dropdown panel variants (smooth clean fade-in & slide down)
  const containerVariants = {
    hidden: { opacity: 0, y: -6 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.15,
        ease: 'easeOut' as any,
      }
    },
    exit: {
      opacity: 0,
      y: -6,
      transition: { duration: 0.12, ease: 'easeIn' as any }
    }
  };

  // Staggered list layout variants
  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: 0.02
      }
    }
  };

  // Individual notification card variants
  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as any, stiffness: 350, damping: 26 }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.12 }
    }
  };

  return (
    <>
      {/* Self-contained custom scrollbar styling matching specs (thicker grey scrollbar) */}
      <style jsx global>{`
        .notification-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .notification-scrollbar::-webkit-scrollbar-track {
          background: #F8FAFC;
          border-radius: 9999px;
        }
        .notification-scrollbar::-webkit-scrollbar-thumb {
          background: #CBD5E1; /* slate-300 */
          border-radius: 9999px;
          border: 1.5px solid #F8FAFC;
          transition: background-color 0.2s ease;
        }
        .notification-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94A3B8; /* slate-400 */
        }
        /* Smooth scrolling inside list */
        .notification-scrollbar {
          scroll-behavior: smooth;
        }
      `}</style>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="absolute right-0 mt-2 w-[330px] max-w-[calc(100vw-2rem)] h-[410px] bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden flex flex-col"
      >
        {/* Sticky Fixed Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-gray-100 bg-white z-10 shrink-0 select-none">
          <h3 className="font-bold text-[15px] text-gray-800 tracking-tight">Notifications</h3>
          <motion.button
            disabled={notifications.length === 0}
            onClick={handleClearClick}
            whileHover={notifications.length > 0 ? { 
              scale: 1.04, 
              color: '#10B981', // green primary
            } : {}}
            whileTap={notifications.length > 0 ? { scale: 0.96 } : {}}
            className={`text-xs font-semibold px-2 py-1 rounded-md transition-all outline-none flex items-center gap-1.5 ${
              notifications.length === 0
                ? 'text-gray-300 cursor-not-allowed pointer-events-none'
                : confirmClear
                ? 'text-red-500 bg-red-50 border border-red-100'
                : 'text-primary hover:bg-primary/5 border border-transparent'
            }`}
            title={confirmClear ? 'Click again to clear all notifications' : 'Clear all notifications'}
          >
            {confirmClear ? (
              <>
                <AlertTriangle className="h-3 w-3 shrink-0" />
                <span>Sure?</span>
              </>
            ) : (
              <>
                <Trash2 className="h-3.5 w-3.5 shrink-0" />
                <span>Clear All</span>
              </>
            )}
          </motion.button>
        </div>

        {/* Scrollable list of items */}
        <div className="flex-1 overflow-y-auto notification-scrollbar bg-white px-5 py-1">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <div className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 mb-2.5 border border-gray-100">
                <Inbox className="h-4 w-4" />
              </div>
              <p className="text-xs font-bold text-gray-700 mb-0.5">All caught up!</p>
              <p className="text-[10px] text-gray-400 max-w-[180px] leading-relaxed">
                No new updates at this moment.
              </p>
            </div>
          ) : (
            <motion.div
              variants={listVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col"
            >
              <AnimatePresence initial={false}>
                {notifications.map((notif) => {
                  const dotColorClass = getDotColor(notif.type, notif.is_read);
                  return (
                    <motion.div
                      key={notif.id}
                      variants={itemVariants}
                      whileHover={{ y: -1, scale: 1.002 }}
                      whileTap={{ scale: 0.995 }}
                      className="flex items-start gap-3 py-3 bg-white cursor-pointer select-none relative group"
                      onClick={() => handleCardClick(notif)}
                    >
                      {/* Left: Solid Status Dot */}
                      <span className={`h-2 w-2 rounded-full mt-1.5 shrink-0 transition-all ${dotColorClass}`} />

                      {/* Content: Title, Description, Date */}
                      <div className="flex-1 min-w-0 pr-6">
                        <h4 className={`text-[13px] text-gray-700 leading-tight mb-0.5 truncate ${notif.is_read ? 'font-medium' : 'font-bold'}`}>
                          {notif.title}
                        </h4>
                        <p className="text-[11px] text-gray-400 leading-normal line-clamp-2 pr-1">
                          {notif.description}
                        </p>
                        <span className="text-[10px] text-gray-300 font-medium mt-1 block">
                          {formatNotificationTime(notif.created_at)}
                        </span>
                      </div>

                      {/* Right: Dismiss close button on hover */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notif.id);
                        }}
                        className="absolute right-0 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-gray-300 hover:text-red-500 hover:bg-gray-50 opacity-0 group-hover:opacity-100 transition-all duration-150 z-20"
                        title="Dismiss notification"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </motion.div>
    </>
  );
}
