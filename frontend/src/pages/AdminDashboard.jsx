import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Ticket, Search, Trash2, 
    AlertCircle, CheckCircle, Bell,
    ArrowUpRight, Clock, MapPin, 
    User, HardHat, ShieldCheck,
    LogOut, ExternalLink, Activity
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import AdminBookingManager from '../components/AdminBookingManager';
import ResourceHub from '../components/ResourceHub';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [allTickets, setAllTickets] = useState([]);
    const [stats, setStats] = useState({ OPEN: 0, IN_PROGRESS: 0, RESOLVED: 0, TOTAL: 0 });
    const [authLogStats, setAuthLogStats] = useState({ success: 0, failed: 0, last7Days: [] });
    const [activeFilter, setActiveFilter] = useState('ALL');
    const [currentSection, setCurrentSection] = useState('tickets');
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteTargetId, setDeleteTargetId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [showNotif, setShowNotif] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    
    const token = localStorage.getItem('jwt_token');
    const notifWrapperRef = useRef(null);
    const stompClientRef = useRef(null);

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        
        fetchAll();
        fetchNotifications();
        connectWebSocket();
        
        const ticketInterval = setInterval(fetchAll, 10000);
        
        const handleClickOutside = (event) => {
            if (notifWrapperRef.current && !notifWrapperRef.current.contains(event.target)) {
                setShowNotif(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            clearInterval(ticketInterval);
            document.removeEventListener('mousedown', handleClickOutside);
            if (stompClientRef.current) stompClientRef.current.disconnect();
        };
    }, [token]);

    const showToastMsg = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
    };

    const connectWebSocket = () => {
        const socket = new SockJS('/ws-notifications');
        const stompClient = Stomp.over(socket);
        stompClient.debug = null;

        stompClient.connect({}, (frame) => {
            console.log('[WS] Connected (Admin)');
            stompClientRef.current = stompClient;
            stompClient.subscribe('/topic/public', (stompMsg) => {
                const payload = JSON.parse(stompMsg.body);
                handleAdminNotification(payload);
            });
        }, (error) => {
            console.warn('[WS] Connection lost, retrying...', error);
            setTimeout(connectWebSocket, 5000);
        });
    };

    const handleAdminNotification = (payload) => {
        showToastMsg(`🔔 ${payload.title}: ${payload.message}`, 'success');
        fetchNotifications();
        if (payload.type === 'INCIDENT_CREATED' || payload.type === 'INCIDENT_UPDATED') {
            fetchAll();
        }
    };

    const fetchAll = async () => {
        const headers = { 'Authorization': `Bearer ${token}` };
        try {
            const [ticketsRes, statsRes, authLogsRes] = await Promise.all([
                fetch('/api/tickets/all', { headers }),
                fetch('/api/tickets/stats', { headers }),
                fetch('/api/users/auth-logs/stats', { headers })
            ]);
            if (ticketsRes.ok) setAllTickets(await ticketsRes.json());
            if (statsRes.ok) setStats(await statsRes.json());
            if (authLogsRes.ok) setAuthLogStats(await authLogsRes.json());
        } catch (e) { console.error('Fetch error', e); }
    };

    const fetchNotifications = async () => {
        const headers = { 'Authorization': `Bearer ${token}` };
        try {
            let userId;
            try { 
                const payload = JSON.parse(atob(token.split('.')[1])); 
                userId = payload.userId || payload.sub;
            } catch (e) {}
            
            if (!userId) return;
            const res = await fetch(`/api/notifications/user/${userId}`, { headers });
            if (res.ok) setNotifications(await res.json());
        } catch (e) {}
    };

    const changeStatus = async (id, status) => {
        const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
        try {
            const res = await fetch(`/api/tickets/${id}/status`, {
                method: 'PATCH', headers,
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                showToastMsg(`Ticket #${id} marked as ${status.replace('_', ' ')}`, 'success');
                fetchAll();
            } else {
                showToastMsg('Failed to update ticket.', 'error');
            }
        } catch (e) { showToastMsg('Connection error.', 'error'); }
    };

    const assignTicket = async (id, email) => {
        const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
        try {
            const res = await fetch(`/api/tickets/${id}/assign`, {
                method: 'PATCH', headers,
                body: JSON.stringify({ assignedTo: email })
            });
            if (res.ok) {
                showToastMsg(`Ticket #${id} delegated to ${email}`, 'success');
                fetchAll();
            }
        } catch (e) { showToastMsg('Connection error.', 'error'); }
    };

    const handleDelete = async () => {
        if (!deleteTargetId) return;
        const headers = { 'Authorization': `Bearer ${token}` };
        try {
            const res = await fetch(`/api/tickets/${deleteTargetId}`, { method: 'DELETE', headers });
            setShowDeleteModal(false);
            if (res.ok) { 
                showToastMsg(`Ticket #${deleteTargetId} deleted.`, 'success'); 
                fetchAll(); 
            } else showToastMsg('Delete failed.', 'error');
        } catch (e) { showToastMsg('Connection error.', 'error'); }
    };

    const logout = () => {
        localStorage.removeItem('jwt_token');
        navigate('/login');
    };

    const filteredTickets = allTickets.filter(t => {
        const matchStatus = activeFilter === 'ALL' || t.status === activeFilter;
        const q = searchQuery.toLowerCase().trim();
        const matchSearch = !q ||
            (t.title || '').toLowerCase().includes(q) ||
            (t.createdBy || '').toLowerCase().includes(q) ||
            (t.roomId || '').toLowerCase().includes(q) ||
            String(t.id).includes(q);
        return matchStatus && matchSearch;
    });

    const timeAgo = (dateStr) => {
        if (!dateStr) return '-';
        const diff = Date.now() - new Date(dateStr).getTime();
        const m = Math.floor(diff / 60000);
        if (m < 1) return 'Just now';
        if (m < 60) return `${m}m ago`;
        const h = Math.floor(m / 60);
        if (h < 24) return `${h}h ago`;
        return `${Math.floor(h / 24)}d ago`;
    };

    const hashCode = (str) => {
        if (!str) return 0;
        let h = 0;
        for (let c of str) h = ((h << 5) - h) + c.charCodeAt(0);
        return Math.abs(h);
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] text-[#1e293b] font-['Plus_Jakarta_Sans',sans-serif] relative overflow-x-hidden">
            <style>{`
                .bg-dots {
                    background-color: transparent;
                    background-image: radial-gradient(#cbd5e1 1.2px, transparent 1.2px);
                    background-size: 24px 24px;
                }
                .text-gradient {
                    background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%);
                    -webkit-background-clip: text;
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .premium-card {
                    background: #ffffff;
                    box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.08), 0 0 10px rgba(0,0,0,0.02);
                    border-radius: 32px;
                    border: 1px solid rgba(255, 255, 255, 0.7);
                }
                .pulse-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: #22c55e;
                    box-shadow: 0 0 0 0 rgba(34,197,94,0.4);
                    animation: pulse-ring 1.5s infinite;
                }
                @keyframes pulse-ring {
                    0% { box-shadow: 0 0 0 0 rgba(34,197,94,0.4) }
                    70% { box-shadow: 0 0 0 8px rgba(34,197,94,0) }
                    100% { box-shadow: 0 0 0 0 rgba(34,197,94,0) }
                }
                .ticket-row {
                    border-bottom: 1px solid #f1f5f9;
                    transition: background 0.2s ease;
                }
                .ticket-row:hover {
                    background: #f8fafc;
                }
            `}</style>

            {/* Background elements */}
            <div className="fixed inset-0 bg-dots pointer-events-none z-0"></div>
            <div className="fixed w-[600px] h-[600px] bg-blue-100 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 top-[-10%] left-[-10%] pointer-events-none z-0"></div>

            {/* Navigation Header */}
            <header className="sticky top-0 z-40 px-8 py-5 flex items-center justify-between border-b border-slate-200/60 bg-white/80 backdrop-blur-md shadow-sm">
                <div className="flex items-center gap-4 cursor-pointer" onClick={() => setCurrentSection('tickets')}>
                    <div className="w-[42px] h-[42px] bg-white rounded-[12px] flex items-center justify-center shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-slate-100">
                        <svg className="w-[22px] h-[22px] text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                        </svg>
                    </div>
                    <div className="flex flex-col text-left">
                        <span className="text-xl font-[800] text-slate-900 tracking-[-0.03em] leading-none">Smart Campus</span>
                        <span className="text-[11px] font-[700] text-blue-600 uppercase tracking-widest mt-1">Admin Command Center</span>
                    </div>
                </div>

                <div className="flex items-center gap-8">
                    <nav className="flex items-center gap-6">
                        <button onClick={() => setCurrentSection('tickets')} className={`text-sm font-bold transition-colors ${currentSection === 'tickets' ? 'text-blue-600' : 'text-slate-500 hover:text-blue-600'}`}>Incident Feed</button>
                        <button onClick={() => setCurrentSection('bookings')} className={`text-sm font-bold transition-colors ${currentSection === 'bookings' ? 'text-blue-600' : 'text-slate-500 hover:text-blue-600'}`}>Booking Hub</button>
                        <button onClick={() => setCurrentSection('resources')} className={`text-sm font-bold transition-colors ${currentSection === 'resources' ? 'text-blue-600' : 'text-slate-500 hover:text-blue-600'}`}>Resource Hub</button>
                        <div className="w-px h-6 bg-slate-200 mx-2"></div>
                    </nav>
                    
                    <div className="hidden sm:flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                        <div className="pulse-dot"></div>
                        <span className="text-[12px] font-bold text-slate-700 uppercase">LIVE MONITORING</span>
                        <div className="w-px h-3 bg-slate-200 mx-1"></div>
                        <span className="text-[12px] font-black text-blue-600">{stats.OPEN} OPEN</span>
                    </div>

                    <div className="hidden lg:flex items-center gap-2 group cursor-default">
                        <div className="bg-emerald-50/50 text-emerald-600 px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-emerald-100 shadow-sm transition-all hover:bg-emerald-50">
                            <ShieldCheck size={14} strokeWidth={3} className="text-emerald-500" />
                            Verified Administrator
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4 relative" ref={notifWrapperRef}>
                        <button onClick={() => setShowNotif(!showNotif)} className="relative p-2 text-slate-400 hover:text-blue-600 transition-colors focus:outline-none">
                            <Bell size={22} strokeWidth={2.5} />
                            {notifications.some(n => !n.read) && <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white"></span>}
                        </button>
                        
                        {showNotif && (
                            <div className="absolute right-0 top-[calc(100%+16px)] w-[340px] bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="flex justify-between items-center mb-4 text-left">
                                    <h4 className="font-black text-slate-900 text-sm tracking-tight">Updates</h4>
                                    <button className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">Mark all read</button>
                                </div>
                                <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
                                    {notifications.length === 0 ? (
                                        <p className="text-xs text-center text-slate-400 py-6 font-medium">No new notifications</p>
                                    ) : (
                                        notifications.map(n => (
                                            <div key={n.id} className={`p-3 rounded-2xl text-[12px] font-semibold transition-colors cursor-pointer text-left ${!n.read ? 'bg-blue-50 text-blue-900 border-l-4 border-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}>
                                                <div>{n.message}</div>
                                                <div className="text-[10px] font-extrabold uppercase text-slate-400 mt-1">{timeAgo(n.createdAt)}</div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-sm font-black text-white shadow-lg shadow-blue-200">A</div>
                        <button onClick={logout} className="text-[13px] font-[700] text-slate-500 hover:text-blue-600 transition-colors">Sign Out</button>
                    </div>
                </div>
            </header>

            <main className="max-w-[1400px] mx-auto px-10 py-12 relative z-10">
                {currentSection === 'tickets' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Page Title */}
                        <div className="mb-10 text-left">
                            <div className="inline-flex items-center gap-1.5 px-3.5 py-[7px] bg-white rounded-full text-[11.5px] font-[800] text-blue-600 mb-[22px] w-fit shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-slate-200">
                                <ShieldCheck size={14} className="text-emerald-500" strokeWidth={3} />
                                Verified Administrator
                            </div>
                            <h1 className="text-[44px] font-[800] text-[#111827] leading-[1.1] tracking-[-0.04em]">
                                Campus <span className="text-gradient">Command Center</span>
                            </h1>
                            <p className="text-[16px] text-[#64748b] font-[500] mt-3 max-w-[550px]">
                                Real-time incident monitoring and administrative control across all campus facilities.
                            </p>
                        </div>

                        {/* Stat Cards */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                            {[
                                { label: 'Open Tickets', val: stats.OPEN, subtitle: 'Needs attention', icon: Ticket, bg: 'bg-blue-50', color: 'text-blue-600' },
                                { label: 'In Progress', val: stats.IN_PROGRESS, subtitle: 'Active repairs', icon: Clock, bg: 'bg-amber-50', color: 'text-amber-500' },
                                { label: 'Resolved', val: stats.RESOLVED, subtitle: 'Fixed today', icon: CheckCircle, bg: 'bg-emerald-50', color: 'text-emerald-500' },
                                { label: 'All Time', val: stats.TOTAL, subtitle: 'Total logs', icon: Activity, bg: 'bg-violet-50', color: 'text-violet-600' }
                            ].map(item => (
                                <div key={item.label} className="premium-card p-8 group hover:scale-[1.02] transition-all duration-300">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-[11px] font-[800] uppercase tracking-[0.15em] text-slate-400">{item.label}</span>
                                        <div className={`w-11 h-11 rounded-[14px] flex items-center justify-center ${item.bg} ${item.color} shadow-sm border border-white`}>
                                            <item.icon size={22} strokeWidth={2.5} />
                                        </div>
                                    </div>
                                    <div className="text-[38px] font-[900] text-slate-900 leading-none mb-2">{item.val ?? '0'}</div>
                                    <div className="text-[13px] text-slate-500 font-bold">{item.subtitle}</div>
                                </div>
                            ))}
                        </div>

                        {/* Login Activity Chart */}
                        <div className="grid gap-8 mb-12 xl:grid-cols-[1.65fr_0.85fr]">
                            <div className="premium-card p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <p className="text-[11px] font-[800] uppercase tracking-[0.16em] text-slate-400">Security Analytics</p>
                                        <h3 className="text-2xl font-[800] text-slate-900 mt-3">Login Audit Trend</h3>
                                    </div>
                                    <span className="text-xs font-black uppercase tracking-[0.25em] text-slate-500">Last 7 days</span>
                                </div>
                                <div className="h-[320px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={authLogStats.last7Days} margin={{ top: 12, right: 12, left: -12, bottom: 2 }}>
                                            <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" vertical={false} />
                                            <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                                            <YAxis allowDecimals={false} tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                                            <Tooltip contentStyle={{ borderRadius: 18, border: '1px solid #e2e8f0', background: '#ffffff' }} />
                                            <Legend wrapperStyle={{ fontSize: 12, color: '#475569', paddingTop: 8 }} />
                                            <Area type="monotone" dataKey="success" stroke="#16a34a" fill="#dcfce7" fillOpacity={0.75} strokeWidth={3} />
                                            <Area type="monotone" dataKey="failed" stroke="#dc2626" fill="#fee2e2" fillOpacity={0.75} strokeWidth={3} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                            <div className="grid gap-6">
                                {[
                                    { label: 'Successful Logins', value: authLogStats.success, bg: 'bg-emerald-50', color: 'text-emerald-600' },
                                    { label: 'Failed Attempts', value: authLogStats.failed, bg: 'bg-rose-50', color: 'text-rose-600' }
                                ].map(item => (
                                    <div key={item.label} className={`premium-card p-6 ${item.bg}`}>
                                        <span className="text-[12px] font-[800] uppercase tracking-[0.16em] text-slate-500">{item.label}</span>
                                        <p className={`text-[42px] font-[900] mt-5 ${item.color}`}>{item.value ?? 0}</p>
                                        <p className="text-sm text-slate-500 mt-2">Secure login monitoring for administrator awareness.</p>
                                    </div>
                                ))}
                                <div className="premium-card p-6 bg-white border border-slate-200 shadow-sm">
                                    <div className="flex items-center justify-between mb-5">
                                        <div>
                                            <span className="text-[11px] font-[800] uppercase tracking-[0.14em] text-slate-400">Live Notifications</span>
                                            <h4 className="text-lg font-[800] text-slate-900 mt-2">Recent Alerts</h4>
                                        </div>
                                        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-600">Real time</span>
                                    </div>
                                    <div className="space-y-4 max-h-[280px] overflow-y-auto pr-1">
                                        {notifications.length === 0 ? (
                                            <p className="text-sm text-slate-500">No notifications yet. New tickets will appear here immediately.</p>
                                        ) : notifications.slice(0, 6).map((n) => (
                                            <div key={n.id} className={`rounded-3xl p-4 border ${n.read ? 'border-slate-200 bg-slate-50' : 'border-blue-100 bg-blue-50'} shadow-sm`}> 
                                                <p className="text-sm font-[800] text-slate-900">{n.message}</p>
                                                <p className="text-[11px] text-slate-500 mt-2">{timeAgo(n.createdAt)}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tickets Panel */}
                        <div className="premium-card overflow-hidden">
                            {/* Panel Header */}
                            <div className="flex flex-col xl:flex-row items-center justify-between px-10 py-10 gap-6 border-b border-slate-100/80 bg-slate-50/30">
                                <div className="text-left">
                                    <h2 className="text-2xl font-[800] text-slate-900 tracking-[-0.03em]">Live Incident Feed</h2>
                                    <p className="text-[14px] text-slate-500 font-medium mt-1">Real-time ticketing system monitoring</p>
                                </div>
                                <div className="flex items-center gap-4 flex-wrap">
                                    <div className="flex gap-2 p-1.5 bg-slate-100 rounded-full shadow-inner border border-slate-200/50">
                                        {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED'].map(f => (
                                            <button 
                                                key={f} 
                                                onClick={() => setActiveFilter(f)} 
                                                className={`px-6 py-2 rounded-full text-[12px] font-black tracking-tight transition-all duration-300 ${activeFilter === f ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-500 hover:text-slate-900'}`}
                                            >
                                                {f.charAt(0) + f.slice(1).toLowerCase().replace('_', ' ')}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="relative">
                                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" strokeWidth={3} />
                                        <input 
                                            type="text" 
                                            value={searchQuery} 
                                            onChange={(e) => setSearchQuery(e.target.value)} 
                                            className="bg-white border-2 border-slate-100 rounded-full px-11 py-2.5 text-[14px] font-bold outline-none focus:border-blue-400 w-[240px] shadow-sm transition-all" 
                                            placeholder="Quick search..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto text-left">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-slate-50/80 text-[11px] font-[900] text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                            <th className="pl-10 py-5"># ID</th>
                                            <th className="py-5">Reported By</th>
                                            <th className="py-5">Incident</th>
                                            <th className="py-5">Room</th>
                                            <th className="py-5">Staff Assigned</th>
                                            <th className="py-5">Priority</th>
                                            <th className="py-5">Status</th>
                                            <th className="pr-10 py-5 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100/60">
                                        {filteredTickets.map((t, idx) => (
                                            <tr key={t.id} className="ticket-row group">
                                                <td className="py-7 pl-10 text-[13px] font-black text-slate-400 group-hover:text-blue-500 transition-colors">#{t.id}</td>
                                                <td className="py-7">
                                                    <div className="flex items-center gap-3.5">
                                                        <div 
                                                            className="w-10 h-10 rounded-2xl flex items-center justify-center text-[14px] text-white font-black shadow-lg shadow-slate-200 shrink-0"
                                                            style={{ background: `hsl(${hashCode(t.createdBy || 'u') % 360}, 65%, 55%)` }}
                                                        >
                                                            {(t.createdBy || '?').charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-[14px] font-black text-slate-900 leading-none">{(t.createdBy || '').split('@')[0]}</span>
                                                            <span className="text-[11px] font-bold text-slate-400 mt-1">{t.createdBy || 'Unknown'}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-7">
                                                    <div className="flex flex-col max-w-[200px]">
                                                        <span className="text-[15px] font-[800] text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">{t.title}</span>
                                                        <span className="text-[11px] font-black text-[#94a3b8] uppercase tracking-wider mt-1.5 flex items-center gap-1.5">
                                                            <Clock size={11} strokeWidth={3} />
                                                            {timeAgo(t.createdAt)}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-7">
                                                    <span className="inline-flex items-center gap-1.5 text-[12px] font-black text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200/50">
                                                        <MapPin size={12} strokeWidth={3} className="text-slate-400" />
                                                        {t.roomId || '—'}
                                                    </span>
                                                </td>
                                                <td className="py-7">
                                                    <div className="relative">
                                                        <select 
                                                            value={t.assignedTo || ''} 
                                                            onChange={(e) => assignTicket(t.id, e.target.value)} 
                                                            className="appearance-none text-[12px] font-black bg-white border-2 border-slate-100 rounded-xl px-4 py-2 pr-10 outline-none focus:border-blue-400 shadow-sm cursor-pointer"
                                                        >
                                                            <option value="">Unassigned</option>
                                                            <option value="tech.alumni@sliit.lk">Tech Alumni</option>
                                                            <option value="maint.dept@sliit.lk">Maint Dept</option>
                                                            <option value="it.support@sliit.lk">IT Support</option>
                                                        </select>
                                                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" strokeWidth={3} />
                                                    </div>
                                                </td>
                                                <td className="py-7">
                                                    <span className={`px-2.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                                                        t.priority === 'HIGH' ? 'bg-rose-50 text-rose-500 border border-rose-100' : 
                                                        t.priority === 'MEDIUM' ? 'bg-amber-50 text-amber-500 border border-amber-100' : 
                                                        'bg-slate-50 text-slate-400 border border-slate-200'
                                                    }`}>
                                                        {t.priority || 'LOW'}
                                                    </span>
                                                </td>
                                                <td className="py-7">
                                                    <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                                                        t.status === 'OPEN' ? 'bg-blue-50 text-blue-600' : 
                                                        t.status === 'IN_PROGRESS' ? 'bg-amber-50 text-amber-600' : 
                                                        'bg-emerald-50 text-emerald-600'
                                                    }`}>
                                                        {t.status.replace('_', ' ')}
                                                    </span>
                                                </td>
                                                <td className="py-7 pr-10">
                                                    <div className="flex items-center justify-end gap-2.5">
                                                        {t.status === 'OPEN' && (
                                                            <>
                                                                <button 
                                                                    onClick={() => changeStatus(t.id, 'IN_PROGRESS')} 
                                                                    className="px-3 py-1.5 bg-amber-50 text-amber-500 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all hover:bg-amber-100 border border-amber-100 flex items-center gap-1.5 shadow-sm"
                                                                >
                                                                    🔧 Start
                                                                </button>
                                                                <button 
                                                                    onClick={() => changeStatus(t.id, 'RESOLVED')} 
                                                                    className="px-3 py-1.5 bg-emerald-50 text-emerald-500 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all hover:bg-emerald-100 border border-emerald-100 flex items-center gap-1.5 shadow-sm"
                                                                >
                                                                    ✓ Resolve
                                                                </button>
                                                            </>
                                                        )}
                                                        {t.status === 'IN_PROGRESS' && (
                                                            <button 
                                                                onClick={() => changeStatus(t.id, 'RESOLVED')} 
                                                                className="px-3 py-1.5 bg-emerald-50 text-emerald-500 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all hover:bg-emerald-100 border border-emerald-100 flex items-center gap-1.5 shadow-sm"
                                                            >
                                                                ✓ Resolve
                                                            </button>
                                                        )}
                                                        {t.status === 'RESOLVED' && (
                                                            <span className="px-3 py-1.5 bg-emerald-50 text-emerald-500 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 border border-emerald-100">
                                                                <CheckCircle size={12} strokeWidth={3} />
                                                                RESOLVED
                                                            </span>
                                                        )}
                                                        <button 
                                                            onClick={() => { setDeleteTargetId(t.id); setShowDeleteModal(true); }} 
                                                            className="p-2 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-100 transition-all duration-300 border border-rose-100 shadow-sm" 
                                                            title="Purge Record"
                                                        >
                                                            <Trash2 size={14} strokeWidth={3} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {currentSection === 'bookings' && (
                    <div id="section-bookings" className="animate-in fade-in duration-300">
                        <AdminBookingManager />
                    </div>
                )}

                {currentSection === 'resources' && (
                    <div id="section-resources" className="animate-in fade-in duration-300">
                        <ResourceHub />
                    </div>
                )}
            </main>

            {/* Modals & Toasts */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[40px] p-10 max-w-[440px] w-full text-center shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="w-20 h-20 rounded-[28px] bg-rose-50 flex items-center justify-center mx-auto mb-8 border border-rose-100 shadow-sm">
                            <Trash2 size={32} className="text-rose-500" strokeWidth={2.5} />
                        </div>
                        <h3 className="text-[#0f172a] font-[900] text-2xl mb-4 tracking-tight">Purge Ticket Record?</h3>
                        <p className="text-[#64748b] text-[16px] font-[500] leading-relaxed mb-10 px-4">
                            This action is permanent. The ticket and all its operational history will be removed from campus servers.
                        </p>
                        <div className="flex gap-4">
                            <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-4 rounded-3xl font-[800] bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all">Cancel</button>
                            <button onClick={handleDelete} className="flex-1 py-4 rounded-3xl font-[800] bg-rose-500 text-white hover:bg-rose-600 shadow-lg shadow-rose-200 transition-all">Confirm Purge</button>
                        </div>
                    </div>
                </div>
            )}

            {toast.show && (
                <div className={`fixed bottom-10 right-10 z-[9999] pl-6 pr-8 py-5 rounded-[24px] font-black text-xs uppercase tracking-widest flex items-center gap-4 bg-white shadow-[0_40px_100px_rgba(0,0,0,0.15)] border-2 transition-all animate-in slide-in-from-bottom-5 ${
                    toast.type === 'success' ? 'text-emerald-600 border-emerald-50' : 'text-rose-600 border-rose-50'
                }`}>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${toast.type === 'success' ? 'bg-emerald-50' : 'bg-rose-50'}`}>
                        {toast.type === 'success' ? <CheckCircle size={22} className="text-emerald-600" strokeWidth={3} /> : <AlertCircle size={22} className="text-rose-600" strokeWidth={3} />}
                    </div>
                    {toast.message}
                </div>
            )}
        </div>
    );
};

// Helper for select arrow
const ChevronDown = ({ size, className, strokeWidth }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M6 9l6 6 6-6" />
    </svg>
);

export default AdminDashboard;
