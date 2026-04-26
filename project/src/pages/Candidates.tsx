import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Users, 
  Mail, 
  Phone, 
  MapPin,
  Calendar,
  Star,
  Eye,
  MessageSquare,
  Download,
  Plus,
  User,
  Briefcase,
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  TrendingUp,
  FileText,
  ExternalLink
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';

interface CandidateData {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  resume_url: string | null;
  linkedin_url: string | null;
  portfolio_url: string | null;
  years_experience: number | null;
  current_salary: number | null;
  expected_salary: number | null;
  location: string | null;
  skills: string[];
  applications: {
    id: string;
    job_title: string;
    status: string;
    bucket: string;
    overall_score: number;
    applied_at: string;
  }[];
  last_application: string;
  total_applications: number;
  avg_score: number;
}

const Candidates = () => {
  const { state } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterExperience, setFilterExperience] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');

  // Transform applicants data into candidates format
  const candidatesMap = new Map<string, CandidateData>();

  state.applicants.forEach((app) => {
    const candidateKey = `${app.email}-${app.name}`;
    const job = state.jobs.find(j => j.id === app.jobId);
    
    if (!candidatesMap.has(candidateKey)) {
      candidatesMap.set(candidateKey, {
        id: app.id,
        full_name: app.name,
        email: app.email,
        phone: app.phone,
        resume_url: app.resumeUrl,
        linkedin_url: null,
        portfolio_url: null,
        years_experience: null,
        current_salary: null,
        expected_salary: null,
        location: null,
        skills: [],
        applications: [],
        last_application: app.appliedAt.toISOString(),
        total_applications: 0,
        avg_score: 0
      });
    }

    const candidate = candidatesMap.get(candidateKey)!;
    candidate.applications.push({
      id: app.id,
      job_title: job?.title || 'Unknown Job',
      status: app.stage,
      bucket: app.bucket,
      overall_score: app.overallScore,
      applied_at: app.appliedAt.toISOString()
    });

    // Update stats
    candidate.total_applications = candidate.applications.length;
    candidate.avg_score = candidate.applications.reduce((sum, a) => sum + a.overall_score, 0) / candidate.applications.length;
    
    // Update last application date
    if (new Date(app.appliedAt) > new Date(candidate.last_application)) {
      candidate.last_application = app.appliedAt.toISOString();
    }
  });

  const candidates = Array.from(candidatesMap.values());

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesExperience = filterExperience === 'all' || 
      (filterExperience === 'entry' && (candidate.years_experience || 0) <= 2) ||
      (filterExperience === 'mid' && (candidate.years_experience || 0) > 2 && (candidate.years_experience || 0) <= 5) ||
      (filterExperience === 'senior' && (candidate.years_experience || 0) > 5);

    const matchesStatus = filterStatus === 'all' ||
      candidate.applications.some(app => app.status === filterStatus);

    return matchesSearch && matchesExperience && matchesStatus;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.last_application).getTime() - new Date(a.last_application).getTime();
      case 'score':
        return b.avg_score - a.avg_score;
      case 'name':
        return a.full_name.localeCompare(b.full_name);
      default:
        return 0;
    }
  });

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

  const getBucketIcon = (bucket: string) => {
    switch (bucket) {
      case 'yes':
        return <CheckCircle className="w-3 h-3" />;
      case 'maybe':
        return <AlertCircle className="w-3 h-3" />;
      case 'no':
        return <XCircle className="w-3 h-3" />;
      default:
        return <Clock className="w-3 h-3" />;
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Candidates</h1>
            <p className="text-gray-600 mt-2">
              Manage your talent pool and track candidate interactions
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-white transition-colors">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
            <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 font-medium shadow-lg">
              <Plus className="w-5 h-5 mr-2" />
              Add Candidate
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Candidates</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{candidates.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <TrendingUp className="w-4 h-4 text-emerald-600 mr-1" />
              <span className="text-emerald-600 font-medium">+12%</span>
              <span className="text-gray-500 ml-1">from last month</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Applications</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {candidates.reduce((sum, c) => sum + c.applications.filter(a => ['applied', 'screening', 'interview'].includes(a.status)).length, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <TrendingUp className="w-4 h-4 text-emerald-600 mr-1" />
              <span className="text-emerald-600 font-medium">+8%</span>
              <span className="text-gray-500 ml-1">from last week</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Score</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {candidates.length > 0 ? Math.round(candidates.reduce((sum, c) => sum + c.avg_score, 0) / candidates.length) : 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <TrendingUp className="w-4 h-4 text-emerald-600 mr-1" />
              <span className="text-emerald-600 font-medium">+5 pts</span>
              <span className="text-gray-500 ml-1">from last month</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Response Rate</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">78%</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <TrendingUp className="w-4 h-4 text-emerald-600 mr-1" />
              <span className="text-emerald-600 font-medium">+3%</span>
              <span className="text-gray-500 ml-1">from last month</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search candidates by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              />
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={filterExperience}
                onChange={(e) => setFilterExperience(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              >
                <option value="all">All Experience</option>
                <option value="entry">Entry Level (0-2 years)</option>
                <option value="mid">Mid Level (3-5 years)</option>
                <option value="senior">Senior Level (5+ years)</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              >
                <option value="all">All Status</option>
                <option value="applied">Applied</option>
                <option value="screening">Screening</option>
                <option value="interview">Interview</option>
                <option value="hired">Hired</option>
                <option value="rejected">Rejected</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              >
                <option value="recent">Most Recent</option>
                <option value="score">Highest Score</option>
                <option value="name">Name A-Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Candidates List */}
        <div className="space-y-4">
          {filteredCandidates.map((candidate) => (
            <div
              key={candidate.id}
              className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 hover:border-orange-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <User className="w-8 h-8 text-gray-600" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{candidate.full_name}</h3>
                      <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                          <Award className="w-3 h-3 mr-1" />
                          {Math.round(candidate.avg_score)}/100
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200">
                          {candidate.total_applications} applications
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-2" />
                        {candidate.email}
                      </div>
                      {candidate.phone && (
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-2" />
                          {candidate.phone}
                        </div>
                      )}
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        Last applied {new Date(candidate.last_application).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Recent Applications */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-900">Recent Applications</h4>
                      <div className="flex flex-wrap gap-2">
                        {candidate.applications.slice(0, 3).map((app) => (
                          <div
                            key={app.id}
                            className="inline-flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200"
                          >
                            <span className="text-sm font-medium text-gray-900">{app.job_title}</span>
                            <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${getBucketColor(app.bucket)}`}>
                              {getBucketIcon(app.bucket)}
                              <span className="ml-1 capitalize">{app.bucket}</span>
                            </div>
                          </div>
                        ))}
                        {candidate.applications.length > 3 && (
                          <span className="text-sm text-gray-500 px-3 py-2">
                            +{candidate.applications.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 flex-shrink-0">
                  {candidate.linkedin_url && (
                    <a
                      href={candidate.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View LinkedIn Profile"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  {candidate.resume_url && (
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  )}
                  <button className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 font-medium text-sm">
                    <Eye className="w-4 h-4 mr-2" />
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCandidates.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No candidates found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {searchTerm || filterExperience !== 'all' || filterStatus !== 'all'
                ? 'Try adjusting your search or filters to find what you\'re looking for'
                : 'Start receiving applications to build your candidate database'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Candidates;