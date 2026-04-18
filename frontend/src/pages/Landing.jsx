import React from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#f2f6fa] text-[#1e293b] font-['Plus_Jakarta_Sans',sans-serif] overflow-x-hidden selection:bg-blue-200">
            <style>{`
                .bg-dots-light {
                    background-color: transparent;
                    background-image: radial-gradient(#cbd5e1 1.2px, transparent 1.2px);
                    background-size: 24px 24px;
                }
                .text-gradient {
                    background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .hero-mockup-shadow {
                    box-shadow: 0 40px 100px -20px rgba(59, 130, 246, 0.25), 0 0 20px rgba(0,0,0,0.05);
                }
                .nav-link {
                    position: relative;
                    color: #475569;
                    font-weight: 600;
                    transition: color 0.2s ease;
                }
                .nav-link:hover {
                    color: #0f172a;
                }
                .btn-primary {
                    background: #3b82f6;
                    transition: all 0.2s ease;
                }
                .btn-primary:hover {
                    background: #2563eb;
                    box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.4);
                    transform: translateY(-1px);
                }
                .feature-card {
                    background: #ffffff;
                    border-radius: 24px;
                    border: 1px solid rgba(255, 255, 255, 0.7);
                    box-shadow: 0 4px 20px rgba(0,0,0,0.02);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .feature-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.06);
                    border-color: #e2e8f0;
                }
            `}</style>

            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 z-50 flex items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                <div className="w-full max-w-[1280px] px-6 lg:px-10 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-[42px] h-[42px] bg-white rounded-[12px] flex items-center justify-center shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-slate-100">
                            <svg className="w-[22px] h-[22px] text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                            </svg>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[20px] font-[800] text-slate-900 tracking-[-0.03em] leading-none">Smart Campus</span>
                            <span className="text-[10px] font-[700] text-blue-600 uppercase tracking-widest mt-1">Platform</span>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-10 text-[14px]">
                        <a href="#features" className="nav-link">Features</a>
                        <a href="#how-it-works" className="nav-link">How it works</a>
                        <a href="#roles" className="nav-link">Roles</a>
                    </div>

                    <div>
                        <button onClick={() => navigate('/login')} className="btn-primary px-6 py-2.5 rounded-full text-white text-[13.5px] font-[700] flex items-center gap-2">
                            Sign In
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-36 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden bg-dots-light">
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-100 rounded-full mix-blend-multiply blur-[100px] opacity-40 pointer-events-none"></div>
                
                <div className="w-full max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center relative z-10">
                    <div className="flex flex-col text-center lg:text-left self-center">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white rounded-full text-[12.5px] font-[800] text-blue-600 mb-8 w-fit mx-auto lg:mx-0 border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                            <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            Educational Relationship Management
                        </div>
                        <h1 className="text-[52px] sm:text-[64px] lg:text-[72px] font-[850] text-[#111827] leading-[1.05] tracking-[-0.04em] mb-6">
                            The ecosystem that <br/>
                            <span className="text-gradient">connects everyone</span> <br/>
                            on campus.
                        </h1>
                        <p className="text-[17px] text-[#64748b] font-[500] leading-relaxed mb-10 max-w-[500px] mx-auto lg:mx-0">
                            Smart Campus unifies admins, faculty, and students on one intelligent platform — with smart facility bookings, live incident reports, and granular access control.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                            <button onClick={() => navigate('/login')} className="btn-primary w-full sm:w-auto px-8 py-4 rounded-full text-white text-[15px] font-[700] flex items-center justify-center gap-2">
                                Get Started Free
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                            </button>
                            <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-slate-700 border border-slate-200 text-[15px] font-[700] flex items-center justify-center gap-2 hover:bg-slate-50 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-colors">
                                <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                See How It Works
                            </button>
                        </div>

                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 mt-12 text-[13px] font-[700] text-slate-500">
                            <div className="flex items-center gap-1.5"><svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg> RBAC Security</div>
                            <div className="flex items-center gap-1.5"><svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg> Custom Facilities</div>
                            <div className="flex items-center gap-1.5"><svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg> REST API</div>
                            <div className="flex items-center gap-1.5"><svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg> Real-time Logs</div>
                        </div>
                    </div>

                    {/* Mockup Presentation */}
                    <div className="relative mx-auto w-full max-w-[650px] lg:scale-105 xl:scale-110 xl:ml-10 mt-10 lg:mt-0">
                        {/* decorative element */}
                        <div className="absolute -top-6 -right-6 px-4 py-2 bg-white rounded-full text-xs font-black flex items-center gap-2 shadow-xl border border-slate-100 z-20 text-slate-700">
                            <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg></div>
                            RBAC Active
                        </div>
                        <div className="absolute -bottom-8 -left-8 px-5 py-3 bg-white rounded-2xl flex items-center gap-3 shadow-2xl border border-slate-100 z-20">
                            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-500">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
                            </div>
                            <div>
                                <div className="text-sm font-black text-slate-800">42 Tickets</div>
                                <div className="text-xs font-bold text-emerald-500 tracking-wider">↑ Resolved Today</div>
                            </div>
                        </div>

                        {/* Windows Mockup */}
                        <div className="hero-mockup-shadow rounded-2xl overflow-hidden bg-[#2D2A32] border border-slate-200/50">
                            <div className="h-8 bg-[#1E1C22] flex items-center px-4 gap-1.5 border-b border-black/20">
                                <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                                <div className="mx-auto bg-black/20 text-white/40 text-[10px] px-8 py-0.5 rounded flex items-center gap-2 font-mono">
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                                    localhost:3000/dashboard
                                </div>
                            </div>
                            <div className="flex h-[420px] bg-white">
                                {/* Sidebar */}
                                <div className="w-[140px] bg-slate-50 border-r border-slate-100 p-4 flex flex-col items-center">
                                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg mb-6 flex items-center justify-center">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z"/></svg>
                                    </div>
                                    <div className="w-full flex-grow space-y-3">
                                        <div className="h-6 w-full bg-blue-100 rounded-md"></div>
                                        <div className="h-6 w-full bg-slate-200 rounded-md"></div>
                                        <div className="h-6 w-full bg-slate-200 rounded-md"></div>
                                        <div className="h-6 w-full bg-slate-200 rounded-md"></div>
                                    </div>
                                </div>
                                {/* Content Area */}
                                <div className="flex-1 p-6 relative bg-dots-light">
                                    <div className="flex justify-between mb-6">
                                        <div className="w-48 h-8 bg-slate-200 rounded-full"></div>
                                        <div className="w-8 h-8 rounded-full bg-blue-600 shadow-lg shadow-blue-200"></div>
                                    </div>
                                    <div className="grid grid-cols-4 gap-3 mb-6">
                                        <div className="h-20 bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.03)] border border-slate-100 flex items-center p-3 gap-3">
                                            <div className="w-8 h-8 rounded bg-blue-50"></div>
                                            <div className="space-y-1"><div className="w-10 h-3 bg-slate-100 rounded"></div><div className="w-16 h-4 bg-slate-800 rounded"></div></div>
                                        </div>
                                        <div className="h-20 bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.03)] border border-slate-100 flex items-center p-3 gap-3">
                                            <div className="w-8 h-8 rounded bg-emerald-50"></div>
                                            <div className="space-y-1"><div className="w-10 h-3 bg-slate-100 rounded"></div><div className="w-16 h-4 bg-slate-800 rounded"></div></div>
                                        </div>
                                        <div className="h-20 bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.03)] border border-slate-100 flex items-center p-3 gap-3">
                                            <div className="w-8 h-8 rounded bg-amber-50"></div>
                                            <div className="space-y-1"><div className="w-10 h-3 bg-slate-100 rounded"></div><div className="w-16 h-4 bg-slate-800 rounded"></div></div>
                                        </div>
                                        <div className="h-20 bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.03)] border border-slate-100 flex items-center p-3 gap-3">
                                            <div className="w-8 h-8 rounded bg-rose-50"></div>
                                            <div className="space-y-1"><div className="w-10 h-3 bg-slate-100 rounded"></div><div className="w-16 h-4 bg-slate-800 rounded"></div></div>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 h-[180px]">
                                        <div className="flex-grow bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.03)] border border-slate-100 p-4 relative overflow-hidden">
                                            <div className="w-32 h-4 bg-slate-100 rounded mb-6"></div>
                                            {/* Dummy Chart line */}
                                            <svg className="w-full h-full absolute bottom-0 left-0 pt-10" preserveAspectRatio="none" viewBox="0 0 100 50">
                                                <path d="M0 40 L 20 30 L 40 35 L 60 15 L 80 25 L 100 10" fill="none" stroke="#3b82f6" strokeWidth="2" />
                                                <path d="M0 40 L 20 30 L 40 35 L 60 15 L 80 25 L 100 10 L 100 50 L 0 50 Z" fill="rgba(59, 130, 246, 0.1)" />
                                            </svg>
                                        </div>
                                        <div className="w-[180px] bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.03)] border border-slate-100 p-4 space-y-4">
                                            <div className="w-24 h-4 bg-slate-100 rounded"></div>
                                            <div className="flex gap-2 items-center"><div className="w-2 h-2 rounded-full bg-emerald-500"></div><div className="w-20 h-2 bg-slate-100 rounded"></div></div>
                                            <div className="flex gap-2 items-center"><div className="w-2 h-2 rounded-full bg-blue-500"></div><div className="w-24 h-2 bg-slate-100 rounded"></div></div>
                                            <div className="flex gap-2 items-center"><div className="w-2 h-2 rounded-full bg-amber-500"></div><div className="w-16 h-2 bg-slate-100 rounded"></div></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Gradient Banner Section */}
            <section className="bg-blue-600 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 py-12 px-6 relative font-['Plus_Jakarta_Sans']">
                <div className="max-w-[1000px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z", value: "3", label: "User Roles" },
                        { icon: "M13 10V3L4 14h7v7l9-11h-7z", value: "4", label: "Core Modules" },
                        { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", value: "100%", label: "RBAC Protected" },
                        { icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6", value: "Live", label: "Real-time Logs" },
                    ].map((stat, i) => (
                        <div key={i} className="flex flex-col items-center justify-center text-center text-white space-y-3">
                            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 backdrop-blur-sm">
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d={stat.icon}/></svg>
                            </div>
                            <div className="text-[36px] font-[900] leading-none tracking-tight">{stat.value}</div>
                            <div className="text-[13px] font-[600] text-blue-200 tracking-wider uppercase">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-28 px-6 bg-white border-b border-slate-100">
                <div className="max-w-[1280px] mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 rounded-full text-[12px] font-[800] text-blue-600 mb-6 border border-blue-100">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                            Platform Features
                        </div>
                        <h2 className="text-[42px] lg:text-[48px] font-[850] text-[#0f172a] tracking-tight leading-[1.1]">
                            Everything education needs, <br/>
                            <span className="text-gradient">built into one platform</span>
                        </h2>
                        <p className="text-[16px] text-slate-500 font-medium mt-6 max-w-[600px] mx-auto">
                            Powerful modules designed specifically for the campus ecosystem, working together seamlessly.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Feature 1 */}
                        <div className="feature-card p-8 bg-gradient-to-br from-white to-orange-50/30 border-t-4 border-t-orange-400">
                            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-500 mb-6">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
                            </div>
                            <h3 className="text-[17px] font-[800] text-slate-900 mb-3">Facility Bookings</h3>
                            <p className="text-[13px] font-[500] text-slate-500 leading-relaxed">Securely reserve computer labs and research rooms with instant confirmation and availability checking.</p>
                        </div>
                        {/* Feature 2 */}
                        <div className="feature-card p-8 bg-gradient-to-br from-white to-purple-50/30 border-t-4 border-t-purple-500">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-6">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                            </div>
                            <h3 className="text-[17px] font-[800] text-slate-900 mb-3">Role-Based Access</h3>
                            <p className="text-[13px] font-[500] text-slate-500 leading-relaxed">Fine-grained RBAC ensures every user sees exactly what they need — admins have full control.</p>
                        </div>
                        {/* Feature 3 */}
                        <div className="feature-card p-8 bg-gradient-to-br from-white to-blue-50/30 border-t-4 border-t-blue-500">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                            </div>
                            <h3 className="text-[17px] font-[800] text-slate-900 mb-3">Live Dashboards</h3>
                            <p className="text-[13px] font-[500] text-slate-500 leading-relaxed">Beautiful, data-rich dashboards tailored to each role showing real-time statistics and historical logs.</p>
                        </div>
                        {/* Feature 4 */}
                        <div className="feature-card p-8 bg-gradient-to-br from-white to-emerald-50/30 border-t-4 border-t-emerald-400">
                            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-6">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg>
                            </div>
                            <h3 className="text-[17px] font-[800] text-slate-900 mb-3">Lab Directories</h3>
                            <p className="text-[13px] font-[500] text-slate-500 leading-relaxed">Discover campus facilities instantly. Search by software packages or capacity for course assignments.</p>
                        </div>
                        {/* Feature 5 */}
                        <div className="feature-card p-8 bg-gradient-to-br from-white to-pink-50/30 border-t-4 border-t-pink-400">
                            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center text-pink-500 mb-6">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                            </div>
                            <h3 className="text-[17px] font-[800] text-slate-900 mb-3">Incident Reporting</h3>
                            <p className="text-[13px] font-[500] text-slate-500 leading-relaxed">Students and staff can raise hardware flags directly to maintenance, cutting downtime drastically.</p>
                        </div>
                        {/* Feature 6 */}
                        <div className="feature-card p-8 bg-gradient-to-br from-white to-indigo-50/30 border-t-4 border-t-indigo-500">
                            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-6">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
                            </div>
                            <h3 className="text-[17px] font-[800] text-slate-900 mb-3">Live Activity Feed</h3>
                            <p className="text-[13px] font-[500] text-slate-500 leading-relaxed">A specialized WebSocket feed broadcasts real-time system alerts directly to the administration center.</p>
                        </div>
                        {/* Feature 7 */}
                        <div className="feature-card p-8 bg-gradient-to-br from-white to-amber-50/30 border-t-4 border-t-amber-400">
                            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-500 mb-6">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                            </div>
                            <h3 className="text-[17px] font-[800] text-slate-900 mb-3">Unified Dashboard</h3>
                            <p className="text-[13px] font-[500] text-slate-500 leading-relaxed">Everything from resolving active cases to securing server rooms is grouped into one high-tech UI.</p>
                        </div>
                        {/* Feature 8 */}
                        <div className="feature-card p-8 bg-gradient-to-br from-white to-teal-50/30 border-t-4 border-t-teal-400">
                            <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center text-teal-600 mb-6">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>
                            </div>
                            <h3 className="text-[17px] font-[800] text-slate-900 mb-3">Developer APIs</h3>
                            <p className="text-[13px] font-[500] text-slate-500 leading-relaxed">Backed by a Spring Boot REST API for easy mobile integration and external system synchronization.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="py-24 px-6 bg-dots-light overflow-hidden">
                <div className="max-w-[1000px] mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 rounded-full text-[12px] font-[800] text-blue-600 mb-6 border border-blue-100 shadow-sm">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        How It Works
                    </div>
                    <h2 className="text-[42px] font-[850] text-[#0f172a] tracking-tight leading-[1.1] mb-16">
                        From setup to success <br/>
                        <span className="text-gradient">in four simple steps</span>
                    </h2>

                    <div className="flex flex-col md:flex-row items-start justify-between relative gap-10 md:gap-0">
                        {/* Connector Line */}
                        <div className="hidden md:block absolute top-[60px] left-[10%] right-[10%] h-[2px] bg-slate-200 z-0"></div>

                        {[
                            { step: "01", title: "Authenticate Securely", desc: "User registers or logs in via Google OAuth.", color: "text-blue-600", bg: "bg-blue-100", icon: "M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" },
                            { step: "02", title: "Access Tailored Hub", desc: "Admins navigate to the Command Center.", color: "text-purple-600", bg: "bg-purple-100", icon: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" },
                            { step: "03", title: "Report & Reserve", desc: "Report campus incidents or book crucial lab facilities.", color: "text-emerald-600", bg: "bg-emerald-100", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
                            { step: "04", title: "Real-time Resolution", desc: "Campus staff resolve incidents live, triggering alerts.", color: "text-indigo-600", bg: "bg-indigo-100", icon: "M13 10V3L4 14h7v7l9-11h-7z" }
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col items-center flex-1 relative z-10 px-4 group">
                                <div className={`w-28 h-28 rounded-full ${item.bg} flex items-center justify-center mb-[-24px] z-0 border-4 border-white shadow-sm transition-transform group-hover:-translate-y-2`}>
                                    <svg className={`w-12 h-12 ${item.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d={item.icon}/></svg>
                                </div>
                                <div className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center font-[900] text-lg border-4 border-white z-10 shadow-md">
                                    {item.step}
                                </div>
                                <div className="mt-5 text-center">
                                    <h4 className="font-[800] text-slate-900 text-[16px] mb-2">{item.title}</h4>
                                    <p className="text-[13px] text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Roles Section */}
            <section id="roles" className="py-24 px-6 bg-white border-t border-slate-100">
                <div className="max-w-[1280px] mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 rounded-full text-[12px] font-[800] text-blue-600 mb-6 border border-blue-100 shadow-sm">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                        User Roles
                    </div>
                    <h2 className="text-[42px] font-[850] text-[#0f172a] tracking-tight leading-[1.1] mb-5">
                        A tailored experience <br/>
                        <span className="text-gradient">for every stakeholder</span>
                    </h2>
                    <p className="text-[16px] text-slate-500 font-medium max-w-[600px] mx-auto mb-16">
                        Each role gets a custom dashboard, navigation, and permissions — perfectly scoped to their campus needs.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1280px] mx-auto">
                        
                        {/* Admin Role */}
                        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] text-left hover:border-blue-200 transition-colors">
                            <div className="mb-8 flex justify-center">
                                {/* SVG Character abstract */}
                                <div className="relative w-28 h-28">
                                    <div className="absolute inset-0 bg-blue-50 rounded-2xl flex flex-col justify-end items-center overflow-hidden">
                                        <div className="w-12 h-12 bg-[#2D2A32] rounded-full mb-1 flex items-center justify-center">
                                            <div className="flex gap-2">
                                                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                            </div>
                                        </div>
                                        <div className="w-20 h-10 bg-blue-600 rounded-t-3xl"></div>
                                    </div>
                                    <div className="absolute -right-2 -top-2 w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center text-blue-600">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="px-3 py-1 bg-blue-600 text-white rounded-[10px] shadow-lg shadow-blue-200">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                                </div>
                                <h3 className="text-[19px] font-[850] text-slate-900">Admin</h3>
                            </div>
                            <ul className="space-y-3">
                                {["Full system control", "Live incident feed", "Staff task delegation", "Analytical overview"].map((i, k) => (
                                    <li key={k} className="flex items-start gap-3 text-[13px] font-[600] text-slate-600">
                                        <svg className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                                        {i}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Teacher/Faculty Role */}
                        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] text-left hover:border-indigo-200 transition-colors">
                            <div className="mb-8 flex justify-center">
                                {/* SVG Character abstract */}
                                <div className="relative w-28 h-28">
                                    <div className="absolute inset-0 bg-indigo-50 rounded-2xl flex flex-col justify-end items-center overflow-hidden">
                                        <div className="w-12 h-12 bg-amber-800 rounded-full mb-1 flex items-center justify-center">
                                            <div className="flex gap-2">
                                                <div className="w-1.5 h-1.5 bg-amber-100 rounded-full"></div>
                                                <div className="w-1.5 h-1.5 bg-amber-100 rounded-full"></div>
                                            </div>
                                        </div>
                                        <div className="w-20 h-10 bg-indigo-500 rounded-t-3xl"></div>
                                    </div>
                                    <div className="absolute -left-2 -top-2 w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center text-indigo-500">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="px-3 py-1 bg-indigo-500 text-white rounded-[10px] shadow-lg shadow-indigo-200">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                                </div>
                                <h3 className="text-[19px] font-[850] text-slate-900">Academic Staff</h3>
                            </div>
                            <ul className="space-y-3">
                                {["Lecturer access control", "Lab class management", "Student profile overview", "Resource scheduling"].map((i, k) => (
                                    <li key={k} className="flex items-start gap-3 text-[13px] font-[600] text-slate-600">
                                        <svg className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                                        {i}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Student Role */}
                        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] text-left hover:border-emerald-200 transition-colors">
                            <div className="mb-8 flex justify-center">
                                {/* SVG Character abstract */}
                                <div className="relative w-28 h-28">
                                    <div className="absolute inset-0 bg-emerald-50 rounded-2xl flex flex-col justify-end items-center overflow-hidden">
                                        <div className="w-12 h-10 bg-[#2D2A32] rounded-t-2xl mb-1 flex justify-center pt-3">
                                            <div className="flex gap-2">
                                                <div className="w-1 h-1 bg-white rounded-full"></div>
                                                <div className="w-1 h-1 bg-white rounded-full"></div>
                                            </div>
                                        </div>
                                        <div className="w-24 h-12 bg-emerald-500 rounded-t-3xl border-t-[8px] border-emerald-400"></div>
                                    </div>
                                    <div className="absolute -right-2 -bottom-2 w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center text-emerald-600">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 14l9-5-9-5-9 5 9 5z"/><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/></svg>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="px-3 py-1 bg-emerald-500 text-white rounded-[10px] shadow-lg shadow-emerald-200">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M12 14l9-5-9-5-9 5 9 5z"/><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/></svg>
                                </div>
                                <h3 className="text-[19px] font-[850] text-slate-900">Student</h3>
                            </div>
                            <ul className="space-y-3">
                                {["Personal hub", "Facility booking", "Incident reporting", "Lab availability check"].map((i, k) => (
                                    <li key={k} className="flex items-start gap-3 text-[13px] font-[600] text-slate-600">
                                        <svg className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                                        {i}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Guardian / Parent Role */}
                        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] text-left hover:border-amber-200 transition-colors">
                            <div className="mb-8 flex justify-center">
                                {/* SVG Character abstract */}
                                <div className="relative w-28 h-28">
                                    <div className="absolute inset-0 bg-amber-50 rounded-2xl flex flex-col justify-end items-center overflow-hidden">
                                        <div className="w-12 h-12 bg-amber-700 rounded-full mb-1 flex items-center justify-center">
                                            <div className="flex gap-2">
                                                <div className="w-1.5 h-1.5 bg-amber-100 rounded-full"></div>
                                                <div className="w-1.5 h-1.5 bg-amber-100 rounded-full"></div>
                                            </div>
                                        </div>
                                        <div className="w-20 h-10 bg-amber-500 rounded-t-2xl"></div>
                                    </div>
                                    <div className="absolute -left-2 -bottom-2 w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center text-amber-500">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="px-3 py-1 bg-amber-500 text-white rounded-[10px] shadow-lg shadow-amber-200">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                </div>
                                <h3 className="text-[19px] font-[850] text-slate-900">Maintenance</h3>
                            </div>
                            <ul className="space-y-3">
                                {["Technical support", "Incident ticket resolution", "Facility maintenance", "Hardware health checks"].map((i, k) => (
                                    <li key={k} className="flex items-start gap-3 text-[13px] font-[600] text-slate-600">
                                        <svg className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                                        {i}
                                    </li>
                                ))}
                            </ul>
                        </div>

                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="bg-gradient-to-br from-blue-600 to-indigo-700 py-28 px-6 text-center text-white">
                <div className="max-w-[800px] mx-auto">
                    <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white/10 rounded-full text-[12px] font-[800] border border-white/20 mb-8 backdrop-blur-sm">
                        <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>
                        Ready to transform your institution?
                    </div>
                    <h2 className="text-[40px] md:text-[54px] font-[900] leading-[1.1] tracking-tight mb-6">
                        Start building smarter <br className="hidden md:block" />
                        educational connections today
                    </h2>
                    <p className="text-[16px] text-blue-100 font-[500] max-w-[600px] mx-auto mb-10 leading-relaxed">
                        Sign in now and explore the full ERM platform — all demo accounts are pre-seeded and ready to explore.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
                        <button onClick={() => navigate('/login')} className="px-8 py-4 bg-white text-blue-600 rounded-full text-[15px] font-[800] flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors shadow-xl shadow-black/10">
                            Get Started Now
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                        </button>
                        <a href="#features" className="px-8 py-4 bg-white/10 border border-white/20 text-white rounded-full text-[15px] font-[800] flex items-center justify-center gap-2 hover:bg-white/20 transition-colors">
                            View Features
                        </a>
                    </div>
                    
                    <div className="flex flex-wrap justify-center gap-3">
                        <span className="px-4 py-2 rounded-full border border-white/20 bg-white/5 text-[13px] font-[600] text-blue-100">Try as Admin</span>
                        <span className="px-4 py-2 rounded-full border border-white/20 bg-white/5 text-[13px] font-[600] text-blue-100">Try as Academic Staff</span>
                        <span className="px-4 py-2 rounded-full border border-white/20 bg-white/5 text-[13px] font-[600] text-emerald-300 drop-shadow-md">Try as Student</span>
                        <span className="px-4 py-2 rounded-full border border-white/20 bg-white/5 text-[13px] font-[600] text-blue-100">Try as Maintenance</span>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#0f172a] py-12 px-6 border-t border-slate-800">
                <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                            </svg>
                        </div>
                        <div className="flex flex-col text-left">
                            <span className="text-[16px] font-[800] text-white tracking-tight leading-none">SmartCampus</span>
                            <span className="text-[10px] font-bold text-slate-500 uppercase mt-0.5 tracking-wider">Educational Platform</span>
                        </div>
                    </div>
                    
                    <div className="flex gap-8 text-[13px] font-[600] text-slate-400">
                        <a href="#features" className="hover:text-white transition-colors">Features</a>
                        <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
                        <a href="#roles" className="hover:text-white transition-colors">Roles</a>
                        <button onClick={() => navigate('/login')} className="hover:text-white transition-colors">Sign In</button>
                    </div>
                    
                    <div className="text-[12px] font-[600] text-slate-600">
                        &copy; 2026 Smart Campus - Group WE_308_1.2
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
