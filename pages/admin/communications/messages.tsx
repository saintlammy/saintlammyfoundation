import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Mail,
  Inbox,
  Send,
  Archive,
  Trash2,
  Star,
  Reply,
  Forward,
  MoreVertical,
  Search,
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
  User
} from 'lucide-react';
import { getTypedSupabaseClient } from '@/lib/supabase';

interface Message {
  id: string;
  sender: string;
  senderEmail: string;
  subject: string;
  preview: string;
  content: string;
  timestamp: string;
  read: boolean;
  starred: boolean;
  category: 'inbox' | 'sent' | 'archived' | 'trash';
  priority: 'high' | 'normal' | 'low';
}

interface MessageStats {
  unreadCount: number;
  totalInbox: number;
  sentToday: number;
  archivedCount: number;
}

const MessagesManagement: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [stats, setStats] = useState<MessageStats>({
    unreadCount: 0,
    totalInbox: 0,
    sentToday: 0,
    archivedCount: 0
  });
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [activeCategory, setActiveCategory] = useState<'inbox' | 'sent' | 'archived' | 'trash'>('inbox');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadMessages();
  }, [activeCategory]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const client = getTypedSupabaseClient();

      // In production, fetch from database
      // const { data, error } = await client.from('messages').select('*').eq('category', activeCategory);

      // Using fallback data
      await new Promise(resolve => setTimeout(resolve, 500));

      const allMessages: Message[] = [
        {
          id: '1',
          sender: 'John Doe',
          senderEmail: 'john@example.com',
          subject: 'Question about donation receipt',
          preview: 'Hi, I made a donation last week but haven\'t received my receipt yet...',
          content: 'Hi, I made a donation last week but haven\'t received my receipt yet. Could you please help me with this? My transaction ID is TXN123456.',
          timestamp: new Date().toISOString(),
          read: false,
          starred: true,
          category: 'inbox',
          priority: 'high'
        },
        {
          id: '2',
          sender: 'Jane Smith',
          senderEmail: 'jane@example.com',
          subject: 'Volunteer application',
          preview: 'I would like to volunteer with your organization...',
          content: 'I would like to volunteer with your organization. I have experience in community outreach and would love to contribute to your programs.',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          read: false,
          starred: false,
          category: 'inbox',
          priority: 'normal'
        },
        {
          id: '3',
          sender: 'Michael Brown',
          senderEmail: 'michael@example.com',
          subject: 'Partnership opportunity',
          preview: 'Our company is interested in partnering with your foundation...',
          content: 'Our company is interested in partnering with your foundation for our corporate social responsibility initiatives. Can we schedule a meeting?',
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          read: true,
          starred: false,
          category: 'inbox',
          priority: 'high'
        },
        {
          id: '4',
          sender: 'Sarah Johnson',
          senderEmail: 'sarah@example.com',
          subject: 'Thank you for your help',
          preview: 'I wanted to express my gratitude for the support...',
          content: 'I wanted to express my gratitude for the support your foundation provided to our community. The impact has been tremendous.',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          read: true,
          starred: true,
          category: 'inbox',
          priority: 'normal'
        },
        {
          id: '5',
          sender: 'David Wilson',
          senderEmail: 'david@example.com',
          subject: 'Program inquiry',
          preview: 'I have some questions about your educational programs...',
          content: 'I have some questions about your educational programs. Could you provide more details about enrollment and requirements?',
          timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
          read: true,
          starred: false,
          category: 'inbox',
          priority: 'low'
        },
        {
          id: '6',
          sender: 'Me',
          senderEmail: 'admin@saintlammy.org',
          subject: 'Re: Donation receipt',
          preview: 'Thank you for reaching out. I\'ve sent your receipt...',
          content: 'Thank you for reaching out. I\'ve sent your receipt to your email address. Please check your inbox.',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          read: true,
          starred: false,
          category: 'sent',
          priority: 'normal'
        },
        {
          id: '7',
          sender: 'Me',
          senderEmail: 'admin@saintlammy.org',
          subject: 'Re: Partnership opportunity',
          preview: 'We would be delighted to discuss a partnership...',
          content: 'We would be delighted to discuss a partnership with your organization. Let\'s schedule a call next week.',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          read: true,
          starred: false,
          category: 'sent',
          priority: 'normal'
        },
        {
          id: '8',
          sender: 'Old Contact',
          senderEmail: 'old@example.com',
          subject: 'Old conversation',
          preview: 'This is an archived message...',
          content: 'This is an archived message from a previous conversation.',
          timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          read: true,
          starred: false,
          category: 'archived',
          priority: 'low'
        }
      ];

      const filteredMessages = allMessages.filter(m => m.category === activeCategory);
      setMessages(filteredMessages);

      // Calculate stats
      const inboxMessages = allMessages.filter(m => m.category === 'inbox');
      const unreadCount = inboxMessages.filter(m => !m.read).length;
      const sentMessages = allMessages.filter(m => m.category === 'sent');
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const sentToday = sentMessages.filter(m => new Date(m.timestamp) >= todayStart).length;
      const archivedCount = allMessages.filter(m => m.category === 'archived').length;

      setStats({
        unreadCount,
        totalInbox: inboxMessages.length,
        sentToday,
        archivedCount
      });

    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMessages = messages.filter(message =>
    searchQuery === '' ||
    message.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMessageClick = (message: Message) => {
    setSelectedMessage(message);
    if (!message.read && message.category === 'inbox') {
      setMessages(messages.map(m =>
        m.id === message.id ? { ...m, read: true } : m
      ));
      setStats({ ...stats, unreadCount: stats.unreadCount - 1 });
    }
  };

  const handleToggleStar = (messageId: string) => {
    setMessages(messages.map(m =>
      m.id === messageId ? { ...m, starred: !m.starred } : m
    ));
  };

  const handleArchive = (messageId: string) => {
    setMessages(messages.filter(m => m.id !== messageId));
    setStats({ ...stats, archivedCount: stats.archivedCount + 1 });
    setSelectedMessage(null);
    alert('Message archived successfully');
  };

  const handleDelete = (messageId: string) => {
    setMessages(messages.filter(m => m.id !== messageId));
    setSelectedMessage(null);
    alert('Message moved to trash');
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-500';
      case 'low':
        return 'text-gray-400';
      default:
        return 'text-blue-500';
    }
  };

  return (
    <>
      <Head>
        <title>Messages Management - Admin Dashboard</title>
        <meta name="description" content="Manage and respond to messages" />
      </Head>

      <AdminLayout title="Messages Management">
        <div className="space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-400 text-sm">Unread Messages</p>
                <Mail className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-2xl font-bold text-white">
                {loading ? '...' : stats.unreadCount}
              </p>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-400 text-sm">Total Inbox</p>
                <Inbox className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-white">
                {loading ? '...' : stats.totalInbox}
              </p>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-400 text-sm">Sent Today</p>
                <Send className="w-5 h-5 text-purple-500" />
              </div>
              <p className="text-2xl font-bold text-white">
                {loading ? '...' : stats.sentToday}
              </p>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-400 text-sm">Archived</p>
                <Archive className="w-5 h-5 text-orange-500" />
              </div>
              <p className="text-2xl font-bold text-white">
                {loading ? '...' : stats.archivedCount}
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Messages List */}
            <div className="lg:col-span-1 bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
              {/* Category Tabs */}
              <div className="flex border-b border-gray-700">
                <button
                  onClick={() => setActiveCategory('inbox')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    activeCategory === 'inbox'
                      ? 'bg-accent-500 text-white'
                      : 'text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  <Inbox className="w-4 h-4 inline mr-1" />
                  Inbox
                </button>
                <button
                  onClick={() => setActiveCategory('sent')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    activeCategory === 'sent'
                      ? 'bg-accent-500 text-white'
                      : 'text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  <Send className="w-4 h-4 inline mr-1" />
                  Sent
                </button>
                <button
                  onClick={() => setActiveCategory('archived')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    activeCategory === 'archived'
                      ? 'bg-accent-500 text-white'
                      : 'text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  <Archive className="w-4 h-4 inline mr-1" />
                  Archive
                </button>
              </div>

              {/* Search Bar */}
              <div className="p-4 border-b border-gray-700">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search messages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent-500"
                  />
                </div>
              </div>

              {/* Messages List */}
              <div className="overflow-y-auto max-h-[600px]">
                {loading ? (
                  <div className="p-8 text-center text-gray-400">Loading messages...</div>
                ) : filteredMessages.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">No messages found</div>
                ) : (
                  filteredMessages.map((message) => (
                    <div
                      key={message.id}
                      onClick={() => handleMessageClick(message)}
                      className={`p-4 border-b border-gray-700 cursor-pointer transition-colors ${
                        selectedMessage?.id === message.id
                          ? 'bg-accent-50 dark:bg-accent-900/20'
                          : 'hover:bg-gray-700/50'
                      } ${!message.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className={`font-medium text-white ${!message.read ? 'font-bold' : ''}`}>
                            {message.sender}
                          </span>
                          {message.starred && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                        </div>
                        <span className="text-xs text-gray-400">
                          {formatTimestamp(message.timestamp)}
                        </span>
                      </div>
                      <p className={`text-sm mb-1 ${!message.read ? 'font-semibold text-white' : 'text-white'}`}>
                        {message.subject}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {message.preview}
                      </p>
                      {message.priority === 'high' && (
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs rounded-full">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            High Priority
                          </span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Message Detail */}
            <div className="lg:col-span-2 bg-gray-800 rounded-xl border border-gray-700">
              {selectedMessage ? (
                <div className="h-full flex flex-col">
                  {/* Message Header */}
                  <div className="p-6 border-b border-gray-700">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-xl font-semibold text-white mb-2">
                          {selectedMessage.subject}
                        </h2>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>{selectedMessage.sender}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span>{selectedMessage.senderEmail}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{formatTimestamp(selectedMessage.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleStar(selectedMessage.id)}
                          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <Star className={`w-5 h-5 ${selectedMessage.starred ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'}`} />
                        </button>
                        <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                          <MoreVertical className="w-5 h-5 text-gray-400" />
                        </button>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      <button className="px-4 py-2 bg-accent-500 hover:bg-accent-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                        <Reply className="w-4 h-4" />
                        Reply
                      </button>
                      <button className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                        <Forward className="w-4 h-4" />
                        Forward
                      </button>
                      {activeCategory === 'inbox' && (
                        <button
                          onClick={() => handleArchive(selectedMessage.id)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                        >
                          <Archive className="w-4 h-4" />
                          Archive
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(selectedMessage.id)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Message Body */}
                  <div className="flex-1 p-6 overflow-y-auto">
                    <div className="prose dark:prose-invert max-w-none">
                      <p className="text-white whitespace-pre-wrap">
                        {selectedMessage.content}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <Mail className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p>Select a message to view its content</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default MessagesManagement;
