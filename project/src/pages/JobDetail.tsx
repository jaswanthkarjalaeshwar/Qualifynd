import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Users, 
  Filter, 
  Search,
  MoreVertical,
  Star,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Mail,
  Phone,
  Download,
  Eye,
  Calendar,
  TrendingUp,
  Award
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { state, dispatch } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBucket, setFilterBucket] = useState<string>('all');
  const [filterStage, setFilterStage] = useState<string>('all');
  const [selectedApplicants, setSelectedApplicants] = useState<string[]>([]);

  const job = state.jobs.find(j => j.id === id);
  const jobApplicants = state.applicants.filter(a => a.jobId === id);

  if (!job) {
    return <div>Job not found</div>;
  }

  const filteredApplicants = jobApplicants.filter(applicant => {
    const matchesSearch = applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         applicant.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBucket = filterBucket === 'all' || applicant.bucket === filterBucket;
    const matchesStage = filterStage === 'all' || applicant.stage === filterStage;
    return matchesSearch && matchesBucket && matchesStage;
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
        return <CheckCircle className="w-4 h-4" />;
      case 'maybe':
        return <AlertCircle className="w-4 h-4" />;
      case 'no':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'applied':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'screening':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'interview':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'final':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'hired':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'rejected':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const handleBucketUpdate = (applicantId: string, bucket: string) => {
    dispatch({
      type: 'UPDATE_APPLICANT',
      payload: {
        id: applicantId,
        updates: { bucket: bucket as any }
      }
    });
  };

  const handleBulkAction = (action: string) => {
    if (selectedApplicants.length === 0) return;

    switch (action) {
      case 'move-to-yes':
        dispatch({
          type: 'BULK_UPDATE_APPLICANTS',
          payload: {
            ids: selectedApplicants,
            updates: { bucket: 'yes' }
          }
        });
        break;
      case 'move-to-maybe':
        dispatch({
          type: 'BULK_UPDATE_APPLICANTS',
          payload: {
            ids: selectedApplicants,
            updates: { bucket: 'maybe' }
          }
        });
        break;
      case 'move-to-no':
        dispatch({
          type: 'BULK_UPDATE_APPLICANTS',
          payload: {
            ids: selectedApplicants,
            updates: { bucket: 'no' }
          }
        });
        break;
    }
    setSelectedApplicants([]);
  };

  const toggleApplicantSelection = (applicantId: string) => {
    setSelectedApplicants(prev => 
      prev.includes(applicantId)
        ? prev.filter(id => id !== applicantId)
        : [...prev, applicantId]
    );
  };

  const bucketCounts = {
    yes: jobApplicants.filter(a => a.bucket === 'yes').length,
    maybe: jobApplicants.filter(a => a.bucket === 'maybe').length,
    no: jobApplicants.filter(a => a.bucket === 'no').length,
    pending: jobApplicants.filter(a => a.bucket === 'pending').length
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link
              to="/jobs"
              className="p-2 text-gray-600 hover:bg-white hover:text-gray-900 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
              <p className="text-gray-600 mt-1">
                {job.department} • {job.location} • {jobApplicants.length} applicants
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`px-4 py-2 rounded-xl text-sm font-medium border ${
              job.status === 'active' 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : job.status === 'draft'
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-gray-50 text-gray-700 border-gray-200'
            }`}>
              {job.status}
            </span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Yes Bucket</p>
                <p className="text-3xl font-bold text-emerald-600 mt-1">{bucketCounts.yes}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <div className="flex items-center mt-3 text-sm text-emerald-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="font-medium">Strong candidates</span>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Maybe Bucket</p>
                <p className="text-3xl font-bold text-amber-600 mt-1">{bucketCounts.maybe}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <div className="flex items-center mt-3 text-sm text-amber-600">
              <Clock className="w-4 h-4 mr-1" />
              <span className="font-medium">Under review</span>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">No Bucket</p>
                <p className="text-3xl font-bold text-red-600 mt-1">{bucketCounts.no}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <div className="flex items-center mt-3 text-sm text-red-600">
              <XCircle className="w-4 h-4 mr-1" />
              <span className="font-medium">Not a fit</span>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Pending Review</p>
                <p className="text-3xl font-bold text-gray-600 mt-1">{bucketCounts.pending}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-gray-600" />
              </div>
            </div>
            <div className="flex items-center mt-3 text-sm text-gray-600">
              <Eye className="w-4 h-4 mr-1" />
              <span className="font-medium">Awaiting review</span>
            </div>
          </div>
        </div>

        {/* Filters and Bulk Actions */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search applicants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                />
              </div>
              <select
                value={filterBucket}
                onChange={(e) => setFilterBucket(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              >
                <option value="all">All Buckets</option>
                <option value="yes">Yes</option>
                <option value="maybe">Maybe</option>
                <option value="no">No</option>
                <option value="pending">Pending</option>
              </select>
              <select
                value={filterStage}
                onChange={(e) => setFilterStage(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              >
                <option value="all">All Stages</option>
                <option value="applied">Applied</option>
                <option value="screening">Screening</option>
                <option value="interview">Interview</option>
                <option value="final">Final</option>
                <option value="hired">Hired</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            
            {selectedApplicants.length > 0 && (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600 font-medium">
                  {selectedApplicants.length} selected
                </span>
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleBulkAction(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  className="px-4 py-3 border border-gray-300 rounded-xl text-sm transition-colors"
                >
                  <option value="">Bulk Actions</option>
                  <option value="move-to-yes">Move to Yes</option>
                  <option value="move-to-maybe">Move to Maybe</option>
                  <option value="move-to-no">Move to No</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Applicants List */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Applicants ({filteredApplicants.length})
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            {filteredApplicants.map((applicant) => (
              <div key={applicant.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    checked={selectedApplicants.includes(applicant.id)}
                    onChange={() => toggleApplicantSelection(applicant.id)}
                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                  
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-gray-600" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{applicant.name}</h3>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium border ${getBucketColor(applicant.bucket)}`}>
                          {getBucketIcon(applicant.bucket)}
                          <span className="ml-1 capitalize">{applicant.bucket}</span>
                        </span>
                        <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${getStageColor(applicant.stage)}`}>
                          {applicant.stage}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-600 mb-3">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-2" />
                        {applicant.email}
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2" />
                        {applicant.phone}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        Applied {new Date(applicant.appliedAt).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-2">
                        <Award className="w-4 h-4 text-orange-500" />
                        <span className="text-sm font-semibold text-gray-900">
                          {applicant.overallScore}/100
                        </span>
                        <span className="text-xs text-gray-500">
                          (Auto: {applicant.automaticScore} | Manual: {applicant.manualScore})
                        </span>
                      </div>
                      {applicant.comments.length > 0 && (
                        <div className="flex items-center text-gray-500">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          <span className="text-sm">{applicant.comments.length} comments</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleBucketUpdate(applicant.id, 'yes')}
                        className={`p-2 rounded-xl border transition-all duration-200 ${
                          applicant.bucket === 'yes'
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-700 shadow-sm'
                            : 'border-gray-300 text-gray-400 hover:text-emerald-600 hover:border-emerald-300 hover:bg-emerald-50'
                        }`}
                        title="Move to Yes"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleBucketUpdate(applicant.id, 'maybe')}
                        className={`p-2 rounded-xl border transition-all duration-200 ${
                          applicant.bucket === 'maybe'
                            ? 'bg-amber-50 border-amber-300 text-amber-700 shadow-sm'
                            : 'border-gray-300 text-gray-400 hover:text-amber-600 hover:border-amber-300 hover:bg-amber-50'
                        }`}
                        title="Move to Maybe"
                      >
                        <AlertCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleBucketUpdate(applicant.id, 'no')}
                        className={`p-2 rounded-xl border transition-all duration-200 ${
                          applicant.bucket === 'no'
                            ? 'bg-red-50 border-red-300 text-red-700 shadow-sm'
                            : 'border-gray-300 text-gray-400 hover:text-red-600 hover:border-red-300 hover:bg-red-50'
                        }`}
                        title="Move to No"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <Link
                      to={`/jobs/${job.id}/applicants/${applicant.id}`}
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 font-medium text-sm shadow-sm"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredApplicants.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No applicants found</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {searchTerm || filterBucket !== 'all' || filterStage !== 'all'
                  ? 'Try adjusting your search or filters to find what you\'re looking for'
                  : 'No applications have been received yet. Share your job posting to start attracting candidates.'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetail;