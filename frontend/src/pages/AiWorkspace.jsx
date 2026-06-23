import { useState } from "react";
import { toast } from "react-toastify";
import api from "../utils/api";
import { useAuth } from "../auth/auth";

const AiWorkspace = () => {
  const { user } = useAuth();
  const candidate = user.role === "candidate";
  const [input, setInput] = useState("");
  const [mode, setMode] = useState(candidate ? "copilot" : "job_description");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    try {
      const response = candidate
        ? mode === "recommendations"
          ? await api.post("/ai/recommendations/jobs")
          : mode === "resume"
          ? await api.post("/ai/resume/analyze", { resumeText: input })
          : await api.post("/ai/candidate/copilot", { question: input })
        : await api.post("/ai/recruiter/copilot", { type: mode, context: { request: input } });
      setResult(response.data.output);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "AI request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl">
      <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">OpenAI-powered</p>
      <h1 className="mt-1 text-3xl font-bold">{candidate ? "Candidate copilot" : "Recruiter copilot"}</h1>
      <p className="mt-2 text-slate-500">Outputs are generated through the configured provider and persisted for auditability.</p>
      <section className="surface-card mt-7 p-6">
        <select value={mode} onChange={(event) => setMode(event.target.value)} className="field-control">
          {candidate ? <><option value="copilot">Career assistant</option><option value="resume">Resume analyzer</option><option value="recommendations">Job recommendations</option></> : <><option value="job_description">Job description</option><option value="screening_questions">Screening questions</option><option value="candidate_summary">Candidate summary</option><option value="interview_questions">Interview questions</option></>}
        </select>
        {mode !== "recommendations" && <textarea rows="10" value={input} onChange={(event) => setInput(event.target.value)} className="field-control" placeholder={mode === "resume" ? "Paste extracted resume text (minimum 100 characters)" : "Describe what you need help with"} />}
        <button type="button" onClick={run} disabled={loading || (mode !== "recommendations" && !input.trim())} className="primary-button mt-5">{loading ? "Generating..." : "Generate"}</button>
      </section>
      {result && <section className="surface-card mt-6 p-6"><h2 className="text-xl font-bold">Result</h2><pre className="mt-4 overflow-auto whitespace-pre-wrap rounded-xl bg-slate-950 p-5 text-sm text-slate-100">{JSON.stringify(result, null, 2)}</pre></section>}
    </div>
  );
};

export default AiWorkspace;
