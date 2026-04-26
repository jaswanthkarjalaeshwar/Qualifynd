import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Download, 
  Star,
  MessageSquare,
  Send,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  ExternalLink,
  Award,
  FileText,
  Edit3,
  Save
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const ApplicantDetail = () => {
  const { jobId, applicantId } = useParams<{ jobId: string; applicantId: string }>();
  const { state, dispatch } = useAppContext();
  const [newComment, setNewComment] = useState('');
  const [manualScore, setManualScore] = useState('');
  const [isEditingScore, setIsEditingScore] = useState(false);

  const job = state.jobs.find(j => j.id === jobId);
  const applicant = state.applicants.find(a => a.id === applicantId);

  if (!job || !applicant) {
    return <div>Applicant not found</div>;
  }

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment = {
      id: `comment-${Date.now()}`,
      userId: state.currentUser.id,
      userName: state.currentUser.name,
      content: newComment,
      createdAt: new Date()
    };

    dispatch({
      type: 'ADD_COMMENT',
      payload: {
        applicantId: applicant.id,
        comment
      }
    });

    setNewComment('');
  };

  const handleScoreUpdate = () => {
    const score = parseInt(manualScore);
    if (isNaN(score) || score < 0 || score > 100) return;

    const overallScore = Math.round((applicant.automaticScore + score) / 2);

    dispatch({
      type: 'UPDATE_APPLICANT',
      payload: {
        id: applicant.id,
        updates: {
          manualScore: score,
          overallScore
        }
      }
    });

    setManualScore('');
    setIsEditingScore(false);
  };

  const handleBucketUpdate = (bucket: string) => {
    dispatch({
      type: 'UPDATE_APPLICANT',
      payload: {
        id: applicant.id,
        updates: { bucket: bucket as any }
      }
    });
  };

  const handleStageUpdate = (stage: string) => {
    dispatch({
      type: 'UPDATE_APPLICANT',
      payload: {
        id: applicant.id,
        updates: { stage: stage as any }
      }
    });
  };

  const getBucketColor = (bucket: string) => {
    switch (bucket) {
      case 'yes':
        return 'bg-emerald-50 text-emerald-700 border-emerald-300';
      case 'maybe':
        return 'bg-amber-50 text-amber-700 border-amber-300';
      case 'no':
        return 'bg-red-50 text-red-700 border-red-300';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-300';
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

  const generateInterviewLink = () => {
    const meetingId = Math.random().toString(36).substring(7);
    const meetingLink = `https://meet.google.com/${meetingId}`;
    
    const emailSubject = encodeURIComponent(`Interview Invitation - ${job.title}`);
    const emailBody = encodeURIComponent(`Dear ${applicant.name},

Thank you for your application for the ${job.title} position at our company. We would like to invite you for a screening interview.

Please join us at the following link:
${meetingLink}

We look forward to speaking with you.

Best regards,
${state.currentUser.name}`);

    const mailtoLink = `mailto:${applicant.email}?subject=${emailSubject}&body=${emailBody}`;
    window.open(mailtoLink);
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link
              to={`/jobs/${jobId}`}
              className="p-2 text-gray-600 hover:bg-white hover:text-gray-900 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{applicant.name}</h1>
              <p className="text-gray-600 mt-1">
                Applied for {job.title} • {new Date(applicant.appliedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={generateInterviewLink}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 font-medium shadow-lg"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Generate Interview Invite
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                    <User className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Name</p>
                    <p className="font-semibold text-gray-900">{applicant.name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Email</p>
                    <a 
                      href={`mailto:${applicant.email}`}
                      className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      {applicant.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                    <Phone className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Phone</p>
                    <a 
                      href={`tel:${applicant.phone}`}
                      className="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                    >
                      {applicant.phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Resume */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Resume</h2>
                <button className="inline-flex items-center px-4 py-2 text-sm text-orange-600 hover:text-orange-700 font-medium hover:bg-orange-50 rounded-xl transition-colors">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </button>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                <div className="flex items-center space-x-3 mb-4">
                  <FileText className="w-8 h-8 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">{applicant.name}_Resume.pdf</p>
                    <p className="text-sm text-gray-600">PDF Document • 2.4 MB</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">
                  Resume file would be displayed here. In a real implementation, this would show the actual resume content or a PDF viewer with highlighting of matched keywords.
                </p>
              </div>
            </div>

            {/* Cover Letter */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Cover Letter</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{applicant.coverLetter}</p>
              </div>
            </div>

            {/* Custom Application Answers */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Application Answers</h2>
              <div className="space-y-6">
                {Object.entries(applicant.customAnswers).map(([question, answer]) => (
                  <div key={question} className="border-l-4 border-orange-200 pl-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{question}</h3>
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{answer}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Comments */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Comments ({applicant.comments.length})
              </h2>
              
              {/* Add Comment */}
              <div className="mb-8">
                <div className="flex space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment about this candidate..."
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none transition-colors"
                    />
                    <div className="flex justify-end mt-3">
                      <button
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm font-medium shadow-sm"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Add Comment
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-6">
                {applicant.comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="font-semibold text-gray-900">{comment.userName}</span>
                        <span className="text-sm text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              {applicant.comments.length === 0 && (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No comments yet. Be the first to add feedback about this candidate.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Scoring */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Scoring</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                  <span className="text-sm font-medium text-gray-700">Automatic Score</span>
                  <div className="flex items-center">
                    <Award className="w-4 h-4 text-blue-600 mr-2" />
                    <span className="font-bold text-blue-600">{applicant.automaticScore}/100</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
                  <span className="text-sm font-medium text-gray-700">Manual Score</span>
                  <div className="flex items-center">
                    <Award className="w-4 h-4 text-purple-600 mr-2" />
                    <span className="font-bold text-purple-600">{applicant.manualScore}/100</span>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl">
                    <span className="font-semibold text-gray-900">Overall Score</span>
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-orange-500 mr-2" />
                      <span className="text-xl font-bold text-orange-600">{applicant.overallScore}/100</span>
                    </div>
                  </div>
                </div>
                
                {/* Update Manual Score */}
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Update Manual Score
                    </label>
                    {!isEditingScore && (
                      <button
                        onClick={() => setIsEditingScore(true)}
                        className="text-orange-600 hover:text-orange-700 p-1"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  {isEditingScore ? (
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={manualScore}
                        onChange={(e) => setManualScore(e.target.value)}
                        placeholder="0-100"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      />
                      <button
                        onClick={handleScoreUpdate}
                        disabled={!manualScore}
                        className="px-3 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600">Click the edit icon to update the manual score</p>
                  )}
                </div>
              </div>
            </div>

            {/* Bucket Status */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Bucket Status</h3>
              <div className="space-y-4">
                <div className={`flex items-center justify-between p-4 rounded-xl border ${getBucketColor(applicant.bucket)}`}>
                  <div className="flex items-center space-x-2">
                    {getBucketIcon(applicant.bucket)}
                    <span className="font-semibold capitalize">{applicant.bucket}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 pt-2">
                  <button
                    onClick={() => handleBucketUpdate('yes')}
                    className={`p-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
                      applicant.bucket === 'yes'
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-700 shadow-sm'
                        : 'border-gray-300 text-gray-600 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => handleBucketUpdate('maybe')}
                    className={`p-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
                      applicant.bucket === 'maybe'
                        ? 'bg-amber-50 border-amber-300 text-amber-700 shadow-sm'
                        : 'border-gray-300 text-gray-600 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700'
                    }`}
                  >
                    Maybe
                  </button>
                  <button
                    onClick={() => handleBucketUpdate('no')}
                    className={`p-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
                      applicant.bucket === 'no'
                        ? 'bg-red-50 border-red-300 text-red-700 shadow-sm'
                        : 'border-gray-300 text-gray-600 hover:bg-red-50 hover:border-red-300 hover:text-red-700'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>

            {/* Stage Management */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Stage</h3>
              <select
                value={applicant.stage}
                onChange={(e) => handleStageUpdate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              >
                <option value="applied">Applied</option>
                <option value="screening">Screening</option>
                <option value="interview">Interview</option>
                <option value="final">Final</option>
                <option value="hired">Hired</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Timeline</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-gray-900">Applied</p>
                    <p className="text-gray-500">{new Date(applicant.appliedAt).toLocaleDateString()}</p>
                  </div>
                </div>
                {applicant.lastUpdated.getTime() !== applicant.appliedAt.getTime() && (
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-gray-900">Last Updated</p>
                      <p className="text-gray-500">{new Date(applicant.lastUpdated).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantDetail;