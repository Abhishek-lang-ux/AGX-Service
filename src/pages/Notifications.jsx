import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  Check,
  CheckCircle2,
  CreditCard,
  FileText,
  Info,
  LoaderCircle,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import {
  deleteNotification,
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../lib/api";
import "./notifications.css";

const iconMap = {
  service: FileText,
  payment: CreditCard,
  security: ShieldCheck,
  success: CheckCircle2,
  info: Info,
};

function formatNotificationTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";

  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hr ago`;
  if (seconds < 172800) return "Yesterday";
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: date.getFullYear() === new Date().getFullYear() ? undefined : "numeric",
  });
}

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setError("");
        const data = await getNotifications();
        if (cancelled) return;
        setNotifications(data.notifications || []);
        window.dispatchEvent(new Event("agx-notifications-change"));
      } catch (err) {
        if (!cancelled) setError(err.message || "Unable to load notifications");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.isRead).length,
    [notifications],
  );

  const filteredNotifications =
    filter === "unread"
      ? notifications.filter((notification) => !notification.isRead)
      : notifications;

  const markAsRead = async (id) => {
    try {
      setActionId(id);
      await markNotificationAsRead(id);
      setNotifications((current) =>
        current.map((notification) =>
          notification.id === id
            ? { ...notification, isRead: true }
            : notification,
        ),
      );
      window.dispatchEvent(new Event("agx-notifications-change"));
    } catch (err) {
      setError(err.message || "Unable to update notification");
    } finally {
      setActionId(null);
    }
  };

  const markAllAsRead = async () => {
    try {
      setActionId("all");
      await markAllNotificationsAsRead();
      setNotifications((current) =>
        current.map((notification) => ({ ...notification, isRead: true })),
      );
      window.dispatchEvent(new Event("agx-notifications-change"));
    } catch (err) {
      setError(err.message || "Unable to update notifications");
    } finally {
      setActionId(null);
    }
  };

  const removeNotification = async (id) => {
    try {
      setActionId(id);
      await deleteNotification(id);
      setNotifications((current) =>
        current.filter((notification) => notification.id !== id),
      );
      window.dispatchEvent(new Event("agx-notifications-change"));
    } catch (err) {
      setError(err.message || "Unable to delete notification");
    } finally {
      setActionId(null);
    }
  };

  return (
    <main className="notifications-page">
      <div className="notifications-container">
        <div className="notifications-topbar">
          <Link to="/profile" className="notifications-back">
            <ArrowLeft size={18} />
            <span>Back to Profile</span>
          </Link>
        </div>

        <section className="notifications-header">
          <div className="notifications-heading">
            <div className="notifications-icon"><Bell size={25} /></div>
            <div>
              <h1>Notifications</h1>
              <p>Stay updated with your services, payments and account activity.</p>
            </div>
          </div>

          {unreadCount > 0 && (
            <button type="button" className="mark-all-btn" onClick={markAllAsRead} disabled={actionId === "all"}>
              {actionId === "all" ? <LoaderCircle size={17} className="spin" /> : <Check size={17} />}
              Mark all as read
            </button>
          )}
        </section>

        {error && <div className="notifications-error" role="alert">{error}</div>}

        <section className="notifications-toolbar">
          <div className="notification-tabs">
            <button type="button" className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>
              All <span>{notifications.length}</span>
            </button>
            <button type="button" className={filter === "unread" ? "active" : ""} onClick={() => setFilter("unread")}>
              Unread <span>{unreadCount}</span>
            </button>
          </div>
        </section>

        <section className="notifications-list">
          {loading ? (
            <div className="notifications-empty">
              <LoaderCircle size={28} className="spin" />
              <h3>Loading notifications...</h3>
            </div>
          ) : filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => {
              const Icon = iconMap[notification.type] || Bell;
              const content = (
                <>
                  <div className={`notification-type ${notification.type}`}><Icon size={21} /></div>
                  <div className="notification-content">
                    <div className="notification-title-row">
                      <h3>{notification.title}</h3>
                      {!notification.isRead && <span className="unread-dot" title="Unread" />}
                    </div>
                    <p>{notification.message}</p>
                    <span className="notification-time">{formatNotificationTime(notification.createdAt)}</span>
                  </div>
                </>
              );

              return (
                <article key={notification.id} className={`notification-card ${!notification.isRead ? "unread" : ""}`}>
                  {notification.link ? <Link to={notification.link} className="notification-main-link">{content}</Link> : content}
                  <div className="notification-actions">
                    {!notification.isRead && (
                      <button type="button" onClick={() => markAsRead(notification.id)} disabled={actionId === notification.id} title="Mark as read" aria-label="Mark as read">
                        {actionId === notification.id ? <LoaderCircle size={17} className="spin" /> : <Check size={17} />}
                      </button>
                    )}
                    <button type="button" onClick={() => removeNotification(notification.id)} disabled={actionId === notification.id} title="Delete notification" aria-label="Delete notification">
                      {actionId === notification.id ? <LoaderCircle size={17} className="spin" /> : <Trash2 size={17} />}
                    </button>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="notifications-empty">
              <div className="empty-icon"><Bell size={28} /></div>
              <h3>No notifications</h3>
              <p>{filter === "unread" ? "You're all caught up. There are no unread notifications." : "You don't have any notifications yet."}</p>
              {filter === "unread" && (
                <button type="button" onClick={() => setFilter("all")} className="view-all-notifications">View all notifications</button>
              )}
            </div>
          )}
        </section>

        <div className="notifications-security">
          <ShieldCheck size={21} />
          <div>
            <strong>Important account alerts</strong>
            <p>Security-related notifications may require your immediate attention. Never share your password or verification codes.</p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Notifications;
