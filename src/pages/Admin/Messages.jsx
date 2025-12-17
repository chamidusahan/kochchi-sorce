import React from 'react';
import {
    Mail,
    Phone,
    Clock,
    RefreshCw,
    CheckCircle,
    Trash2,
    MessageSquareText,
    User,
    Tag
} from 'lucide-react';

const statusVariants = {
    new: {
        label: 'New',
        badge: 'bg-red-700/20 text-red-400 border border-red-800/40',
        accent: 'border-l-4 border-red-600'
    },
    read: {
        label: 'Read',
        badge: 'bg-blue-700/20 text-blue-300 border border-blue-800/40',
        accent: 'border-l-4 border-blue-500'
    },
    replied: {
        label: 'Replied',
        badge: 'bg-green-700/20 text-green-300 border border-green-800/40',
        accent: 'border-l-4 border-green-500'
    }
};

const Messages = () => {
    const [messages, setMessages] = React.useState([]);
    const [expandedId, setExpandedId] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState('');
    const [updatingId, setUpdatingId] = React.useState(null);
    const [deletingId, setDeletingId] = React.useState(null);

    const fetchMessages = React.useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch('http://localhost/backend/admin/api/get-messages.php', {
                credentials: 'include'
            });
            const data = await response.json();
            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Failed to load messages');
            }
            setMessages(data.data || []);
        } catch (err) {
            setError(err.message || 'Unable to load messages');
        } finally {
            setLoading(false);
        }
    }, []);

    React.useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    const markAsRead = async (messageId) => {
        setUpdatingId(messageId);
        try {
            const response = await fetch('http://localhost/backend/admin/api/update-message-status.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ messageId, status: 'read' })
            });
            const data = await response.json();
            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Failed to update status');
            }
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === messageId ? { ...msg, status: 'read' } : msg
                )
            );
        } catch (err) {
            alert(err.message || 'Unable to update message status');
        } finally {
            setUpdatingId(null);
        }
    };

    const deleteMessage = async (messageId) => {
        if (!window.confirm('Delete this message? This action cannot be undone.')) {
            return;
        }
        setDeletingId(messageId);
        try {
            const response = await fetch('http://localhost/backend/admin/api/delete-message.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ messageId })
            });
            const data = await response.json();
            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Failed to delete message');
            }
            setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
        } catch (err) {
            alert(err.message || 'Unable to delete message');
        } finally {
            setDeletingId(null);
        }
    };

    const messageStats = React.useMemo(() => {
        const total = messages.length;
        const unread = messages.filter((msg) => msg.status === 'new').length;
        const replied = messages.filter((msg) => msg.status === 'replied').length;
        return { total, unread, replied };
    }, [messages]);

    const formatTime = (isoString) => {
        if (!isoString) return 'Unknown';
        const date = new Date(isoString);
        return `${date.toLocaleDateString()} • ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    };

    return (
        <div className="space-y-6">
            <section className="bg-black/80 rounded-2xl p-5 md:p-6 shadow-lg border border-gray-800/50">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h2 className="text-xl md:text-2xl font-semibold text-white flex items-center gap-2">
                            <MessageSquareText size={20} className="text-red-500" />
                            Support Inbox
                        </h2>
                        <p className="text-white/60 text-sm md:text-base">
                            Monitor customer queries and stay on top of responses.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={fetchMessages}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900/70 border border-gray-700 text-white/80 hover:bg-gray-900/90 transition"
                            disabled={loading}
                        >
                            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                            <span>{loading ? 'Refreshing' : 'Refresh'}</span>
                        </button>
                    </div>
                </div>
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="rounded-xl border border-red-800/50 bg-red-900/10 px-4 py-3">
                        <p className="text-sm text-red-300">Total messages</p>
                        <p className="text-2xl font-semibold text-white">{messageStats.total}</p>
                    </div>
                    <div className="rounded-xl border border-amber-800/40 bg-amber-900/10 px-4 py-3">
                        <p className="text-sm text-amber-200">New messages</p>
                        <p className="text-2xl font-semibold text-white">{messageStats.unread}</p>
                    </div>
                    <div className="rounded-xl border border-green-800/40 bg-green-900/10 px-4 py-3">
                        <p className="text-sm text-green-200">Replied</p>
                        <p className="text-2xl font-semibold text-white">{messageStats.replied}</p>
                    </div>
                </div>
            </section>

            <section className="bg-black/80 rounded-2xl shadow-lg border border-gray-800/50">
                {error && (
                    <div className="p-4 border-b border-red-800/40 text-red-300 text-sm">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <div className="h-10 w-10 rounded-full border-2 border-red-500 border-t-transparent animate-spin" />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="py-16 px-6 text-center text-white/60">
                        <MessageSquareText size={32} className="mx-auto text-white/40 mb-3" />
                        <p className="text-lg font-semibold text-white mb-1">No messages yet</p>
                        <p className="text-sm">Customer inquiries will appear here as soon as they arrive.</p>
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-800/40">
                        {messages.map((message) => {
                            const status = statusVariants[message.status] || statusVariants.new;
                            const isExpanded = expandedId === message.id;
                            return (
                                <li
                                    key={message.id}
                                    className={`group bg-gradient-to-r from-transparent via-transparent to-black/10 transition ${status.accent}`}
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-5 py-5">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start gap-4">
                                                <span className={`mt-1 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${status.badge}`}>
                                                    {status.label}
                                                </span>
                                                <div className="space-y-1 min-w-0">
                                                    <button
                                                        onClick={() => setExpandedId(isExpanded ? null : message.id)}
                                                        className="text-left text-white font-semibold text-base hover:text-red-300 transition"
                                                    >
                                                        {message.topic || 'General enquiry'}
                                                    </button>
                                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs md:text-sm text-white/60">
                                                        <span className="inline-flex items-center gap-1">
                                                            <User size={14} className="text-white/40" />
                                                            {message.name}
                                                        </span>
                                                        <span className="inline-flex items-center gap-1">
                                                            <Mail size={14} className="text-white/40" />
                                                            {message.email}
                                                        </span>
                                                        {message.phone && (
                                                            <span className="inline-flex items-center gap-1">
                                                                <Phone size={14} className="text-white/40" />
                                                                {message.phone}
                                                            </span>
                                                        )}
                                                        <span className="inline-flex items-center gap-1">
                                                            <Clock size={14} className="text-white/40" />
                                                            {formatTime(message.createdAt)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {message.status !== 'read' && (
                                                <button
                                                    onClick={() => markAsRead(message.id)}
                                                    disabled={updatingId === message.id}
                                                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-900/30 text-blue-200 hover:bg-blue-900/50 border border-blue-800/40 text-xs md:text-sm transition disabled:opacity-60"
                                                >
                                                    <CheckCircle size={16} />
                                                    <span>{updatingId === message.id ? 'Updating…' : 'Mark as read'}</span>
                                                </button>
                                            )}
                                            <button
                                                onClick={() => deleteMessage(message.id)}
                                                disabled={deletingId === message.id}
                                                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-red-900/30 text-red-200 hover:bg-red-900/50 border border-red-800/40 text-xs md:text-sm transition disabled:opacity-60"
                                            >
                                                <Trash2 size={16} />
                                                <span>{deletingId === message.id ? 'Deleting…' : 'Delete'}</span>
                                            </button>
                                        </div>
                                    </div>
                                    {isExpanded && (
                                        <div className="px-5 pb-5 text-sm text-white/80">
                                            <div className="rounded-xl bg-gray-900/60 border border-gray-800/60 p-4">
                                                <div className="flex items-center gap-2 mb-2 text-white/70 text-xs uppercase tracking-wide">
                                                    <Tag size={14} className="text-white/40" />
                                                    Message
                                                </div>
                                                <p className="whitespace-pre-line leading-relaxed">{message.message}</p>
                                            </div>
                                        </div>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                )}
            </section>
        </div>
    );
};

export default Messages;
