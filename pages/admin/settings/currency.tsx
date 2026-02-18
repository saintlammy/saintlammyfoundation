import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  DollarSign,
  Save,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Edit,
  CheckCircle,
  AlertCircle,
  Globe,
  Clock
} from 'lucide-react';

interface Currency {
  code: string;
  name: string;
  symbol: string;
  exchangeRate: number; // Rate to USD
  lastUpdated?: string;
  isActive: boolean;
  flag?: string;
}

const CurrencySettings: React.FC = () => {
  const [currencies, setCurrencies] = useState<Currency[]>([
    {
      code: 'NGN',
      name: 'Nigerian Naira',
      symbol: '₦',
      exchangeRate: 1550.00,
      lastUpdated: new Date().toISOString(),
      isActive: true,
      flag: '🇳🇬'
    },
    {
      code: 'USD',
      name: 'US Dollar',
      symbol: '$',
      exchangeRate: 1.00,
      lastUpdated: new Date().toISOString(),
      isActive: true,
      flag: '🇺🇸'
    },
    {
      code: 'EUR',
      name: 'Euro',
      symbol: '€',
      exchangeRate: 0.92,
      lastUpdated: new Date().toISOString(),
      isActive: false,
      flag: '🇪🇺'
    },
    {
      code: 'GBP',
      name: 'British Pound',
      symbol: '£',
      exchangeRate: 0.79,
      lastUpdated: new Date().toISOString(),
      isActive: false,
      flag: '🇬🇧'
    },
    {
      code: 'CAD',
      name: 'Canadian Dollar',
      symbol: 'C$',
      exchangeRate: 1.36,
      lastUpdated: new Date().toISOString(),
      isActive: false,
      flag: '🇨🇦'
    }
  ]);

  const [editingCurrency, setEditingCurrency] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [converterAmount, setConverterAmount] = useState(1000);
  const [converterFrom, setConverterFrom] = useState('NGN');
  const [converterTo, setConverterTo] = useState('USD');

  const handleEditRate = (currencyCode: string, currentRate: number) => {
    setEditingCurrency(currencyCode);
    setEditValue(currentRate.toString());
  };

  const handleSaveRate = async (currencyCode: string) => {
    const newRate = parseFloat(editValue);

    if (isNaN(newRate) || newRate <= 0) {
      alert('Please enter a valid exchange rate');
      return;
    }

    setSaving(true);

    // Update the currency rate
    setCurrencies(prev => prev.map(currency =>
      currency.code === currencyCode
        ? { ...currency, exchangeRate: newRate, lastUpdated: new Date().toISOString() }
        : currency
    ));

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    setSaving(false);
    setEditingCurrency(null);
    alert(`Exchange rate for ${currencyCode} updated successfully!`);
  };

  const handleCancelEdit = () => {
    setEditingCurrency(null);
    setEditValue('');
  };

  const toggleCurrencyStatus = (currencyCode: string) => {
    setCurrencies(prev => prev.map(currency =>
      currency.code === currencyCode
        ? { ...currency, isActive: !currency.isActive }
        : currency
    ));
  };

  const convertAmount = (amount: number, fromCurrency: string, toCurrency: string): number => {
    const from = currencies.find(c => c.code === fromCurrency);
    const to = currencies.find(c => c.code === toCurrency);

    if (!from || !to) return amount;

    // Convert to USD first, then to target currency
    const usdAmount = amount / from.exchangeRate;
    return usdAmount * to.exchangeRate;
  };

  const formatCurrency = (amount: number, currencyCode: string): string => {
    const currency = currencies.find(c => c.code === currencyCode);
    if (!currency) return amount.toFixed(2);

    return `${currency.symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const stats = [
    {
      title: 'Active Currencies',
      value: currencies.filter(c => c.isActive).length.toString(),
      icon: Globe,
      color: 'text-blue-500'
    },
    {
      title: 'Base Currency',
      value: baseCurrency,
      icon: DollarSign,
      color: 'text-green-500'
    },
    {
      title: 'Last Updated',
      value: new Date().toLocaleDateString(),
      icon: Clock,
      color: 'text-purple-500'
    },
    {
      title: 'Total Currencies',
      value: currencies.length.toString(),
      icon: CheckCircle,
      color: 'text-accent-500'
    }
  ];

  return (
    <>
      <Head>
        <title>Currency & Exchange Rate Settings - Admin Dashboard</title>
        <meta name="description" content="Manage currency exchange rates and conversion settings" />
      </Head>

      <AdminLayout title="Currency & Exchange Rate Settings">
        <div className="space-y-6">
          {/* Info Banner */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">About Currency Exchange Rates</h3>
                <p className="text-gray-300 mb-2">
                  Exchange rates determine how donations in different currencies are converted and displayed.
                  All rates are relative to the base currency (USD).
                </p>
                <p className="text-gray-400 text-sm">
                  <strong>Manual Entry:</strong> Enter exchange rates manually below. Rates should represent how many units
                  of the currency equal 1 USD. For example, if 1 USD = 1550 NGN, enter 1550.00 for NGN.
                </p>
              </div>
            </div>
          </div>

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

          {/* Base Currency Setting */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Base Currency</h3>
            <div className="flex items-center gap-4">
              <select
                value={baseCurrency}
                onChange={(e) => setBaseCurrency(e.target.value)}
                className="flex-1 max-w-md px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-accent-500"
              >
                {currencies.map(currency => (
                  <option key={currency.code} value={currency.code}>
                    {currency.flag} {currency.name} ({currency.code})
                  </option>
                ))}
              </select>
              <button
                onClick={() => alert('Base currency updated! All exchange rates are relative to this currency.')}
                className="px-6 py-2 bg-accent-500 hover:bg-accent-600 text-white rounded-lg font-medium transition-colors"
              >
                <Save className="w-4 h-4 inline mr-2" />
                Save
              </button>
            </div>
            <p className="text-gray-400 text-sm mt-3">
              All exchange rates below are calculated relative to 1 {baseCurrency}
            </p>
          </div>

          {/* Currency Exchange Rates Table */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Exchange Rates</h3>
                <button
                  onClick={() => alert('In production, this would fetch latest rates from an API')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Fetch Latest Rates
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Currency
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Exchange Rate (to {baseCurrency})
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Last Updated
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {currencies.map((currency) => (
                    <tr key={currency.code} className="hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{currency.flag}</span>
                          <div>
                            <div className="text-sm font-medium text-white">{currency.name}</div>
                            <div className="text-xs text-gray-400">{currency.symbol}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-mono text-gray-300">{currency.code}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingCurrency === currency.code ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              step="0.01"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="w-32 px-3 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSaveRate(currency.code)}
                              disabled={saving}
                              className="p-1 text-green-400 hover:text-green-300"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="p-1 text-red-400 hover:text-red-300"
                            >
                              <AlertCircle className="w-5 h-5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-300 font-mono">
                              1 {baseCurrency} = {currency.exchangeRate.toFixed(2)} {currency.code}
                            </span>
                            {currency.code !== baseCurrency && (
                              <button
                                onClick={() => handleEditRate(currency.code, currency.exchangeRate)}
                                className="p-1 text-blue-400 hover:text-blue-300"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {currency.lastUpdated ? new Date(currency.lastUpdated).toLocaleString() : 'Never'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={currency.isActive}
                            onChange={() => toggleCurrencyStatus(currency.code)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-500"></div>
                        </label>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          currency.isActive
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {currency.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Conversion Calculator */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-6">Currency Converter (Preview)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Amount</label>
                <input
                  type="number"
                  value={converterAmount}
                  onChange={(e) => setConverterAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-accent-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">From</label>
                <select
                  value={converterFrom}
                  onChange={(e) => setConverterFrom(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-accent-500"
                >
                  {currencies.filter(c => c.isActive).map(currency => (
                    <option key={currency.code} value={currency.code}>
                      {currency.flag} {currency.code}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">To</label>
                <select
                  value={converterTo}
                  onChange={(e) => setConverterTo(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-accent-500"
                >
                  {currencies.filter(c => c.isActive).map(currency => (
                    <option key={currency.code} value={currency.code}>
                      {currency.flag} {currency.code}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-6 p-4 bg-accent-500/10 border border-accent-500/20 rounded-lg">
              <p className="text-sm text-gray-400 mb-1">Converted Amount:</p>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(convertAmount(converterAmount, converterFrom, converterTo), converterTo)}
              </p>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default CurrencySettings;
