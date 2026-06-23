import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaBell, FaBriefcase, FaCircleCheck, FaGear } from "react-icons/fa6";
import api from "../utils/api";
import LoadingDots from "../components/LoadingDots";
import { getSocket } from "../utils/socket";

const typeIcons = {
  application: FaBriefcase,
  job: FaBell,
  system: FaGear,
};

const Notifications = () => {
  const [notifications, setNotifications] = useState(null);
  const [filter, setFilter] = useState("all");
  const unread = useMemo(
    () => notifications?.filter((item) => !item.read).length || 0,
    [notifications]
  );

  useEffect(() => {
    api.get("/notifications")
      .then(({ data }) => setNotifications(data))
      .catch((error) => toast.error(error.response?.data?.message || "Unable to load notifications"));
  }, []);

  useEffect(() => {
    const socket = getSocket();
    socket.connect();
    const handleNotification = (notification) => {
      setNotifications((current) =>
        current ? [notification, ...current] : [notification]
      );
    };
    socket.on("notification:new", handleNotification);
    return () => socket.off("notification:new", handleNotification);
  }, []);

  const markRead = async (notification) => {
    if (notification.read) return;
    try {
      const { data } = await api.patch(`/notifications/${notification._id}/read`);
      setNotifications((current) => current.map((item) => item._id === data._id ? data : item));
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update notification");
    }
  };

  const markAllRead = async () => {
    try {
      await api.patch("/notifications/read-all");
      setNotifications((current) => current.map((item) => ({ ...item, read: true })));
      toast.success("All notifications marked as read");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update notifications");
    }
  };

  if (!notifications) return <div className="flex min-h-96 items-center justify-center"><LoadingDots /></div>;

  const visible = notifications.filter((item) =>
    filter === "all" ? true : filter === "unread" ? !item.read : item.type === filter
  );

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">Inbox</p><h1 className="mt-1 text-3xl font-bold">Notifications</h1><p className="mt-2 text-slate-500">{unread} unread notifications</p></div>
        <button type="button" disabled={!unread} onClick={markAllRead} className="secondary-button"><FaCircleCheck /> Mark all read</button>
      </div>
      <div className="mt-7 flex w-fit flex-wrap rounded-xl bg-slate-200/70 p-1">
        {[["all", "All"], ["unread", `Unread (${unread})`], ["application", "Applications"], ["job", "Jobs"]].map(([value, label]) => (
          <button key={value} type="button" onClick={() => setFilter(value)} className={`rounded-lg px-4 py-2 text-sm font-semibold ${filter === value ? "bg-white text-slate-950 shadow-sm" : "text-slate-600"}`}>{label}</button>
        ))}
      </div>
      <div className="mt-5 space-y-3">
        {visible.map((notification) => {
          const Icon = typeIcons[notification.type] || FaBell;
          const content = <><span className={`rounded-xl p-3 ${notification.read ? "bg-slate-100 text-slate-500" : "bg-indigo-50 text-indigo-600"}`}><Icon /></span><div className="min-w-0 flex-1"><h2 className="font-bold">{notification.title}</h2><p className="mt-1 text-sm text-slate-600">{notification.message}</p><p className="mt-2 text-xs text-slate-400">{new Date(notification.createdAt).toLocaleString()}</p></div>{!notification.read && <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />}</>;
          return notification.link
            ? <Link key={notification._id} to={notification.link} onClick={() => markRead(notification)} className="surface-card flex items-start gap-4 p-5 transition hover:border-indigo-200">{content}</Link>
            : <button key={notification._id} type="button" onClick={() => markRead(notification)} className="surface-card flex w-full items-start gap-4 p-5 text-left transition hover:border-indigo-200">{content}</button>;
        })}
        {visible.length === 0 && <div className="surface-card border-dashed p-12 text-center text-slate-500"><FaBell className="mx-auto text-3xl text-slate-300" /><p className="mt-3 font-semibold">No notifications in this view.</p></div>}
      </div>
    </div>
  );
};

export default Notifications;
