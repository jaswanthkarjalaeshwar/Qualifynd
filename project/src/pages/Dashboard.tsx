import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Briefcase, 
  Users, 
  Clock, 
  TrendingUp,
  ArrowUpRight,
  Eye,
  MessageSquare,
  Calendar,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Dashboard = () => {
  const { state } = useAppContext();
  
  const activeJobs = state.jobs.filter(job => job.status === 'active');
  const totalApplicants = state.applicants.length;
  const pendingReviews = state.applicants.filter(app => app.bucket === 'pending').length;
  const recentActivity = state.applicants
    .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
    .slice(0, 6);

  const getBucketIcon = (bucket: string) => {
    switch (bucket) {
      case 'yes':
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case 'maybe':
        return <AlertCircle className="w-4 h-4 text-amber-600" />;
      case 'no':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getBucketColor = (bucket: string) => {
    switch (bucket) {
      case 'yes':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'maybe':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'no':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {state.currentUser.name}
            </h1>
            <p className="text-gray-600 mt-2">
              Here's what's happening with your recruitment pipeline today.
            </p>
          </div>
          <Link
            to="/jobs/create"
            className="group inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-200" />
            Create Job
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{activeJobs.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <ArrowUpRight className="w-4 h-4 text-emerald-600 mr-1" />
              <span className="text-emerald-600 font-medium">+2</span>
              <span className="text-gray-500 ml-1">from last week</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Applicants</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{totalApplicants}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <ArrowUpRight className="w-4 h-4 text-emerald-600 mr-1" />
              <span className="text-emerald-600 font-medium">+15</span>
              <span className="text-gray-500 ml-1">from last week</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{pendingReviews}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <p className="text-sm text-amber-600 font-medium mt-4">Needs attention</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Time to Hire</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">16 days</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <ArrowUpRight className="w-4 h-4 text-emerald-600 mr-1 rotate-180" />
              <span className="text-emerald-600 font-medium">-3 days</span>
              <span className="text-gray-500 ml-1">from last month</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Jobs */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Active Jobs</h2>
                  <Link 
                    to="/jobs" 
                    className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center group"
                  >
                    View all
                    <ArrowUpRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {activeJobs.map((job) => (
                  <Link
                    key={job.id}
                    to={`/jobs/${job.id}`}
                    className="p-6 hover:bg-gray-50 transition-colors block group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                            {job.title}
                          </h3>
                          <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-medium">
                            {job.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          {job.department} • {job.location}
                        </p>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center text-sm text-gray-500">
                            <Users className="w-4 h-4 mr-1" />
                            {job.applicantCount} applicants
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(job.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <Eye className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {recentActivity.map((applicant) => {
                  const job = state.jobs.find(j => j.id === applicant.jobId);
                  return (
                    <div key={applicant.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                          <Users className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {applicant.name}
                            </p>
                            <div className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium border ${getBucketColor(applicant.bucket)}`}>
                              {getBucketIcon(applicant.bucket)}
                              <span className="ml-1 capitalize">{applicant.bucket}</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 truncate">
                            Applied for {job?.title}
                          </p>
                          <div className="flex items-center mt-2 text-xs text-gray-500">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(applicant.lastUpdated).toLocaleDateString()}
                            {applicant.comments.length > 0 && (
                              <>
                                <MessageSquare className="w-3 h-3 ml-3 mr-1" />
                                {applicant.comments.length} comments
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;