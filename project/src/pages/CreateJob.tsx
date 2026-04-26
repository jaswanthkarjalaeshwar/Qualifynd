import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Plus, 
  X,
  Briefcase,
  MapPin,
  Building2,
  Clock,
  Sparkles,
  FileText,
  Users,
  Target
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import type { JobPost } from '../context/AppContext';

const CreateJob = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();
  const [isPreview, setIsPreview] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    type: 'full-time' as const,
    description: '',
    responsibilities: [''],
    qualifications: [''],
    benefits: [''],
    keywords: [''],
    experienceLevel: 'Mid-level'
  });

  const steps = [
    { id: 1, name: 'Basic Info', icon: FileText },
    { id: 2, name: 'Description', icon: Briefcase },
    { id: 3, name: 'Requirements', icon: Target },
    { id: 4, name: 'Benefits', icon: Sparkles },
    { id: 5, name: 'Keywords', icon: Users }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: string, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field as keyof typeof prev].map((item: string, i: number) => 
        i === index ? value : item
      )
    }));
  };

  const addArrayItem = (field: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field as keyof typeof prev], '']
    }));
  };

  const removeArrayItem = (field: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field as keyof typeof prev].filter((_: string, i: number) => i !== index)
    }));
  };

  const handleSave = (status: 'draft' | 'active') => {
    const newJob: JobPost = {
      id: `job-${Date.now()}`,
      ...formData,
      status,
      createdAt: new Date(),
      createdBy: state.currentUser.id,
      applicantCount: 0,
      responsibilities: formData.responsibilities.filter(r => r.trim()),
      qualifications: formData.qualifications.filter(q => q.trim()),
      benefits: formData.benefits.filter(b => b.trim()),
      keywords: formData.keywords.filter(k => k.trim())
    };

    dispatch({ type: 'ADD_JOB', payload: newJob });
    navigate('/jobs');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g. Senior Software Engineer"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department *
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  placeholder="e.g. Engineering"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="e.g. San Francisco, CA / Remote"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                >
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience Level
                </label>
                <select
                  value={formData.experienceLevel}
                  onChange={(e) => handleInputChange('experienceLevel', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                >
                  <option value="Entry-level">Entry-level</option>
                  <option value="Mid-level">Mid-level</option>
                  <option value="Senior">Senior</option>
                  <option value="Executive">Executive</option>
                </select>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Provide a comprehensive overview of the role, your company culture, and what makes this opportunity exciting..."
              rows={8}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Responsibilities</h3>
              <div className="space-y-3">
                {formData.responsibilities.map((responsibility, index) => (
                  <div key={index} className="flex space-x-3">
                    <input
                      type="text"
                      value={responsibility}
                      onChange={(e) => handleArrayChange('responsibilities', index, e.target.value)}
                      placeholder="e.g. Design and develop scalable web applications"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    />
                    {formData.responsibilities.length > 1 && (
                      <button
                        onClick={() => removeArrayItem('responsibilities', index)}
                        className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => addArrayItem('responsibilities')}
                  className="inline-flex items-center px-4 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Responsibility
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Qualifications</h3>
              <div className="space-y-3">
                {formData.qualifications.map((qualification, index) => (
                  <div key={index} className="flex space-x-3">
                    <input
                      type="text"
                      value={qualification}
                      onChange={(e) => handleArrayChange('qualifications', index, e.target.value)}
                      placeholder="e.g. 5+ years of software development experience"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    />
                    {formData.qualifications.length > 1 && (
                      <button
                        onClick={() => removeArrayItem('qualifications', index)}
                        className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => addArrayItem('qualifications')}
                  className="inline-flex items-center px-4 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Qualification
                </button>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Benefits & Perks</h3>
            <div className="space-y-3">
              {formData.benefits.map((benefit, index) => (
                <div key={index} className="flex space-x-3">
                  <input
                    type="text"
                    value={benefit}
                    onChange={(e) => handleArrayChange('benefits', index, e.target.value)}
                    placeholder="e.g. Competitive salary and equity"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  />
                  {formData.benefits.length > 1 && (
                    <button
                      onClick={() => removeArrayItem('benefits', index)}
                      className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => addArrayItem('benefits')}
                className="inline-flex items-center px-4 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Benefit
              </button>
            </div>
          </div>
        );
      case 5:
        return (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Keywords for Resume Parsing</h3>
            <p className="text-sm text-gray-600 mb-6">
              Add keywords that will be used to automatically score applicant resumes and identify the best matches
            </p>
            <div className="space-y-3">
              {formData.keywords.map((keyword, index) => (
                <div key={index} className="flex space-x-3">
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => handleArrayChange('keywords', index, e.target.value)}
                    placeholder="e.g. React, Node.js, TypeScript"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  />
                  {formData.keywords.length > 1 && (
                    <button
                      onClick={() => removeArrayItem('keywords', index)}
                      className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => addArrayItem('keywords')}
                className="inline-flex items-center px-4 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Keyword
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderPreview = () => (
    <div className="bg-white rounded-2xl border border-gray-200 p-8 max-w-4xl mx-auto shadow-sm">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{formData.title}</h1>
        <div className="flex flex-wrap gap-4 text-gray-600">
          <div className="flex items-center">
            <Building2 className="w-4 h-4 mr-2" />
            {formData.department}
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            {formData.location}
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            {formData.type}
          </div>
          <div className="flex items-center">
            <Briefcase className="w-4 h-4 mr-2" />
            {formData.experienceLevel}
          </div>
        </div>
      </div>

      <div className="prose max-w-none">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">About the Role</h2>
        <p className="text-gray-700 mb-8 whitespace-pre-wrap">{formData.description}</p>

        {formData.responsibilities.filter(r => r.trim()).length > 0 && (
          <>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Responsibilities</h2>
            <ul className="list-disc list-inside mb-8 space-y-2">
              {formData.responsibilities.filter(r => r.trim()).map((responsibility, index) => (
                <li key={index} className="text-gray-700">{responsibility}</li>
              ))}
            </ul>
          </>
        )}

        {formData.qualifications.filter(q => q.trim()).length > 0 && (
          <>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Qualifications</h2>
            <ul className="list-disc list-inside mb-8 space-y-2">
              {formData.qualifications.filter(q => q.trim()).map((qualification, index) => (
                <li key={index} className="text-gray-700">{qualification}</li>
              ))}
            </ul>
          </>
        )}

        {formData.benefits.filter(b => b.trim()).length > 0 && (
          <>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Benefits</h2>
            <ul className="list-disc list-inside mb-8 space-y-2">
              {formData.benefits.filter(b => b.trim()).map((benefit, index) => (
                <li key={index} className="text-gray-700">{benefit}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/jobs')}
              className="p-2 text-gray-600 hover:bg-white hover:text-gray-900 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create Job</h1>
              <p className="text-gray-600 mt-1">
                Build your job posting with our step-by-step builder
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsPreview(!isPreview)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-white transition-colors"
            >
              <Eye className="w-4 h-4 mr-2" />
              {isPreview ? 'Edit' : 'Preview'}
            </button>
            <button
              onClick={() => handleSave('draft')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-white transition-colors"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </button>
            <button
              onClick={() => handleSave('active')}
              className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 font-medium shadow-lg"
            >
              Publish Job
            </button>
          </div>
        </div>

        {!isPreview && (
          <>
            {/* Step Navigation */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8 shadow-sm">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <button
                      onClick={() => setCurrentStep(step.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-colors ${
                        currentStep === step.id
                          ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <step.icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{step.name}</span>
                    </button>
                    {index < steps.length - 1 && (
                      <div className="w-8 h-px bg-gray-300 mx-2" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Step Content */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
              {renderStepContent()}
              
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  disabled={currentStep === 1}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </button>
                <button
                  onClick={() => setCurrentStep(Math.min(5, currentStep + 1))}
                  disabled={currentStep === 5}
                  className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                >
                  Next
                  <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                </button>
              </div>
            </div>
          </>
        )}

        {/* Preview Content */}
        {isPreview && renderPreview()}
      </div>
    </div>
  );
};

export default CreateJob;