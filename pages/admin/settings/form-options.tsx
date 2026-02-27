import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Search,
  Filter,
  MessageSquare,
  Heart,
  Users,
  Calendar,
  DollarSign,
  CreditCard,
  Coins
} from 'lucide-react';

interface FormOption {
  id: string;
  title?: string;
  name?: string;
  code?: string;
  description?: string;
  icon?: string;
  is_active: boolean;
  sort_order: number;
  // Currency specific
  symbol?: string;
  is_crypto?: boolean;
  // Payment method specific
  slug?: string;
  supported_currencies?: string[];
  // Preset amount specific
  currency_code?: string;
  amount?: number;
  // Interest area specific
  category?: string;
}

type TabType = 'contact' | 'donation' | 'partnership' | 'volunteer';
type DonationSubTab = 'currencies' | 'payment-methods' | 'donation-types' | 'preset-amounts';
type PartnershipSubTab = 'org-types' | 'partnership-types' | 'timelines';
type VolunteerSubTab = 'availability' | 'interest-areas';

const FormOptionsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('contact');
  const [donationSubTab, setDonationSubTab] = useState<DonationSubTab>('currencies');
  const [partnershipSubTab, setPartnershipSubTab] = useState<PartnershipSubTab>('org-types');
  const [volunteerSubTab, setVolunteerSubTab] = useState<VolunteerSubTab>('availability');

  const [options, setOptions] = useState<FormOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOption, setEditingOption] = useState<Partial<FormOption> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch options based on current tab
  useEffect(() => {
    fetchOptions();
  }, [activeTab, donationSubTab, partnershipSubTab, volunteerSubTab, statusFilter]);

  const getCurrentEndpoint = (): string => {
    switch (activeTab) {
      case 'contact':
        return '/api/admin/form-options/contact-inquiry-types';
      case 'donation':
        return `/api/admin/form-options/donation-options?table=${getTableName(donationSubTab)}`;
      case 'partnership':
        return `/api/admin/form-options/partnership-options?table=${getTableName(partnershipSubTab)}`;
      case 'volunteer':
        return `/api/admin/form-options/partnership-options?table=${getTableName(volunteerSubTab)}`;
      default:
        return '';
    }
  };

  const getTableName = (subTab: string): string => {
    const tableMap: Record<string, string> = {
      'currencies': 'supported_currencies',
      'payment-methods': 'payment_methods',
      'donation-types': 'donation_types',
      'preset-amounts': 'donation_preset_amounts',
      'org-types': 'organization_types',
      'partnership-types': 'partnership_types',
      'timelines': 'partnership_timelines',
      'availability': 'volunteer_availability_options',
      'interest-areas': 'volunteer_interest_areas'
    };
    return tableMap[subTab] || '';
  };

  const fetchOptions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${getCurrentEndpoint()}${statusFilter !== 'all' ? `&status=${statusFilter}` : ''}`, {
        headers: {
          'Authorization': `Bearer ${user?.id || 'temp-token'}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setOptions(data);
      } else {
        console.error('Failed to fetch options');
      }
    } catch (error) {
      console.error('Error fetching options:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingOption({
      title: '',
      description: '',
      icon: '',
      is_active: true,
      sort_order: 0
    });
    setIsModalOpen(true);
  };

  const handleEdit = (option: FormOption) => {
    setEditingOption(option);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!editingOption) return;

    setIsSubmitting(true);
    try {
      const method = editingOption.id ? 'PUT' : 'POST';
      const url = editingOption.id
        ? `${getCurrentEndpoint()}?id=${editingOption.id}`
        : getCurrentEndpoint();

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.id || 'temp-token'}`
        },
        body: JSON.stringify(editingOption)
      });

      if (response.ok) {
        setIsModalOpen(false);
        setEditingOption(null);
        fetchOptions();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to save option');
      }
    } catch (error) {
      console.error('Error saving option:', error);
      alert('Failed to save option');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to deactivate this option?')) return;

    try {
      const response = await fetch(`${getCurrentEndpoint()}?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user?.id || 'temp-token'}`
        }
      });

      if (response.ok) {
        fetchOptions();
      } else {
        alert('Failed to delete option');
      }
    } catch (error) {
      console.error('Error deleting option:', error);
      alert('Failed to delete option');
    }
  };

  const filteredOptions = options.filter(option => {
    const matchesSearch = (option.title || option.name || option.code || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getFieldLabel = (): string => {
    if (activeTab === 'contact') return 'Inquiry Type';
    if (activeTab === 'donation') {
      if (donationSubTab === 'currencies') return 'Currency';
      if (donationSubTab === 'payment-methods') return 'Payment Method';
      if (donationSubTab === 'donation-types') return 'Donation Type';
      if (donationSubTab === 'preset-amounts') return 'Preset Amount';
    }
    if (activeTab === 'partnership') {
      if (partnershipSubTab === 'org-types') return 'Organization Type';
      if (partnershipSubTab === 'partnership-types') return 'Partnership Type';
      if (partnershipSubTab === 'timelines') return 'Timeline';
    }
    if (activeTab === 'volunteer') {
      if (volunteerSubTab === 'availability') return 'Availability Option';
      if (volunteerSubTab === 'interest-areas') return 'Interest Area';
    }
    return 'Option';
  };

  return (
    <AdminLayout title="Form Options">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Form Options Management</h1>
            <p className="text-gray-400 mt-1">Manage dropdown options for all website forms</p>
          </div>
        </div>

        {/* Main Tabs */}
        <div className="border-b border-gray-700">
          <nav className="flex space-x-8">
            {(['contact', 'donation', 'partnership', 'volunteer'] as TabType[]).map(tab => {
              const icons = {
                contact: MessageSquare,
                donation: Heart,
                partnership: Users,
                volunteer: Users
              };
              const Icon = icons[tab];

              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab
                      ? 'border-indigo-500 text-indigo-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {tab.charAt(0).toUpperCase() + tab.slice(1)} Form
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sub-tabs for Donation */}
        {activeTab === 'donation' && (
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex flex-wrap gap-2">
              {(['currencies', 'payment-methods', 'donation-types', 'preset-amounts'] as DonationSubTab[]).map(subTab => (
                <button
                  key={subTab}
                  onClick={() => setDonationSubTab(subTab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    donationSubTab === subTab
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {subTab.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sub-tabs for Partnership */}
        {activeTab === 'partnership' && (
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex flex-wrap gap-2">
              {(['org-types', 'partnership-types', 'timelines'] as PartnershipSubTab[]).map(subTab => (
                <button
                  key={subTab}
                  onClick={() => setPartnershipSubTab(subTab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    partnershipSubTab === subTab
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {subTab.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sub-tabs for Volunteer */}
        {activeTab === 'volunteer' && (
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex flex-wrap gap-2">
              {(['availability', 'interest-areas'] as VolunteerSubTab[]).map(subTab => (
                <button
                  key={subTab}
                  onClick={() => setVolunteerSubTab(subTab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    volunteerSubTab === subTab
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {subTab.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder={`Search ${getFieldLabel().toLowerCase()}s...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            <Plus className="h-5 w-5" />
            Add {getFieldLabel()}
          </button>
        </div>

        {/* Options Table */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    {donationSubTab === 'currencies' ? 'Code' : 'Title'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Sort Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                      Loading...
                    </td>
                  </tr>
                ) : filteredOptions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                      No {getFieldLabel().toLowerCase()}s found
                    </td>
                  </tr>
                ) : (
                  filteredOptions.map((option) => (
                    <tr key={option.id} className="hover:bg-gray-750">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {option.code || option.title || option.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {option.description || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {option.sort_order}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          option.is_active
                            ? 'bg-green-900 text-green-200'
                            : 'bg-red-900 text-red-200'
                        }`}>
                          {option.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(option)}
                          className="text-indigo-400 hover:text-indigo-300 mr-4"
                        >
                          <Edit className="h-4 w-4 inline" />
                        </button>
                        <button
                          onClick={() => handleDelete(option.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4 inline" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit/Create Modal */}
      {isModalOpen && editingOption && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">
                  {editingOption.id ? `Edit ${getFieldLabel()}` : `Add ${getFieldLabel()}`}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Title/Name field */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {donationSubTab === 'currencies' ? 'Code' : 'Title'} *
                  </label>
                  <input
                    type="text"
                    value={editingOption.title || editingOption.code || editingOption.name || ''}
                    onChange={(e) => setEditingOption({
                      ...editingOption,
                      ...(donationSubTab === 'currencies' ? { code: e.target.value } : { title: e.target.value })
                    })}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={editingOption.description || ''}
                    onChange={(e) => setEditingOption({ ...editingOption, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Icon (for applicable types) */}
                {activeTab === 'contact' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Icon Name (Lucide React)
                    </label>
                    <input
                      type="text"
                      value={editingOption.icon || ''}
                      onChange={(e) => setEditingOption({ ...editingOption, icon: e.target.value })}
                      placeholder="e.g., MessageSquare, Heart"
                      className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                )}

                {/* Sort Order */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={editingOption.sort_order || 0}
                    onChange={(e) => setEditingOption({ ...editingOption, sort_order: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Active Status */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={editingOption.is_active || false}
                    onChange={(e) => setEditingOption({ ...editingOption, is_active: e.target.checked })}
                    className="w-4 h-4 text-indigo-600 bg-gray-900 border-gray-700 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor="is_active" className="text-sm font-medium text-gray-300">
                    Active
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>Saving...</>
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      Save
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default FormOptionsPage;
