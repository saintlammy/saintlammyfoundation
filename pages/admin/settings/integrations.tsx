import React, { useState } from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Mail,
  MessageSquare,
  Calendar,
  BarChart3,
  Cloud,
  Database,
  Webhook,
  Settings,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Plus,
  Edit
} from 'lucide-react';

const IntegrationsManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('connected');

  const connectedIntegrations = [
    {
      id: 'mailchimp',
      name: 'Mailchimp',
      icon: Mail,
      category: 'Email Marketing',
      status: 'connected',
      description: 'Newsletter and email campaign management',
      lastSync: '2 hours ago',
      color: 'text-yellow-500 dark:text-yellow-400',
      bgColor: 'bg-yellow-500/20 dark:bg-yellow-500/20'
    },
    {
      id: 'google-analytics',
      name: 'Google Analytics',
      icon: BarChart3,
      category: 'Analytics',
      status: 'connected',
      description: 'Website traffic and user behavior tracking',
      lastSync: '15 minutes ago',
      color: 'text-blue-500 dark:text-blue-400',
      bgColor: 'bg-blue-500/20 dark:bg-blue-500/20'
    },
    {
      id: 'supabase',
      name: 'Supabase',
      icon: Database,
      category: 'Database',
      status: 'connected',
      description: 'Primary database and authentication service',
      lastSync: 'Real-time',
      color: 'text-green-500 dark:text-green-400',
      bgColor: 'bg-green-500/20 dark:bg-green-500/20'
    }
  ];

  const availableIntegrations = [
    {
      id: 'slack',
      name: 'Slack',
      icon: MessageSquare,
      category: 'Communication',
      description: 'Team notifications and alerts',
      color: 'text-purple-500 dark:text-purple-400',
      bgColor: 'bg-purple-500/20 dark:bg-purple-500/20'
    },
    {
      id: 'google-drive',
      name: 'Google Drive',
      icon: Cloud,
      category: 'Storage',
      description: 'Document and file storage',
      color: 'text-blue-500 dark:text-blue-400',
      bgColor: 'bg-blue-500/20 dark:bg-blue-500/20'
    },
    {
      id: 'calendly',
      name: 'Calendly',
      icon: Calendar,
      category: 'Scheduling',
      description: 'Meeting and event scheduling',
      color: 'text-indigo-500 dark:text-indigo-400',
      bgColor: 'bg-indigo-500/20 dark:bg-indigo-500/20'
    },
    {
      id: 'zapier',
      name: 'Zapier',
      icon: Webhook,
      category: 'Automation',
      description: 'Workflow automation and webhooks',
      color: 'text-orange-500 dark:text-orange-400',
      bgColor: 'bg-orange-500/20 dark:bg-orange-500/20'
    }
  ];

  const stats = [
    {
      title: 'Connected Services',
      value: connectedIntegrations.length.toString(),
      icon: CheckCircle,
      color: 'text-green-500 dark:text-green-400'
    },
    {
      title: 'Available Integrations',
      value: availableIntegrations.length.toString(),
      icon: Plus,
      color: 'text-blue-500 dark:text-blue-400'
    },
    {
      title: 'Active Webhooks',
      value: '5',
      icon: Webhook,
      color: 'text-purple-500 dark:text-purple-400'
    },
    {
      title: 'API Calls Today',
      value: '2,341',
      icon: BarChart3,
      color: 'text-yellow-500 dark:text-yellow-400'
    }
  ];

  return (
    <>
      <Head>
        <title>Integrations Management - Admin Dashboard</title>
        <meta name="description" content="Manage third-party integrations and API connections" />
      </Head>

      <AdminLayout title="Integrations Management">
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">{stat.title}</p>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="bg-gray-800 rounded-xl border border-gray-700">
            <div className="border-b border-gray-700">
              <div className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('connected')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'connected'
                      ? 'border-accent-500 text-accent-600 dark:text-accent-400'
                      : 'border-transparent text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Connected ({connectedIntegrations.length})
                </button>
                <button
                  onClick={() => setActiveTab('available')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'available'
                      ? 'border-accent-500 text-accent-600 dark:text-accent-400'
                      : 'border-transparent text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Available ({availableIntegrations.length})
                </button>
                <button
                  onClick={() => setActiveTab('webhooks')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'webhooks'
                      ? 'border-accent-500 text-accent-600 dark:text-accent-400'
                      : 'border-transparent text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Webhooks
                </button>
              </div>
            </div>

            <div className="p-6">
              {activeTab === 'connected' && (
                <div className="space-y-4">
                  {connectedIntegrations.map((integration) => {
                    const Icon = integration.icon;
                    return (
                      <div key={integration.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-lg ${integration.bgColor} flex items-center justify-center`}>
                            <Icon className={`w-6 h-6 ${integration.color}`} />
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-white">{integration.name}</h3>
                            <p className="text-sm text-gray-400">{integration.description}</p>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-xs text-gray-400">{integration.category}</span>
                              <span className="text-xs text-gray-400">Last sync: {integration.lastSync}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="flex items-center space-x-1 px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">
                            <CheckCircle className="w-3 h-3" />
                            <span>Connected</span>
                          </span>
                          <button className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                            <Settings className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                            <RefreshCw className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {activeTab === 'available' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableIntegrations.map((integration) => {
                    const Icon = integration.icon;
                    return (
                      <div key={integration.id} className="p-6 border border-gray-600 rounded-lg hover:border-gray-300 dark:hover:border-gray-500 transition-colors">
                        <div className="flex items-start space-x-4">
                          <div className={`w-12 h-12 rounded-lg ${integration.bgColor} flex items-center justify-center flex-shrink-0`}>
                            <Icon className={`w-6 h-6 ${integration.color}`} />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-medium text-white">{integration.name}</h3>
                            <p className="text-sm text-gray-400 mb-2">{integration.description}</p>
                            <span className="text-xs text-gray-400">{integration.category}</span>
                          </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                          <button className="bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                            Connect
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {activeTab === 'webhooks' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-white">Webhook Endpoints</h3>
                    <button className="bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center space-x-2">
                      <Plus className="w-4 h-4" />
                      <span>Add Webhook</span>
                    </button>
                  </div>
                  <div className="space-y-3">
                    {[
                      { name: 'Donation Received', url: 'https://api.saintlammyfoundation.org/webhooks/donation', events: ['donation.created', 'donation.completed'] },
                      { name: 'Volunteer Signup', url: 'https://api.saintlammyfoundation.org/webhooks/volunteer', events: ['volunteer.created'] },
                      { name: 'Contact Form', url: 'https://api.saintlammyfoundation.org/webhooks/contact', events: ['contact.submitted'] }
                    ].map((webhook, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                        <div>
                          <h4 className="font-medium text-white">{webhook.name}</h4>
                          <p className="text-sm text-gray-400 font-mono">{webhook.url}</p>
                          <div className="flex space-x-2 mt-1">
                            {webhook.events.map((event) => (
                              <span key={event} className="text-xs bg-gray-200 dark:bg-gray-600 text-gray-300 px-2 py-1 rounded">
                                {event}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="flex items-center space-x-1 px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">
                            <CheckCircle className="w-3 h-3" />
                            <span>Active</span>
                          </span>
                          <button className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* API Configuration */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-6">API Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  API Base URL
                </label>
                <input
                  type="url"
                  defaultValue="https://api.saintlammyfoundation.org"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Rate Limit (requests/minute)
                </label>
                <input
                  type="number"
                  defaultValue="100"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button className="bg-accent-500 hover:bg-accent-600 text-white px-6 py-2 rounded-lg transition-colors">
                Update Configuration
              </button>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default IntegrationsManagement;
