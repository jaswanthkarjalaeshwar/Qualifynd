import React, { useState } from 'react';
import { 
  User, 
  Building2, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Mail,
  Phone,
  MapPin,
  Save,
  Upload,
  Eye,
  EyeOff,
  Key,
  Users,
  Settings as SettingsIcon,
  Trash2,
  Plus,
  Edit3,
  Check,
  X
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';

interface NotificationSettings {
  email_applications: boolean;
  email_comments: boolean;
  email_status_changes: boolean;
  push_applications: boolean;
  push_comments: boolean;
  push_status_changes: boolean;
}

interface TeamMember {
  id: string;
  full_name: string;
  email: string;
  role: string;
  department: string | null;
  is_active: boolean;
  last_login: string | null;
  created_at: string;
}

const Settings = () => {
  const { state } = useAppContext();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('recruiter');

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    full_name: state.currentUser.name,
    email: state.currentUser.email,
    phone: '',
    department: '',
    timezone: 'UTC'
  });

  // Company form state
  const [companyForm, setCompanyForm] = useState({
    name: 'Demo Company',
    logo_url: null,
    website: 'https://demo.company.com',
    description: 'A demonstration company for testing Qualifynd features',
    industry: 'Technology',
    size: '50-200 employees',
    location: 'San Francisco, CA'
  });

  // Notification settings
  const [notifications, setNotifications] = useState<NotificationSettings>({
    email_applications: true,
    email_comments: true,
    email_status_changes: false,
    push_applications: true,
    push_comments: false,
    push_status_changes: true
  });

  // Password change
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Mock team members
  const [teamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      full_name: state.currentUser.name,
      email: state.currentUser.email,
      role: state.currentUser.role,
      department: 'Human Resources',
      is_active: true,
      last_login: new Date().toISOString(),
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      full_name: 'John Smith',
      email: 'john.smith@demo.com',
      role: 'hiring_manager',
      department: 'Engineering',
      is_active: true,
      last_login: new Date(Date.now() - 86400000).toISOString(),
      created_at: new Date(Date.now() - 604800000).toISOString()
    },
    {
      id: '3',
      full_name: 'Emily Johnson',
      email: 'emily.johnson@demo.com',
      role: 'recruiter',
      department: 'Human Resources',
      is_active: false,
      last_login: new Date(Date.now() - 259200000).toISOString(),
      created_at: new Date(Date.now() - 1209600000).toISOString()
    }
  ]);

  const handleProfileUpdate = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      alert('Profile updated successfully!');
    }, 1000);
  };

  const handleCompanyUpdate = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      alert('Company settings updated successfully!');
    }, 1000);
  };

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setLoading(false);
      alert('Password changed successfully!');
    }, 1000);
  };

  const handleInviteTeamMember = async () => {
    if (!inviteEmail) return;

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setInviteEmail('');
      setInviteRole('recruiter');
      setLoading(false);
      alert('Team member invited successfully!');
    }, 1000);
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'company', name: 'Company', icon: Building2 },
    { id: 'team', name: 'Team', icon: Users },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'preferences', name: 'Preferences', icon: SettingsIcon }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileForm.full_name}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, full_name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  <input
                    type="text"
                    value={profileForm.department}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, department: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timezone
                  </label>
                  <select
                    value={profileForm.timezone}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, timezone: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  >
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Denver">Mountain Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <button
                onClick={handleProfileUpdate}
                disabled={loading}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        );

      case 'company':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={companyForm.name}
                    onChange={(e) => setCompanyForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    value={companyForm.website || ''}
                    onChange={(e) => setCompanyForm(prev => ({ ...prev, website: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industry
                  </label>
                  <select
                    value={companyForm.industry || ''}
                    onChange={(e) => setCompanyForm(prev => ({ ...prev, industry: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  >
                    <option value="">Select Industry</option>
                    <option value="technology">Technology</option>
                    <option value="finance">Finance</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="education">Education</option>
                    <option value="retail">Retail</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Size
                  </label>
                  <select
                    value={companyForm.size || ''}
                    onChange={(e) => setCompanyForm(prev => ({ ...prev, size: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  >
                    <option value="">Select Size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="501-1000">501-1000 employees</option>
                    <option value="1000+">1000+ employees</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={companyForm.location || ''}
                    onChange={(e) => setCompanyForm(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={companyForm.description || ''}
                    onChange={(e) => setCompanyForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <button
                onClick={handleCompanyUpdate}
                disabled={loading}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        );

      case 'team':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Members</h3>
              
              {/* Invite New Member */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h4 className="font-medium text-gray-900 mb-4">Invite Team Member</h4>
                <div className="flex space-x-4">
                  <input
                    type="email"
                    placeholder="Enter email address"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  />
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  >
                    <option value="recruiter">Recruiter</option>
                    <option value="hiring_manager">Hiring Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button
                    onClick={handleInviteTeamMember}
                    disabled={loading || !inviteEmail}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Invite
                  </button>
                </div>
              </div>

              {/* Team Members List */}
              <div className="space-y-4">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{member.full_name}</h4>
                        <p className="text-sm text-gray-600">{member.email}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 capitalize">
                            {member.role.replace('_', ' ')}
                          </span>
                          {member.department && (
                            <span className="text-xs text-gray-500">{member.department}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${member.is_active ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                      <span className="text-sm text-gray-600">
                        {member.is_active ? 'Active' : 'Inactive'}
                      </span>
                      {state.currentUser.role === 'admin' && member.id !== '1' && (
                        <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Email Notifications</h4>
                  <div className="space-y-4">
                    {Object.entries(notifications)
                      .filter(([key]) => key.startsWith('email_'))
                      .map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900 capitalize">
                              {key.replace('email_', '').replace('_', ' ')}
                            </p>
                            <p className="text-sm text-gray-600">
                              Receive email notifications for {key.replace('email_', '').replace('_', ' ')}
                            </p>
                          </div>
                          <button
                            onClick={() => setNotifications(prev => ({ ...prev, [key]: !value }))}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              value ? 'bg-orange-500' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                value ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Push Notifications</h4>
                  <div className="space-y-4">
                    {Object.entries(notifications)
                      .filter(([key]) => key.startsWith('push_'))
                      .map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900 capitalize">
                              {key.replace('push_', '').replace('_', ' ')}
                            </p>
                            <p className="text-sm text-gray-600">
                              Receive push notifications for {key.replace('push_', '').replace('_', ' ')}
                            </p>
                          </div>
                          <button
                            onClick={() => setNotifications(prev => ({ ...prev, [key]: !value }))}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              value ? 'bg-orange-500' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                value ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  />
                </div>
              </div>
              
              <div className="pt-6 border-t border-gray-200 mt-6">
                <button
                  onClick={handlePasswordChange}
                  disabled={loading || !passwordForm.currentPassword || !passwordForm.newPassword || passwordForm.newPassword !== passwordForm.confirmPassword}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                >
                  <Key className="w-4 h-4 mr-2" />
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </div>
          </div>
        );

      case 'preferences':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Auto-score applications</p>
                    <p className="text-sm text-gray-600">Automatically score new applications using resume parsing</p>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-orange-500 transition-colors">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6 transition-transform" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Email digest</p>
                    <p className="text-sm text-gray-600">Receive daily summary of new applications</p>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-orange-500 transition-colors">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6 transition-transform" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Smart recommendations</p>
                    <p className="text-sm text-gray-600">Get AI-powered candidate recommendations</p>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">
            Manage your account, company, and application preferences
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 border border-orange-200'
                      : 'text-gray-600 hover:bg-white hover:text-gray-900'
                  }`}
                >
                  <tab.icon className={`w-5 h-5 ${
                    activeTab === tab.id ? 'text-orange-600' : 'text-gray-400'
                  }`} />
                  <span className="font-medium">{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;