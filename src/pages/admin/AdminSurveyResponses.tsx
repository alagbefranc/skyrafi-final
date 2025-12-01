import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import AdminLayout from '../../components/admin/AdminLayout';
import { Eye, Download, ChevronDown, ChevronUp, Calendar, Mail, MessageSquare } from 'lucide-react';

interface SurveyResponse {
  id: string;
  created_at: string;
  email: string | null;
  responses: Record<string, any>;
}

const questionLabels: Record<string, string> = {
  q1: 'Uses money management app?',
  q2: 'Current budgeting app',
  q3: 'Desired feature in current tool',
  q4: 'How they track spending',
  q5: 'Reason for not using money tool',
  q6: 'What would make them try an app',
  q7: 'How often they check finances',
  q8: 'Confidence managing money (1-10)',
  q9: 'Biggest budgeting challenges',
  q10: 'Past app frustrations',
  q11: 'Important financial goals',
  q12: 'Motivation level',
  q13: 'Most useful features (top 3)',
  q14: 'Bank connection preference',
  q15: 'Visual design importance',
  q16: 'Willingness to pay',
  q17: 'What builds trust',
  q18: 'Must-have feature'
};

const AdminSurveyResponses: React.FC = () => {
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const fetchResponses = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: userData } = await supabase.auth.getUser();
      setUserEmail(userData.user?.email ?? null);

      const { data, error: fetchError } = await supabase
        .from('survey_responses')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setResponses(data || []);
    } catch (e: any) {
      setError(e?.message || 'Failed to load survey responses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResponses();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAnswer = (answer: any): string => {
    if (Array.isArray(answer)) {
      return answer.join(', ');
    }
    return String(answer);
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Email', 'Date', ...Object.keys(questionLabels).map(k => questionLabels[k])];
    const rows = responses.map(r => [
      r.id,
      r.email || 'N/A',
      formatDate(r.created_at),
      ...Object.keys(questionLabels).map(k => formatAnswer(r.responses[k] || 'N/A'))
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `survey_responses_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const getResponseCount = (response: SurveyResponse) => {
    return Object.keys(response.responses).length;
  };

  return (
    <AdminLayout currentPage="survey" userEmail={userEmail ?? undefined}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Survey Responses</h1>
            <p className="text-slate-500 mt-1">View and analyze user survey feedback</p>
          </div>
          <button
            onClick={exportToCSV}
            disabled={responses.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Responses</p>
                <p className="text-2xl font-bold text-slate-900">{responses.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">With Email</p>
                <p className="text-2xl font-bold text-slate-900">
                  {responses.filter(r => r.email).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">This Week</p>
                <p className="text-2xl font-bold text-slate-900">
                  {responses.filter(r => {
                    const date = new Date(r.created_at);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return date >= weekAgo;
                  }).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-slate-300 border-t-slate-600 rounded-full mx-auto"></div>
            <p className="text-slate-500 mt-4">Loading responses...</p>
          </div>
        ) : responses.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No responses yet</h3>
            <p className="text-slate-500">Survey responses will appear here once users complete the survey.</p>
          </div>
        ) : (
          /* Responses Table */
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Questions Answered
                    </th>
                    <th className="text-right px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {responses.map((response) => (
                    <React.Fragment key={response.id}>
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {formatDate(response.created_at)}
                        </td>
                        <td className="px-6 py-4">
                          {response.email ? (
                            <span className="text-sm text-slate-900">{response.email}</span>
                          ) : (
                            <span className="text-sm text-slate-400 italic">No email provided</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                            {getResponseCount(response)} answers
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => setExpandedRow(expandedRow === response.id ? null : response.id)}
                            className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900 transition"
                          >
                            <Eye className="w-4 h-4" />
                            {expandedRow === response.id ? 'Hide' : 'View'}
                            {expandedRow === response.id ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        </td>
                      </tr>
                      {expandedRow === response.id && (
                        <tr>
                          <td colSpan={4} className="px-6 py-6 bg-slate-50">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {Object.entries(response.responses).map(([key, value]) => (
                                <div key={key} className="bg-white rounded-lg p-4 border border-slate-200">
                                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                                    {questionLabels[key] || key}
                                  </p>
                                  <p className="text-sm text-slate-900">
                                    {formatAnswer(value)}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminSurveyResponses;
