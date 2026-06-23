import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../utils/api";
import LoadingDots from "../components/LoadingDots";

const PublicProfile = () => {
  const { username } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/profile/public/${encodeURIComponent(username)}`)
      .then(({ data: response }) => setData(response))
      .catch((requestError) => setError(requestError.response?.data?.message || "Profile not found"));
  }, [username]);

  if (!data && !error) return <div className="flex min-h-[60vh] items-center justify-center"><LoadingDots /></div>;
  if (error) return <main className="mx-auto max-w-3xl px-4 py-20 text-center"><h1 className="text-3xl font-bold">{error}</h1><Link to="/" className="mt-5 inline-block font-semibold text-indigo-600">Browse jobs</Link></main>;

  const profile = data.profile || {};
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
        <div className="h-40 bg-gradient-to-r from-indigo-500 to-violet-600" />
        <div className="p-7">
          <div className="-mt-20 grid h-24 w-24 place-items-center rounded-full border-4 border-white bg-slate-900 text-3xl font-bold text-white">{(profile.name || data.user.username).charAt(0).toUpperCase()}</div>
          <h1 className="mt-4 text-3xl font-bold">{profile.name || data.user.username}</h1>
          <p className="mt-2 text-slate-500">{profile.location || "Location not provided"}</p>
          {profile.resumeUrl && <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="primary-button mt-5">View resume</a>}
        </div>
      </section>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          <section className="surface-card p-6"><h2 className="text-xl font-bold">About</h2><p className="mt-3 whitespace-pre-line leading-7 text-slate-600">{profile.bio || "No bio provided."}</p></section>
          <section className="surface-card p-6"><h2 className="text-xl font-bold">Experience</h2><p className="mt-3 whitespace-pre-line leading-7 text-slate-600">{profile.experience || "No experience provided."}</p></section>
          <section className="surface-card p-6"><h2 className="text-xl font-bold">Education</h2><p className="mt-3 whitespace-pre-line leading-7 text-slate-600">{profile.education || "No education provided."}</p></section>
        </div>
        <section className="surface-card h-fit p-6"><h2 className="text-xl font-bold">Skills</h2><div className="mt-4 flex flex-wrap gap-2">{(profile.skills || []).map((skill) => <span key={skill} className="rounded-full bg-indigo-50 px-3 py-1.5 text-sm font-semibold text-indigo-700">{skill}</span>)}{!profile.skills?.length && <p className="text-sm text-slate-500">No skills provided.</p>}</div></section>
      </div>
    </main>
  );
};

export default PublicProfile;
