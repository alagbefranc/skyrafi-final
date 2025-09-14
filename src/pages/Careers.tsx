import React from 'react';
import { motion } from 'framer-motion';
import { getEnv } from '../lib/env';

type Job = {
  id: string;
  title: string;
  location: string | null;
  type: string | null;
  description: string | null;
  status: string;
  created_at: string;
};

const Careers: React.FC = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const handleResumeUpload = async (file: File) => {
    try {
      setUploading(true);
      setUploadMsg(null);
      const uploadUrl = getEnv('VITE_SUPABASE_UPLOAD_RESUME_URL');
      const anonKey = getEnv('VITE_SUPABASE_ANON_KEY');
      if (!uploadUrl) throw new Error('Missing VITE_SUPABASE_UPLOAD_RESUME_URL');
      if (!anonKey) throw new Error('Missing VITE_SUPABASE_ANON_KEY');

      const form = new FormData();
      form.append('file', file);
      form.append('filename', file.name);

      const res = await fetch(uploadUrl, {
        method: 'POST',
        headers: { Authorization: `Bearer ${anonKey}` },
        body: form,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || `Upload failed (${res.status})`);
      }
      const data = await res.json();
      if (data?.signedUrl) {
        setResumeUrl(data.signedUrl);
        setUploadMsg('Resume uploaded successfully.');
      } else {
        throw new Error('Unexpected upload response');
      }
    } catch (e: any) {
      setError(e?.message || 'Failed to upload resume');
    } finally {
      setUploading(false);
      setTimeout(() => setUploadMsg(null), 3000);
    }
  };

  const [jobs, setJobs] = React.useState<Job[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  const [selectedJob, setSelectedJob] = React.useState<string | null>(null);
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [resumeUrl, setResumeUrl] = React.useState('');
  const [uploading, setUploading] = React.useState(false);
  const [uploadMsg, setUploadMsg] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  React.useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        const listUrl = getEnv('VITE_SUPABASE_LIST_JOBS_URL');
        const anonKey = getEnv('VITE_SUPABASE_ANON_KEY');
        if (!listUrl) throw new Error('Missing VITE_SUPABASE_LIST_JOBS_URL');
        if (!anonKey) throw new Error('Missing VITE_SUPABASE_ANON_KEY');
        const res = await fetch(listUrl, { headers: { Authorization: `Bearer ${anonKey}` } });
        if (!res.ok) throw new Error(`Failed to load jobs (${res.status})`);
        const data = await res.json();
        setJobs(Array.isArray(data?.jobs) ? data.jobs : []);
      } catch (e: any) {
        setError(e?.message || 'Failed to load jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) {
      setError('Please select a job to apply for.');
      return;
    }
    try {
      setSubmitting(true);
      setError(null);
      const applyUrl = getEnv('VITE_SUPABASE_APPLY_JOB_URL');
      const anonKey = getEnv('VITE_SUPABASE_ANON_KEY');
      if (!applyUrl) throw new Error('Missing VITE_SUPABASE_APPLY_JOB_URL');
      if (!anonKey) throw new Error('Missing VITE_SUPABASE_ANON_KEY');
      const res = await fetch(applyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${anonKey}`,
        },
        body: JSON.stringify({ job_id: selectedJob, name, email, resume_url: resumeUrl || null, message: message || null }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || `Failed to submit (${res.status})`);
      }
      setSubmitted(true);
      setName('');
      setEmail('');
      setResumeUrl('');
      setMessage('');
      setTimeout(() => setSubmitted(false), 3000);
    } catch (e: any) {
      setError(e?.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      <header className="pt-20 pb-8 px-4 bg-gradient-to-r from-sky-blue-600 to-sky-blue-700 text-white">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h1 {...fadeIn} className="text-3xl sm:text-4xl font-bold font-display tracking-wide">
            Join Skyrafi
          </motion.h1>
          <motion.p {...fadeIn} className="mt-4 text-sky-blue-100 text-base sm:text-lg">
            We're building the starting point to financial freedom. Help us ship it to millions.
          </motion.p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12 space-y-12">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
        <motion.section {...fadeIn} className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed">
            Debt is a massive drag on people's lives. Skyrafi uses AI to craft personalized payoff plans, real-time
            spending insights, and a clear wealth bridge from debt to savings. Join us to help millions rewrite their money story.
          </p>
        </motion.section>

        <motion.section {...fadeIn} className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Open Roles</h2>
          {loading ? (
            <p className="text-gray-600">Loading jobs…</p>
          ) : jobs.length === 0 ? (
            <p className="text-gray-600">No open roles at the moment. Check back soon!</p>
          ) : (
            <ul className="space-y-4">
              {jobs.map((job) => (
                <li key={job.id} className="flex items-start justify-between border rounded-xl p-4">
                  <div className="pr-4">
                    <p className="font-semibold text-gray-900">{job.title}</p>
                    <p className="text-sm text-gray-600">{job.location || 'Remote'} • {job.type || 'Full-time'}</p>
                  </div>
                  <button onClick={() => setSelectedJob(job.id)} className="text-sky-blue-600 font-semibold hover:underline">Apply</button>
                </li>
              ))}
            </ul>
          )}
        </motion.section>

        <motion.section {...fadeIn} className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">How to Apply</h2>
          <form onSubmit={handleApply} className="space-y-4" id="apply">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Role</label>
                <select
                  value={selectedJob ?? ''}
                  onChange={(e) => setSelectedJob(e.target.value || null)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-sky-blue-500 focus:ring-2 focus:ring-sky-blue-200 outline-none transition"
                  required
                >
                  <option value="" disabled>Select a role…</option>
                  {jobs.map((j) => (
                    <option key={j.id} value={j.id}>{j.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-sky-blue-500 focus:ring-2 focus:ring-sky-blue-200 outline-none transition" placeholder="Jane Doe" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-sky-blue-500 focus:ring-2 focus:ring-sky-blue-200 outline-none transition" placeholder="jane@example.com" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Resume URL (optional)</label>
                <input value={resumeUrl} onChange={(e) => setResumeUrl(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-sky-blue-500 focus:ring-2 focus:ring-sky-blue-200 outline-none transition mb-2" placeholder="https://link.to/resume.pdf or upload below" />
                <div className="flex items-center gap-3">
                  <label className="inline-block">
                    <span className="sr-only">Upload file</span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleResumeUpload(f);
                      }}
                      className="hidden"
                    />
                    <span className="cursor-pointer bg-white border-2 border-gray-300 text-gray-700 px-4 py-2 rounded-full hover:border-sky-blue-600 hover:text-sky-blue-600 transition text-sm">{uploading ? 'Uploading…' : 'Upload Resume'}</span>
                  </label>
                  {uploadMsg && <span className="text-green-600 text-sm">{uploadMsg}</span>}
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message (optional)</label>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-sky-blue-500 focus:ring-2 focus:ring-sky-blue-200 outline-none transition" rows={4} placeholder="A few words about why you want to join..." />
            </div>
            <button disabled={submitting} className="bg-sky-blue-600 text-white px-8 py-4 rounded-full hover:bg-sky-blue-700 transition font-semibold disabled:opacity-50">
              {submitting ? 'Submitting…' : 'Submit Application'}
            </button>
            {submitted && <p className="text-green-600 text-sm">Application submitted! We’ll be in touch.</p>}
          </form>
        </motion.section>
      </main>
    </div>
  );
};

export default Careers;
