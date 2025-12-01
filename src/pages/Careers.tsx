import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Upload, Check, Briefcase, MapPin, Clock, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { SUPABASE_LIST_JOBS_URL, SUPABASE_APPLY_JOB_URL, SUPABASE_UPLOAD_RESUME_URL, SUPABASE_ANON_KEY } from '../lib/constants';
import skyrafiLogo from '../assets/skyrafi-logo.png';

// Coolshapes for visual engagement
const coolShapes = [
  '/coolshapes-v1.0/Noise/SVG/CS_Star_1.svg',
  '/coolshapes-v1.0/Noise/SVG/CS_Flower_5.svg',
  '/coolshapes-v1.0/Noise/SVG/CS_Moon_7.svg',
  '/coolshapes-v1.0/Noise/SVG/CS_Ellipse_3.svg',
  '/coolshapes-v1.0/Noise/SVG/CS_Polygon_1.svg',
  '/coolshapes-v1.0/Noise/SVG/CS_Wheel_3.svg',
];

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
  // State
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        const listUrl = SUPABASE_LIST_JOBS_URL;
        const anonKey = SUPABASE_ANON_KEY;
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

  const handleResumeUpload = async (file: File) => {
    try {
      setUploading(true);
      setUploadMsg(null);
      const uploadUrl = SUPABASE_UPLOAD_RESUME_URL;
      const anonKey = SUPABASE_ANON_KEY;

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
      setUploadMsg(`Error: ${e?.message || 'Failed to upload resume'}`);
    } finally {
      setUploading(false);
      setTimeout(() => setUploadMsg(null), 3000);
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJobId) {
      setError('Please select a job to apply for.');
      return;
    }
    try {
      setSubmitting(true);
      setError(null);
      const applyUrl = SUPABASE_APPLY_JOB_URL;
      const anonKey = SUPABASE_ANON_KEY;
      const res = await fetch(applyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${anonKey}`,
        },
        body: JSON.stringify({ job_id: selectedJobId, name, email, resume_url: resumeUrl || null, message: message || null }),
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
      setTimeout(() => setSubmitted(false), 5000);
    } catch (e: any) {
      setError(e?.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  const scrollToApply = (jobId: string) => {
    setSelectedJobId(jobId);
    document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white overflow-x-hidden selection:bg-brand-blue selection:text-white">
      {/* Navigation Bar Placeholder (matching landing page style) */}
      <nav className="fixed top-0 w-full z-50 bg-[#0B0F19]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
             <a href="/" className="flex items-center">
                <img src={skyrafiLogo} alt="Skyrafi" className="h-8 w-auto brightness-0 invert" />
             </a>
             <a href="/" className="text-sm text-slate-400 hover:text-white transition">Back to Home</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-brand-blue/20 rounded-full blur-[120px] opacity-30"></div>
            {/* Decorative Shapes */}
            <motion.img 
              src={coolShapes[0]} 
              className="absolute top-20 right-[10%] w-24 h-24 opacity-20"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            <motion.img 
              src={coolShapes[2]} 
              className="absolute bottom-20 left-[10%] w-32 h-32 opacity-20"
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sky-400 text-sm font-medium mb-6 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                </span>
                We are hiring!
            </div>
            <h1 className="text-5xl sm:text-7xl font-black tracking-tight mb-6">
              Build the Future of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-cyan-400">
                Financial Freedom
              </span>
            </h1>
            <p className="mt-6 text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Join our mission to help millions of people crush debt, automate savings, and build wealth through AI-driven insights.
            </p>
          </motion.div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 pb-24 space-y-24 relative z-10">
        {/* Mission Section */}
        <section className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-blue/10 to-purple-500/10 blur-3xl opacity-20 rounded-full"></div>
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-8 sm:p-12 relative overflow-hidden"
            >
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                        <p className="text-lg text-slate-300 leading-relaxed mb-6">
                            Debt is a massive drag on people's lives. It stops them from dreaming, investing, and living freely.
                        </p>
                        <p className="text-lg text-slate-300 leading-relaxed">
                            Skyrafi uses AI to craft personalized payoff plans, real-time spending insights, and a clear wealth bridge from debt to savings. We're looking for passionate builders to help us rewrite the money story for millions.
                        </p>
                    </div>
                    <div className="relative flex justify-center items-center h-64">
                        <motion.img 
                            src={coolShapes[5]} 
                            className="w-48 h-48 opacity-80 drop-shadow-[0_0_30px_rgba(56,189,248,0.3)]"
                            animate={{ rotate: -360 }}
                            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                        />
                         <motion.img 
                            src={coolShapes[4]} 
                            className="absolute w-24 h-24 opacity-60"
                            animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.8, 0.6] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </div>
                </div>
            </motion.div>
        </section>

        {/* Open Roles */}
        <section id="jobs">
            <div className="flex items-center justify-between mb-12">
                <h2 className="text-3xl font-bold">Open Roles</h2>
                <div className="hidden sm:flex items-center gap-2 text-slate-400 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                    <Search className="w-4 h-4" />
                    <span className="text-sm">Search roles...</span>
                </div>
            </div>
            
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-8 h-8 border-4 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : jobs.length === 0 ? (
                 <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
                    <p className="text-slate-400 text-lg">No open roles at the moment. Check back soon!</p>
                 </div>
            ) : (
                <div className="grid gap-6">
                    {jobs.map((job) => (
                        <motion.div 
                            key={job.id}
                            layout
                            className={`bg-white/5 border ${expandedJobId === job.id ? 'border-brand-blue/50 bg-white/10' : 'border-white/10'} rounded-2xl overflow-hidden transition-all duration-300 hover:border-brand-blue/30`}
                        >
                            <div className="p-6 sm:p-8 cursor-pointer" onClick={() => setExpandedJobId(expandedJobId === job.id ? null : job.id)}>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-3">
                                            {job.title}
                                            {expandedJobId === job.id && <span className="text-xs bg-brand-blue text-white px-2 py-0.5 rounded-full">Viewing</span>}
                                        </h3>
                                        <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                                            <div className="flex items-center gap-1.5">
                                                <Briefcase className="w-4 h-4 text-brand-blue" />
                                                {job.type || 'Full-time'}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <MapPin className="w-4 h-4 text-brand-blue" />
                                                {job.location || 'Remote'}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="w-4 h-4 text-brand-blue" />
                                                Posted {new Date(job.created_at).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 mt-4 sm:mt-0">
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                scrollToApply(job.id);
                                            }}
                                            className="bg-white text-[#0B0F19] px-6 py-2 rounded-full font-bold text-sm hover:bg-slate-200 transition"
                                        >
                                            Apply Now
                                        </button>
                                        {expandedJobId === job.id ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
                                    </div>
                                </div>
                            </div>
                            
                            <AnimatePresence>
                                {expandedJobId === job.id && (
                                    <motion.div 
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="px-6 sm:px-8 pb-8 border-t border-white/5"
                                    >
                                        <div className="pt-6 text-slate-300 leading-relaxed space-y-4">
                                            {job.description ? (
                                                <div className="prose prose-invert max-w-none">
                                                    <p className="whitespace-pre-wrap">{job.description}</p>
                                                </div>
                                            ) : (
                                                <p className="italic text-slate-500">No detailed description available for this role.</p>
                                            )}
                                            
                                            <div className="pt-6">
                                                <button 
                                                    onClick={() => scrollToApply(job.id)}
                                                    className="flex items-center gap-2 text-brand-blue font-bold hover:text-sky-400 transition"
                                                >
                                                    Apply for this position <ArrowUpRight className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            )}
        </section>

        {/* Application Form */}
        <section id="apply-form" className="scroll-mt-24">
            <div className="bg-[#0B0F19] border border-white/10 rounded-3xl p-8 sm:p-12 relative overflow-hidden">
                 {/* Decorative blob */}
                 <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-brand-blue/10 rounded-full blur-[80px] pointer-events-none"></div>
                 
                 <div className="relative z-10 max-w-3xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Apply Now</h2>
                        <p className="text-slate-400">Ready to make an impact? We'd love to hear from you.</p>
                    </div>

                    {submitted ? (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-green-500/10 border border-green-500/20 rounded-2xl p-8 text-center"
                        >
                            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Check className="w-8 h-8 text-green-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Application Received!</h3>
                            <p className="text-slate-300">Thanks for applying. We'll review your info and be in touch soon.</p>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleApply} className="space-y-6">
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-400 text-sm">
                                    {error}
                                </div>
                            )}
                            
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-300">Select Role</label>
                                    <div className="relative">
                                        <select
                                            value={selectedJobId ?? ''}
                                            onChange={(e) => setSelectedJobId(e.target.value || null)}
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none transition text-white appearance-none cursor-pointer"
                                            required
                                        >
                                            <option value="" disabled className="bg-slate-900 text-slate-500">Select a role...</option>
                                            {jobs.map((j) => (
                                                <option key={j.id} value={j.id} className="bg-slate-900">{j.title}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-300">Full Name</label>
                                    <input 
                                        value={name} 
                                        onChange={(e) => setName(e.target.value)} 
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none transition text-white placeholder-slate-600" 
                                        placeholder="Jane Doe" 
                                        required 
                                    />
                                </div>
                                
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-300">Email Address</label>
                                    <input 
                                        type="email" 
                                        value={email} 
                                        onChange={(e) => setEmail(e.target.value)} 
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none transition text-white placeholder-slate-600" 
                                        placeholder="jane@example.com" 
                                        required 
                                    />
                                </div>
                                
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-300">Resume URL (Optional)</label>
                                    <input 
                                        value={resumeUrl} 
                                        onChange={(e) => setResumeUrl(e.target.value)} 
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none transition text-white placeholder-slate-600" 
                                        placeholder="https://linkedin.com/in/..." 
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-300">Upload Resume</label>
                                <div className="border-2 border-dashed border-white/10 rounded-xl p-6 hover:bg-white/5 transition cursor-pointer group">
                                    <label className="flex flex-col items-center justify-center cursor-pointer w-full h-full">
                                        <input
                                            type="file"
                                            accept=".pdf,.doc,.docx,.txt"
                                            onChange={(e) => {
                                                const f = e.target.files?.[0];
                                                if (f) handleResumeUpload(f);
                                            }}
                                            className="hidden"
                                        />
                                        {uploading ? (
                                            <div className="flex flex-col items-center">
                                                <div className="w-8 h-8 border-2 border-brand-blue border-t-transparent rounded-full animate-spin mb-2"></div>
                                                <span className="text-sm text-slate-400">Uploading...</span>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center">
                                                <Upload className="w-8 h-8 text-slate-500 group-hover:text-brand-blue transition mb-2" />
                                                <span className="text-sm font-medium text-slate-300 group-hover:text-white transition">Click to upload or drag and drop</span>
                                                <span className="text-xs text-slate-500 mt-1">PDF, DOC, DOCX up to 5MB</span>
                                            </div>
                                        )}
                                        {uploadMsg && <span className="text-green-400 text-sm mt-2 flex items-center gap-1"><Check className="w-3 h-3" /> {uploadMsg}</span>}
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-300">Message (Optional)</label>
                                <textarea 
                                    value={message} 
                                    onChange={(e) => setMessage(e.target.value)} 
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none transition text-white placeholder-slate-600 min-h-[120px]" 
                                    placeholder="Tell us a bit about yourself and why you'd be a great fit..." 
                                />
                            </div>

                            <button 
                                disabled={submitting} 
                                className="w-full bg-brand-blue text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-sky-600 transition shadow-lg shadow-brand-blue/20 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? 'Submitting Application...' : 'Submit Application'}
                            </button>
                        </form>
                    )}
                 </div>
            </div>
        </section>
      </main>
    </div>
  );
};

export default Careers;
