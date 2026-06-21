import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../utils/api";
import LoadingDots from "../components/LoadingDots";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/admin/users")
      .then(({ data }) => setUsers(data))
      .catch((error) => toast.error(error.response?.data?.message || "Unable to load users"))
      .finally(() => setLoading(false));
  }, []);

  const updateUser = async (userId, changes) => {
    try {
      const { data } = await api.patch(`/admin/users/${userId}`, changes);
      setUsers((current) =>
        current.map((user) => (user._id === data._id ? data : user))
      );
      toast.success("User updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update user");
    }
  };

  if (loading) return <div className="flex min-h-96 items-center justify-center"><LoadingDots /></div>;

  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">Administration</p>
      <h1 className="mt-1 text-3xl font-bold text-slate-900">Users</h1>
      <div className="mt-7 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
            <tr><th className="px-5 py-4">Name</th><th className="px-5 py-4">Email</th><th className="px-5 py-4">Role</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Joined</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <tr key={user._id}>
                <td className="px-5 py-4 font-semibold text-slate-900">{user.username}</td>
                <td className="px-5 py-4 text-slate-600">{user.email}</td>
                <td className="px-5 py-4"><select aria-label={`Role for ${user.username}`} value={user.role === "user" ? "candidate" : user.role} onChange={(event) => updateUser(user._id, { role: event.target.value })} className="rounded-lg border border-slate-300 bg-white px-3 py-2">{["candidate", "recruiter", "admin"].map((role) => <option key={role}>{role}</option>)}</select></td>
                <td className="px-5 py-4"><button type="button" onClick={() => updateUser(user._id, { accountStatus: user.accountStatus === "suspended" ? "active" : "suspended" })} className={`rounded-lg px-3 py-2 font-semibold ${user.accountStatus === "suspended" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>{user.accountStatus === "suspended" ? "Reactivate" : "Suspend"}</button></td>
                <td className="px-5 py-4 text-slate-500">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Legacy account"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && <p className="p-8 text-center text-slate-500">No users found.</p>}
      </div>
    </div>
  );
};

export default AdminUsers;
