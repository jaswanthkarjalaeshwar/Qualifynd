import React, { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  Briefcase, 
  Clock, 
  Target,
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart,
  Activity,
  Award,
  Eye,
  MessageSquare
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart as RechartsPieChart, 
  Pie,
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { useAppContext } from '../context/AppContext';

const Analytics = () => {
  const { state } = useAppContext();
  const [dateRange, setDateRange] = useState('30');
  const [selectedMetric, setSelectedMetric] = useState('applications');

  // Calculate real bucket distribution from applicants
  const bucketCounts = {
    yes: state.applicants.filter(app => app.bucket === 'yes').length,
    maybe: state.applicants.filter(app => app.bucket === 'maybe').length,
    no: state.applicants.filter(app => app.bucket === 'no').length,
    pending: state.applicants.filter(app => app.bucket === 'pending').length
  };

  const bucketDistributionData = [
    { name: 'Yes', value: bucketCounts.yes, color: '#10b981' },
    { name: 'Maybe', value: bucketCounts.maybe, color: '#f59e0b' },
    { name: 'No', value: bucketCounts.no, color: '#ef4444' },
    { name: 'Pending', value: bucketCounts.pending, color: '#6b7280' },
  ];

  // Sample data for charts
  const applicationTrendData = [
    { date: '2024-01-15', applications: 12, interviews: 4, hires: 1 },
    { date: '2024-01-16', applications: 15, interviews: 6, hires: 2 },
    { date: '2024-01-17', applications: 8, interviews: 3, hires: 0 },
    { date: '2024-01-18', applications: 22, interviews: 8, hires: 3 },
    { date: '2024-01-19', applications: 18, interviews: 7, hires: 2 },
    { date: '2024-01-20', applications: 25, interviews: 10, hires: 4 },
    { date: '2024-01-21', applications: 20, interviews: 9, hires: 3 },
  ];

  const jobPerformanceData = state.jobs.map(job => ({
    job: job.title,
    applications: job.applicantCount,
    avgScore: job.applicantCount > 0 ? 
      Math.round(state.applicants
        .filter(app => app.jobId === job.id)
        .reduce((sum, app) => sum + app.overallScore, 0) / 
        state.applicants.filter(app => app.jobId === job.id).length) : 0,
    hires: state.applicants.filter(app => app.jobId === job.id && app.stage === 'hired').length
  }));

  const sourceData = [
    { source: 'LinkedIn', applications: 45, percentage: 35 },
    { source: 'Company Website', applications: 32, percentage: 25 },
    { source: 'Indeed', applications: 28, percentage: 22 },
    { source: 'Referrals', applications: 15, percentage: 12 },
    { source: 'Other', applications: 8, percentage: 6 },
  ];

  const totalApplicants = state.applicants.length;
  const activeJobs = state.jobs.filter(job => job.status === 'active').length;
  const avgScore = totalApplicants > 0 
    ? Math.round(state.applicants.reduce((sum, app) => sum + app.overallScore, 0) / totalApplicants)
    : 0;
  const topPerformers = state.applicants.filter(app => app.overallScore >= 80).length;

  // Stage distribution
  const stageData = [
    { stage: 'Applied', count: state.applicants.filter(app => app.stage === 'applied').length },
    { stage: 'Screening', count: state.applicants.filter(app => app.stage === 'screening').length },
    { stage: 'Interview', count: state.applicants.filter(app => app.stage === 'interview').length },
    { stage: 'Final', count: state.applicants.filter(app => app.stage === 'final').length },
    { stage: 'Hired', count: state.applicants.filter(app => app.stage === 'hired').length },
    { stage: 'Rejected', count: state.applicants.filter(app => app.stage === 'rejected').length },
  ];

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600 mt-2">
              Track your recruitment performance and insights
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-white transition-colors">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{totalApplicants}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <TrendingUp className="w-4 h-4 text-emerald-600 mr-1" />
              <span className="text-emerald-600 font-medium">+12%</span>
              <span className="text-gray-500 ml-1">from last week</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{activeJobs}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <Eye className="w-4 h-4 text-gray-500 mr-1" />
              <span className="text-gray-900 font-medium">1,247</span>
              <span className="text-gray-500 ml-1">total views</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Candidate Score</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{avgScore}/100</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <Target className="w-4 h-4 text-emerald-600 mr-1" />
              <span className="text-emerald-600 font-medium">{topPerformers}</span>
              <span className="text-gray-500 ml-1">top performers</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Time to Hire</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">16 days</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <TrendingUp className="w-4 h-4 text-emerald-600 mr-1 rotate-180" />
              <span className="text-emerald-600 font-medium">-3 days</span>
              <span className="text-gray-500 ml-1">improvement</span>
            </div>
          </div>
        </div>

        {/* Bucket Distribution Summary */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Candidate Bucket Distribution</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Target className="w-8 h-8 text-emerald-600" />
              </div>
              <p className="text-3xl font-bold text-emerald-600">{bucketCounts.yes}</p>
              <p className="text-sm text-gray-600">Yes Bucket</p>
              <p className="text-xs text-gray-500 mt-1">Strong candidates</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Clock className="w-8 h-8 text-amber-600" />
              </div>
              <p className="text-3xl font-bold text-amber-600">{bucketCounts.maybe}</p>
              <p className="text-sm text-gray-600">Maybe Bucket</p>
              <p className="text-xs text-gray-500 mt-1">Under review</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Users className="w-8 h-8 text-red-600" />
              </div>
              <p className="text-3xl font-bold text-red-600">{bucketCounts.no}</p>
              <p className="text-sm text-gray-600">No Bucket</p>
              <p className="text-xs text-gray-500 mt-1">Not a fit</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Eye className="w-8 h-8 text-gray-600" />
              </div>
              <p className="text-3xl font-bold text-gray-600">{bucketCounts.pending}</p>
              <p className="text-sm text-gray-600">Pending Review</p>
              <p className="text-xs text-gray-500 mt-1">Awaiting review</p>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Application Trends */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Application Trends</h3>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                  <BarChart3 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={applicationTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis 
                  dataKey="date" 
                  stroke="#6b7280"
                  fontSize={12}
                  tickFormatter={(value) => format(new Date(value), 'MMM dd')}
                />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="applications" 
                  stroke="#f28a39" 
                  fill="#f28a39" 
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
                <Area 
                  type="monotone" 
                  dataKey="interviews" 
                  stroke="#10b981" 
                  fill="#10b981" 
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Job Performance */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Job Performance</h3>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                <Activity className="w-4 h-4" />
              </button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={jobPerformanceData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis type="number" stroke="#6b7280" fontSize={12} />
                <YAxis 
                  type="category" 
                  dataKey="job" 
                  stroke="#6b7280" 
                  fontSize={12}
                  width={120}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="applications" fill="#f28a39" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Bucket Distribution Pie Chart */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Candidate Buckets</h3>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                <PieChart className="w-4 h-4" />
              </button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={bucketDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {bucketDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>

          {/* Stage Distribution */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recruitment Stages</h3>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                <Filter className="w-4 h-4" />
              </button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis 
                  dataKey="stage" 
                  stroke="#6b7280" 
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="count" fill="#f28a39" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Application Sources */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Application Sources</h3>
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            {sourceData.map((source, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-900">{source.source}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full" 
                      style={{ width: `${source.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">{source.applications}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Metrics */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Recruitment Funnel</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{totalApplicants}</p>
              <p className="text-sm text-gray-600">Applications</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Eye className="w-8 h-8 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{state.applicants.filter(app => app.stage !== 'applied').length}</p>
              <p className="text-sm text-gray-600">Reviewed</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="w-8 h-8 text-orange-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{state.applicants.filter(app => ['interview', 'final'].includes(app.stage)).length}</p>
              <p className="text-sm text-gray-600">Interviewed</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Target className="w-8 h-8 text-emerald-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{state.applicants.filter(app => app.stage === 'final').length}</p>
              <p className="text-sm text-gray-600">Final Round</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Award className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{state.applicants.filter(app => app.stage === 'hired').length}</p>
              <p className="text-sm text-gray-600">Hired</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;