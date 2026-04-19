import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import BookingPanel from '../components/BookingPanel';

const StudentDashboard = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('jwt_token');
    const [userPayload, setUserPayload] = useState({});
    const [allTickets, setAllTickets] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [stats, setStats] = useState({ OPEN: 0, IN_PROGRESS: 0, RESOLVED: 0, TOTAL: 0 });
    const [bookingStats, setBookingStats] = useState({ TOTAL: 0 });
    const [bookings, setBookings] = useState([]);
    const [labs, setLabs] = useState([]);
    const [currentSection, setCurrentSection] = useState('dashboard');
    const [showNotif, setShowNotif] = useState(false);
    const [showTicketModal, setShowTicketModal] = useState(false);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    
    const notifWrapperRef = useRef(null);

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setUserPayload(payload);
        } catch (e) {
            console.error("Token parse error", e);
        }

        fetchTickets();
        fetchNotifications();
        fetchBookings();
        
        const ticketInterval = setInterval(fetchTickets, 30000);
        const notifInterval = setInterval(fetchNotifications, 10000);

        const handleClickOutside = (event) => {
            if (notifWrapperRef.current && !notifWrapperRef.current.contains(event.target)) {
                setShowNotif(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            clearInterval(ticketInterval);
            clearInterval(notifInterval);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [token, navigate]);

    const showToastMsg = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3500);
    };

    const fetchTickets = async () => {
        const headers = { 'Authorization': `Bearer ${token}` };
        try {
            const [ticketsRes, statsRes, bookingsStatsRes] = await Promise.all([
                fetch('/api/tickets/my', { headers }),
                fetch('/api/tickets/stats', { headers }),
                fetch('/api/bookings/stats', { headers })
            ]);
            if (ticketsRes.ok) setAllTickets(await ticketsRes.json());
            if (statsRes.ok) setStats(await statsRes.json());
            if (bookingsStatsRes.ok) {
                const bStats = await bookingsStatsRes.json();
                setBookingStats(bStats.data || { TOTAL: 0 });
            }
        } catch (err) {}
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

    const fetchBookings = async () => {
        const headers = { 'Authorization': `Bearer ${token}` };
        try {
            const res = await fetch('/api/bookings/my', { headers });
            if (res.ok) {
                const json = await res.json();
                // FIX: Backend returns {success: true, data: [...]}
                setBookings(json.data || []);
            }
        } catch (e) {}
    };

    const fetchLabs = async () => {
        const headers = { 'Authorization': `Bearer ${token}` };
        try {
            const res = await fetch('/api/labs/all', { headers });
            if (res.ok) setLabs(await res.json());
        } catch (e) {}
    };

    const searchLabs = async (q) => {
        if (!q) return fetchLabs();
        const headers = { 'Authorization': `Bearer ${token}` };
        try {
            const res = await fetch(`/api/labs/search?q=${q}`, { headers });
            if (res.ok) setLabs(await res.json());
        } catch (e) {}
    };

    const createTicket = async (e) => {
        e.preventDefault();
        if (!token) {
            showToastMsg('Session expired. Please log in again.', 'error');
            navigate('/login');
            return;
        }

        const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
        const data = {
            title: e.target['t-title'].value,
            category: e.target['t-category'].value,
            roomId: e.target['t-room'].value,
            priority: e.target['t-priority'].value,
            description: e.target['t-description'].value
        };

        try {
            const res = await fetch('/api/tickets/create', { method: 'POST', headers, body: JSON.stringify(data) });
            if (res.ok) {
                setShowTicketModal(false);
                showToastMsg('Ticket submitted! We\'ll be on it shortly. 🚀');
                fetchTickets();
                return;
            }

            const errorData = await res.json().catch(() => ({}));
            const errorMsg = errorData.message || `Failed to submit ticket. (${res.status})`;
            showToastMsg(errorMsg, 'error');
            console.error('Submission failed:', errorData);
        } catch (err) {
            console.error('Network Error:', err);
            showToastMsg('Failed to connect to server. Check your connection.', 'error');
        }
    };

    const createBooking = async (e) => {
        e.preventDefault();
        const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
        const today = new Date().toISOString().split('T')[0];
        const data = {
            resourceName: e.target['b-resource'].value,
            startTime: `${today}T${e.target['b-start'].value}:00`,
            endTime: `${today}T${e.target['b-end'].value}:00`,
            status: 'PENDING'
        };
        try {
            const res = await fetch('/api/bookings', { method: 'POST', headers, body: JSON.stringify(data) });
            if (res.ok) {
                setShowBookingModal(false);
                showToastMsg('Booking success! See you there. 👋');
                fetchBookings();
            }
        } catch (e) {}
    };

    const cancelBooking = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;
        const headers = { 'Authorization': `Bearer ${token}` };
        try {
            const res = await fetch(`/api/bookings/${id}/cancel?cancelledBy=Student`, { method: 'POST', headers });
            if (res.ok) {
                fetchBookings();
                showToastMsg('Booking cancelled.', 'error');
            }
        } catch (e) {}
    };

    const markRead = async (id) => {
        const headers = { 'Authorization': `Bearer ${token}` };
        try {
            await fetch(`/api/notifications/${id}/read`, { method: 'PUT', headers });
            fetchNotifications();
        } catch (e) {}
    };

    const logout = () => {
        localStorage.removeItem('jwt_token');
        navigate('/login');
    };

    const hashCode = (str) => {
        if (!str) return 0;
        let h = 0;
        for (let c of str) h = ((h << 5) - h) + c.charCodeAt(0);
        return Math.abs(h);
    };

    return (
        <div className="flex min-h-screen bg-dots text-[#1e293b] font-['Plus_Jakarta_Sans',sans-serif] bg-[#f2f6fa]">
            <style>{`
                * { font-family: 'Plus Jakarta Sans', sans-serif; }
                .bg-dots { background-color: transparent; background-image: radial-gradient(#cbd5e1 1.2px, transparent 1.2px); background-size: 24px 24px; }
                .premium-card { background: #ffffff; box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.08), 0 0 10px rgba(0,0,0,0.02); border-radius: 32px; border: 1px solid rgba(255, 255, 255, 0.7); }
                .sidebar { background: #ffffff; border-right: 1px solid #f1f5f9; width: 280px; height: 100vh; position: sticky; top: 0; display: flex; flex-direction: column; padding: 32px 20px; flex-shrink: 0; z-index: 50; }
                .nav-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: 16px; font-size: 14px; font-weight: 700; color: #64748b; transition: all 0.2s; cursor: pointer; text-decoration: none; border: 1px solid transparent; width: 100%; text-align: left; }
                .nav-item:hover { background: #f8fafc; color: #3b82f6; }
                .nav-item.active { background: #eff6ff; color: #3b82f6; border: 1px solid #dbeafe; }
                .nav-item svg { width: 20px; height: 20px; flex-shrink: 0; }
                .mini-stat { background: white; border-radius: 24px; padding: 24px; border: 1px solid #f1f5f9; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 4px 20px rgba(0,0,0,0.02); }
                .mini-stat:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(0,0,0,0.06); border-color: #e2e8f0; }
                .ticket-row { border-bottom: 1px solid #f1f5f9; transition: background 0.15s; cursor: pointer; }
                .ticket-row:hover { background: #f8fafc; }
                .pulse-blue { width: 8px; height: 8px; border-radius: 50%; background: #3b82f6; animation: pb 1.4s infinite; }
                @keyframes pb { 0%{box-shadow:0 0 0 0 rgba(59,130,246,0.4)} 70%{box-shadow:0 0 0 8px rgba(59,130,246,0)} 100%{box-shadow:0 0 0 0 rgba(59,130,246,0)} }
                .form-input { width: 100%; height: 52px; padding: 0 18px; border: 1.5px solid #e2e8f0; border-radius: 14px; font-size: 14px; color: #1e293b; font-weight: 500; background: #f8fafc; outline: none; transition: all 0.2s; }
                .form-input:focus { border-color: #3b82f6; background: white; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.08); }
                .form-textarea { width: 100%; padding: 16px 18px; border: 1.5px solid #e2e8f0; border-radius: 14px; font-size: 14px; color: #1e293b; font-weight: 500; background: #f8fafc; outline: none; transition: all 0.2s; resize: none; }
                .form-textarea:focus { border-color: #3b82f6; background: white; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.08); }
                .modal-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.3); backdrop-filter: blur(8px); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 16px; }
                .modal-box { background: white; border-radius: 32px; padding: 40px; width: 100%; max-width: 560px; box-shadow: 0 40px 100px -20px rgba(0,0,0,0.15); animation: modalIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
                @keyframes modalIn { from { transform: scale(0.9) translateY(20px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }
                .notif-dropdown { position: absolute; right: 0; bottom: calc(100% + 12px); width: 340px; background: white; border: 1px solid #e2e8f0; border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.1); padding: 20px; z-index: 100; transition: all 0.2s; }
            `}</style>

            <aside className="sidebar">
                <div 
                    className="flex items-center gap-4 mb-10 pl-2 cursor-pointer group"
                    onClick={() => navigate('/')}
                >
                    <div className="w-10 h-10 rounded-[14px] bg-white flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.06)] border border-slate-100 group-hover:border-blue-200 transition-all">
                        <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                        </svg>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-[800] text-slate-900 tracking-[-0.03em] leading-none text-left group-hover:text-blue-600 transition-colors">Smart Campus</span>
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1 text-left">Student Portal</span>
                    </div>
                </div>

                <nav className="space-y-1.5 flex-grow">
                    {[
                        { id: 'dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
                        { id: 'tickets', label: 'My Tickets', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
                        { id: 'bookings', label: 'Bookings', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
                        { id: 'labs', label: 'Course Lab', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' }
                    ].map(item => (
                        <button key={item.id} onClick={() => { setCurrentSection(item.id); if(item.id === 'bookings') fetchBookings(); if(item.id === 'labs') fetchLabs(); }} className={`nav-item ${currentSection === item.id || (currentSection === 'tickets' && item.id === 'dashboard') ? (item.id === 'dashboard' && currentSection === 'tickets' ? '' : 'active') : ''} ${item.id === 'tickets' && currentSection === 'dashboard' ? '' : ''}`}>
                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d={item.icon}/></svg>
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="pt-6 border-t border-slate-100 relative" ref={notifWrapperRef}>
                    <div className="flex items-center gap-3 mb-5 px-2">
                        <div className="w-10 h-10 rounded-[12px] flex items-center justify-center text-sm font-black text-white shrink-0 shadow-lg shadow-blue-100" style={{ background: `hsl(${hashCode(userPayload.sub || userPayload.email) % 360}, 60%, 48%)` }}>
                            {(userPayload.sub || userPayload.email || '?')[0].toUpperCase()}
                        </div>
                        <div className="flex-grow overflow-hidden text-left">
                            <p className="text-[13px] font-[800] text-slate-900 truncate">{userPayload.sub || userPayload.email || 'Loading...'}</p>
                            <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">Verified Student</p>
                        </div>
                        <button onClick={() => setShowNotif(!showNotif)} className="relative p-2 text-slate-400 hover:text-blue-600 transition-colors focus:outline-none">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                            {notifications.some(n => !n.read) && <span className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>}
                        </button>
                    </div>
                    
                    {showNotif && (
                        <div className="notif-dropdown">
                            <div className="flex justify-between items-center mb-3">
                                <h4 className="font-black text-slate-900 text-sm tracking-tight">Updates</h4>
                                <button className="text-[10px] text-blue-600 font-bold uppercase tracking-wider hover:underline focus:outline-none">Mark all read</button>
                            </div>
                            <div className="space-y-1 max-h-[300px] overflow-y-auto pr-1">
                                {notifications.length === 0 ? <p className="text-xs text-center text-slate-400 py-6 font-medium">No new notifications</p> : notifications.map(n => (
                                    <div key={n.id} onClick={() => markRead(n.id)} className={`p-3 rounded-xl text-[12px] font-semibold transition-colors cursor-pointer ${!n.read ? 'bg-blue-50 text-blue-900 border-l-4 border-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}>
                                        <div>{n.message}</div>
                                        <div className="text-[10px] uppercase text-slate-400 mt-1 font-bold">{new Date(n.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <button onClick={logout} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[12px] font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-all focus:outline-none">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                        Sign Out
                    </button>
                </div>
            </aside>

            <main className="flex-grow p-10 max-w-[1240px] relative z-10 overflow-y-auto">
                {/* Dashboard / Tickets Section */}
                {(currentSection === 'dashboard' || currentSection === 'tickets') && (
                    <div id="section-dashboard">
                        <div className="mb-10 flex justify-between items-end">
                            <div>
                                <h1 className="text-[36px] font-[900] text-slate-900 tracking-tight text-left leading-tight">Student Hub</h1>
                                <p className="text-slate-500 font-medium mt-1 text-left">Report and track campus incidents from your personal hub.</p>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => setCurrentSection('bookings')} className="px-6 py-3 bg-white text-blue-600 border border-blue-200 rounded-xl text-sm font-bold shadow-sm hover:bg-blue-50 transition-all flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                    New Reservation
                                </button>
                                <button onClick={() => setShowTicketModal(true)} className="px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all">New Support Ticket</button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                            {[
                                { label: 'Total Tickets', val: stats.TOTAL, color: 'text-blue-600', bg: '#eff6ff', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
                                { label: 'Active Cases', val: stats.OPEN, color: 'text-amber-600', bg: '#fffbeb', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
                                { label: 'Reservations', val: bookingStats.TOTAL || 0, color: 'text-emerald-600', bg: '#f0fdf4', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' }
                            ].map(stat => (
                                <div key={stat.label} className="mini-stat flex items-center gap-5">
                                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ background: stat.bg }}>
                                        <svg className={`w-7 h-7 ${stat.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d={stat.icon}/></svg>
                                    </div>
                                    <div className="text-left">
                                        <div className="text-[32px] font-[900] text-slate-900 leading-none">{stat.val}</div>
                                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 ml-0.5">{stat.label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="premium-card overflow-hidden">
                            <div className="flex items-center justify-between px-10 py-7 border-b border-slate-50">
                                <div className="text-left">
                                    <h2 className="font-[850] text-slate-900 text-lg tracking-tight">My Support History</h2>
                                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1">Status and logs</p>
                                </div>
                                <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[11px] font-black text-blue-600 uppercase tracking-wider">
                                    <div className="pulse-blue"></div> LIVE Feed
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 text-[11px] font-[800] text-slate-400 uppercase tracking-[0.12em]">
                                            <th className="pl-10 py-4">Ticket ID</th>
                                            <th className="py-4">Issue Description</th>
                                            <th className="py-4">Location</th>
                                            <th className="py-4">Priority</th>
                                            <th className="py-4">Status</th>
                                            <th className="pr-10 py-4 text-right">Reported</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {allTickets.length === 0 ? (
                                            <tr><td colSpan="6" className="py-24 text-center text-slate-400 font-medium italic">No support logs found.</td></tr>
                                        ) : allTickets.map((t, i) => (
                                            <tr key={t.id} className="ticket-row" onClick={() => { setSelectedTicket(t); setShowDetailModal(true); }}>
                                                <td className="py-5 pl-10 font-black text-slate-400 text-[11px]">#{t.id}</td>
                                                <td className="py-5">
                                                    <div className="font-bold text-[13px] text-slate-800">{t.title}</div>
                                                    <div className="text-[11px] text-slate-400 truncate max-w-[200px] font-medium">{t.description}</div>
                                                </td>
                                                <td className="py-5">
                                                    <span className="text-[12px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">{t.roomId || t.location || '-'}</span>
                                                </td>
                                                <td className="py-5">
                                                    <span className={`px-2.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest inline-flex items-center justify-center min-w-[90px] border ${
                                                        t.priority === 'HIGH' ? 'bg-rose-50 text-rose-500 border-rose-100' : 
                                                        t.priority === 'MEDIUM' ? 'bg-amber-50 text-amber-500 border-amber-100' : 
                                                        'bg-slate-100 text-slate-400 border-slate-200'
                                                    }`}>
                                                        {t.priority === 'HIGH' ? '🔴 High' : t.priority === 'MEDIUM' ? '🟡 Medium' : '🟢 Low'}
                                                    </span>
                                                </td>
                                                <td className="py-5">
                                                    <span className={`px-2.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest inline-flex items-center justify-center min-w-[100px] border ${
                                                        t.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-500 border-emerald-100' : 
                                                        t.status === 'IN_PROGRESS' ? 'bg-amber-50 text-amber-500 border-amber-100' : 
                                                        'bg-blue-50 text-blue-600 border-blue-100'
                                                    }`}>
                                                        {t.status === 'IN_PROGRESS' ? 'In Progress' : t.status.charAt(0) + t.status.slice(1).toLowerCase()}
                                                    </span>
                                                </td>
                                                <td className="py-5 pr-10 text-right text-[11px] font-bold text-slate-400 uppercase tracking-tight">{Math.floor((Date.now() - new Date(t.createdAt).getTime()) / 60000) < 1 ? 'Just now' : Math.floor((Date.now() - new Date(t.createdAt).getTime()) / 60000) < 60 ? `${Math.floor((Date.now() - new Date(t.createdAt).getTime()) / 60000)}m ago` : `${Math.floor((Date.now() - new Date(t.createdAt).getTime()) / 3600000)}h ago`}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Bookings Section */}
                {currentSection === 'bookings' && (
                    <div id="section-bookings" className="animate-in fade-in duration-300">
                        <BookingPanel />
                    </div>
                )}

                {/* Course Labs Section */}
                {currentSection === 'labs' && (
                    <div id="section-labs" className="animate-in fade-in duration-300">
                        <div className="mb-10 text-left">
                            <h2 className="text-[32px] font-[900] text-slate-900 tracking-tight leading-tight">Course Lab Directory</h2>
                            <p className="text-slate-500 text-sm font-medium mt-1">Find the best lab resources for your modules.</p>
                        </div>
                        
                        <div className="premium-card p-6 mb-10 flex gap-4">
                            <div className="relative flex-grow">
                                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                                <input type="text" onChange={(e) => searchLabs(e.target.value)} className="form-input pl-12" placeholder="Search by name, location, or software (e.g. Docker)..."/>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {labs.length === 0 ? (
                                <div className="col-span-2 py-20 text-center text-slate-400 italic bg-white rounded-[32px] border border-slate-100">No labs matching your search.</div>
                            ) : labs.map(l => (
                                <div key={l.id} className="premium-card p-8 border-slate-50 text-left">
                                    <div className="flex justify-between items-start mb-6">
                                        <h4 className="font-[900] text-slate-900 text-xl tracking-tight">{l.labName}</h4>
                                        <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                                            l.available ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                                        }`}>
                                            {l.available ? 'Available' : 'Full'}
                                        </span>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 text-sm text-slate-600 font-bold">
                                            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">📍</div>
                                            {l.location}
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-slate-600 font-bold">
                                            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">👥</div>
                                            Capacity: {l.capacity} Slots
                                        </div>
                                        <div className="pt-4 flex flex-wrap gap-2">
                                            {l.software.split(',').map(s => (
                                                <span key={s} className="bg-slate-50 text-slate-500 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-100">
                                                    {s.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            {/* Support Ticket Modal */}
            {showTicketModal && (
                <div className="modal-overlay">
                    <div className="modal-box text-left">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h3 className="text-2xl font-[900] text-slate-900 tracking-tight">New Support Ticket</h3>
                                <p className="text-slate-400 text-sm font-medium mt-1">Help us resolve issues faster by being specific.</p>
                            </div>
                            <button onClick={() => setShowTicketModal(false)} className="text-slate-300 hover:text-slate-600 transition-colors p-1">✕</button>
                        </div>
                        <form onSubmit={createTicket} className="space-y-6">
                            <div>
                                <label className="block text-[11px] font-[800] text-slate-500 uppercase tracking-widest mb-3 ml-1">Issue Title</label>
                                <input type="text" name="t-title" required className="form-input" placeholder="e.g. Broken AC in Lab 5"/>
                            </div>
                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-[11px] font-[800] text-slate-500 uppercase tracking-widest mb-3 ml-1">Room / Location</label>
                                    <input type="text" name="t-room" required className="form-input" placeholder="Lab 101..."/>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-[800] text-slate-500 uppercase tracking-widest mb-3 ml-1">Category</label>
                                    <select name="t-category" required className="form-input">
                                        <option value="GENERAL">General Issue</option>
                                        <option value="NETWORK">Network Issue</option>
                                        <option value="EQUIPMENT">Equipment Failure</option>
                                        <option value="SOFTWARE">Software Problem</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-[800] text-slate-500 uppercase tracking-widest mb-3 ml-1">Priority Level</label>
                                    <select name="t-priority" className="form-input">
                                        <option value="LOW">🟢 Low Priority</option>
                                        <option value="MEDIUM">🟡 Medium Priority</option>
                                        <option value="HIGH">🔴 High Priority</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[11px] font-[800] text-slate-500 uppercase tracking-widest mb-3 ml-1">Technical Description</label>
                                <textarea name="t-description" rows="4" required className="form-textarea" placeholder="Provide as much detail as possible..."></textarea>
                            </div>
                            <button type="submit" className="w-full py-4 rounded-2xl text-white font-[800] text-sm bg-blue-600 shadow-xl shadow-blue-600/25 hover:bg-blue-700 transition-all">Submit Support Case</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Booking Modal */}
            {showBookingModal && (
                <div className="modal-overlay">
                    <div className="modal-box text-left">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h3 className="text-2xl font-[900] text-slate-900 tracking-tight">Facility Reservation</h3>
                                <p className="text-slate-400 text-sm font-medium mt-1">Please select research or study facility.</p>
                            </div>
                            <button onClick={() => setShowBookingModal(false)} className="text-slate-300 hover:text-slate-600 p-1">✕</button>
                        </div>
                        <form onSubmit={createBooking} className="space-y-6">
                            <div>
                                <label className="block text-[11px] font-[800] text-slate-500 uppercase tracking-widest mb-3 ml-1">Facility Name</label>
                                <select name="b-resource" className="form-input">
                                    <option value="Main Computer Lab">Main Computer Lab</option>
                                    <option value="Collaborative Study Room A">Collaborative Study Room A</option>
                                    <option value="Advanced Robotics Suite">Advanced Robotics Suite</option>
                                    <option value="Student Hub Private Booth">Student Hub Private Booth</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-[11px] font-[800] text-slate-500 uppercase tracking-widest mb-3 ml-1">Start Time</label>
                                    <input type="time" name="b-start" className="form-input" required/>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-[800] text-slate-500 uppercase tracking-widest mb-3 ml-1">End Time</label>
                                    <input type="time" name="b-end" className="form-input" required/>
                                </div>
                            </div>
                            <button type="submit" className="w-full py-4 rounded-2xl text-white font-[800] text-sm bg-blue-600 shadow-xl shadow-blue-600/25 hover:bg-blue-700 transition-all">Confirm Reservation</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Detail Modal */}
            {showDetailModal && selectedTicket && (
                <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
                    <div className="modal-box text-left" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Case Reference #{selectedTicket.id}</span>
                                <h3 className="text-[28px] font-[900] text-slate-900 tracking-tight leading-tight mt-1">{selectedTicket.title}</h3>
                            </div>
                            <button onClick={() => setShowDetailModal(false)} className="text-slate-300 hover:text-slate-600 p-1">✕</button>
                        </div>
                        <div className="space-y-0 text-left bg-slate-50 rounded-[28px] p-6 border border-slate-100">
                            <div className="flex justify-between py-3 border-b border-white/60"><span className="text-[11px] font-black text-slate-400 uppercase">Current Status</span><span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${selectedTicket.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>{selectedTicket.status}</span></div>
                            <div className="flex justify-between py-3 border-b border-white/60"><span className="text-[11px] font-black text-slate-400 uppercase">Priority Level</span><span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${selectedTicket.priority === 'HIGH' ? 'bg-rose-100 text-rose-500' : 'bg-amber-100 text-amber-500'}`}>{selectedTicket.priority}</span></div>
                            <div className="flex justify-between py-3 border-b border-white/60"><span className="text-[11px] font-black text-slate-400 uppercase">Location</span><span className="text-sm font-bold text-slate-700">{selectedTicket.roomId || selectedTicket.location}</span></div>
                            <div className="flex justify-between py-3"><span className="text-[11px] font-black text-slate-400 uppercase">Last Activity</span><span className="text-sm font-bold text-slate-700">{new Date(selectedTicket.updatedAt || selectedTicket.createdAt).toLocaleString()}</span></div>
                        </div>
                        <div className="mt-8 text-left">
                            <p className="text-[11px] font-[800] text-slate-400 uppercase tracking-widest mb-3 ml-1">Case Description</p>
                            <div className="bg-white border border-slate-100 p-6 rounded-2xl">
                                <p className="text-sm text-slate-600 font-medium leading-relaxed">{selectedTicket.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Premium Toast */}
            {toast.show && (
                <div className={`fixed bottom-8 right-8 z-[9999] px-6 py-4 rounded-[20px] font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-[0_30px_60px_rgba(0,0,0,0.12)] border-2 transition-all animate-in slide-in-from-bottom-10 ${
                    toast.type === 'success' ? 'bg-white text-emerald-600 border-emerald-50' : 'bg-white text-rose-600 border-rose-50'
                }`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${toast.type === 'success' ? 'bg-emerald-50' : 'bg-rose-50'}`}>
                        {toast.type === 'success' ? '✅' : '❌'}
                    </div>
                    {toast.message}
                </div>
            )}
        </div>
    );
};

export default StudentDashboard;
