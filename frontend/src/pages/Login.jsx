import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [isMfaStep, setIsMfaStep] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        regName: '',
        otpCode: ''
    });
    const [btnText, setBtnText] = useState('Sign In To Dashboard');
    const [isLoading, setIsLoading] = useState(false);
    const [toasts, setToasts] = useState([]);

    const showToast = (message, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    };

    const toggleForm = () => {
        setIsLogin(!isLogin);
        setBtnText(!isLogin ? 'Sign In To Dashboard' : 'Register New Account');
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setBtnText(isMfaStep ? 'Verifying Code...' : (isLogin ? 'Authenticating...' : 'Creating...'));

        const endpoint = isMfaStep ? '/api/users/login/verify' : (isLogin ? '/api/users/login' : '/api/users/register');
        const payload = isMfaStep 
            ? { email: formData.email, otp: formData.otpCode } 
            : (isLogin ? { email: formData.email, password: formData.password } : { name: formData.regName, email: formData.email, password: formData.password });

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            
            const text = await res.text();
            let data = {};
            try { data = text ? JSON.parse(text) : {}; } catch(e) { data = { message: text }; }

            setIsLoading(false);

            // Handle MFA Trigger (202 Accepted)
            if (res.status === 202 && data?.status === 'MFA_REQUIRED') {
                setIsMfaStep(true);
                setBtnText('Verify & Complete Login');
                showToast('Code sent to your email.', 'success');
                return;
            }

            if (res.ok) {
                if (isLogin || isMfaStep) {
                    if (data?.jwt_token) {
                        localStorage.setItem('jwt_token', data.jwt_token);
                    }
                    showToast('Authentication successful.', 'success');
                    setTimeout(() => {
                        let roleValue = data?.user?.role || data?.role || 'STUDENT';
                        let role = typeof roleValue === 'string' ? roleValue.toUpperCase() : 'STUDENT';
                        if (role.startsWith('ROLE_')) role = role.substring(5);
                        
                        // Map roles to dashboards
                        if (role === 'ADMIN') {
                            navigate('/admin');
                        } else {
                            // STUDENT, ACADEMIC_STAFF, etc. all go to main dashboard for now
                            navigate('/dashboard');
                        }
                    }, 1200);
                } else {
                    showToast('Account created! Please sign in.', 'success');
                    setIsLogin(true);
                    setBtnText('Sign In To Dashboard');
                }
            } else {
                setBtnText(isMfaStep ? 'Verify & Complete Login' : (isLogin ? 'Sign In To Dashboard' : 'Register New Account'));
                showToast(data?.message || data?.error || 'Validation failed.', 'error');
            }
        } catch (err) {
            setIsLoading(false);
            setBtnText(isMfaStep ? 'Verify & Complete Login' : (isLogin ? 'Sign In To Dashboard' : 'Register New Account'));
            showToast('Unable to connect to server.', 'error');
            console.error('Fetch Error:', err);
        }
    };

    return (
        <div className="min-h-screen relative flex flex-col pt-8 pb-16 text-[#1e293b] font-['Plus_Jakarta_Sans',sans-serif] bg-[#f2f6fa] overflow-x-hidden">
            <style>{`
                .bg-dots {
                    background-color: transparent;
                    background-image: radial-gradient(#cbd5e1 1.2px, transparent 1.2px);
                    background-size: 24px 24px;
                }
                .text-gradient {
                    background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .premium-card {
                    background: #ffffff;
                    box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.08), 0 0 10px rgba(0,0,0,0.02);
                    border-radius: 32px;
                }
                .premium-input {
                    background: #ffffff;
                    border: 1px solid #e2e8f0;
                    transition: all 0.2s ease;
                }
                .premium-input:focus {
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
                    outline: none;
                }
                .toast-enter { transform: translateY(100%) scale(0.95); opacity: 0; }
                .toast-enter-active { transform: translateY(0) scale(1); opacity: 1; transition: all 0.3s ease; }
            `}</style>

            {/* Background Layer */}
            <div className="absolute inset-0 bg-dots opacity-[0.35] z-0 pointer-events-none"></div>
            <div className="absolute w-[600px] h-[600px] bg-blue-100 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 top-[-10%] left-[-10%] pointer-events-none z-0"></div>

            {/* Custom Campus Navbar */}
            <nav className="w-full max-w-[1140px] mx-auto px-6 sm:px-8 flex justify-between items-center z-20 relative">
                <div 
                    className="flex items-center gap-4 cursor-pointer group"
                    onClick={() => navigate('/')}
                >
                    <div className="w-[46px] h-[46px] bg-white rounded-[14px] flex items-center justify-center shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-slate-100 group-hover:border-blue-200 transition-all">
                        <svg className="w-[24px] h-[24px] text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                        </svg>
                    </div>
                    <span className="text-[28px] font-[800] text-slate-900 tracking-[-0.04em] ml-1 group-hover:text-blue-600 transition-colors">Smart Campus</span>
                </div>
                
                <div className="hidden md:flex items-center gap-8 lg:gap-[40px] text-[14px] font-[600] text-slate-500">
                    <button onClick={() => navigate('/')} className="hover:text-blue-600 transition-colors font-[700]">Home</button>
                    <a href="#" className="hover:text-slate-900 transition-colors">Academics</a>
                    <a href="#" className="hover:text-slate-900 transition-colors">Directory</a>
                    <a href="#" className="hover:text-slate-900 transition-colors">IT Support</a>
                </div>
                
                <div className="hidden md:flex">
                    <button className="px-[22px] py-[10px] bg-white text-blue-600 rounded-full text-[13.5px] font-[700] hover:bg-slate-50 transition-all border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                        Campus Portal
                    </button>
                </div>
            </nav>

            {/* Main Grid */}
            <div className="flex-grow w-full max-w-[1140px] mx-auto px-6 sm:px-8 mt-12 lg:mt-0 flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
                {/* Left Side: Marketing */}
                <div className="w-full lg:w-[52%] flex flex-col justify-center text-center lg:text-left pt-6">
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-[7px] bg-white rounded-full text-[11.5px] font-[800] text-blue-600 mb-[26px] w-fit mx-auto lg:mx-0 shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-slate-200">
                        <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        Smart Authentication
                    </div>
                    <h1 className="text-[44px] sm:text-[56px] lg:text-[62px] font-[800] text-[#111827] leading-[1.05] tracking-[-0.04em] mb-[22px]">
                        The gateway that <br className="hidden lg:block"/>
                        <span className="text-gradient">empowers learning</span> <br className="hidden lg:block"/>
                        across campus.
                    </h1>
                    <p className="text-[16px] text-[#64748b] font-[500] leading-[1.65] mb-[38px] max-w-[440px] mx-auto lg:mx-0 tracking-[-0.01em]">
                        Access your classes, grades, and administrative tools in a single, secure environment designed specifically for modern university ecosystems.
                    </p>
                    <div className="flex flex-wrap gap-x-6 gap-y-4 justify-center lg:justify-start">
                        {['Student Hub', 'Faculty Dashboard', 'Admin Access'].map((hub) => (
                            <div key={hub} className="flex items-center gap-2.5 text-[13.5px] font-[700] text-slate-700">
                                <div className="w-[20px] h-[20px] rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                    <svg className="w-[12px] h-[12px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                                </div>
                                {hub}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Side: Login Card */}
                <div className="w-full lg:w-[48%] flex justify-center lg:justify-end relative lg:pr-8">
                    <div className="premium-card w-full max-w-[420px] p-[40px] relative z-10">
                        <div className="mb-[32px]">
                            <h3 className="text-[25px] font-[800] text-[#0f172a] tracking-[-0.03em] mb-[6px]">
                                {isMfaStep ? 'Two-Factor Auth' : (isLogin ? 'Account Login' : 'Create Account')}
                            </h3>
                            <p className="text-[#64748b] text-[13.5px] font-[500]">
                                {isMfaStep ? 'Please enter your unique 6-digit code.' : (isLogin ? 'Enter your network credentials.' : 'Join the smart campus network.')}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-[22px]">
                            {/* Registration Name Field */}
                            {!isLogin && !isMfaStep && (
                                <div className="space-y-[8px]">
                                    <label className="block text-[12.5px] font-[700] text-[#334155] ml-0.5">Full Name</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-[16px] flex items-center pointer-events-none text-slate-400">
                                            <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <input type="text" id="regName" value={formData.regName} onChange={handleInputChange} className="premium-input w-full pl-[44px] pr-4 h-[48px] rounded-[10px] text-[14px] text-slate-900 placeholder-[#94a3b8] font-[500]" placeholder="Alex Johnson" />
                                    </div>
                                </div>
                            )}

                            {/* MFA Step */}
                            {isMfaStep && (
                                <div className="space-y-[8px]">
                                    <label className="block text-[12.5px] font-[700] text-[#334155] ml-0.5">Verification Code</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-[16px] flex items-center pointer-events-none text-blue-500">
                                            <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                        </div>
                                        <input type="text" id="otpCode" value={formData.otpCode} onChange={handleInputChange} className="premium-input w-full pl-[44px] pr-4 h-[48px] rounded-[10px] text-[18px] tracking-[6px] font-[800] text-blue-600 placeholder-slate-300 text-center" placeholder="000000" maxLength="6" />
                                    </div>
                                    <p className="text-[12px] text-slate-500 text-center font-[500]">Enter the 6-digit code sent to your email.</p>
                                </div>
                            )}

                            {/* Standard Fields */}
                            {!isMfaStep && (
                                <>
                                    <div className="space-y-[8px]">
                                        <label className="block text-[12.5px] font-[700] text-[#334155] ml-0.5">University Email</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-[16px] flex items-center pointer-events-none text-slate-400">
                                                <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                                </svg>
                                            </div>
                                            <input type="email" id="email" value={formData.email} onChange={handleInputChange} className="premium-input w-full pl-[44px] pr-4 h-[48px] rounded-[10px] text-[14px] text-slate-900 placeholder-[#94a3b8] font-[500]" placeholder="student@smartcampus.com" required />
                                        </div>
                                    </div>
                                    <div className="space-y-[8px]">
                                        <div className="flex justify-between items-center ml-0.5">
                                            <label className="block text-[12.5px] font-[700] text-[#334155]">Password</label>
                                            <a href="#" className="text-[12px] font-[700] text-[#3b82f6] hover:text-blue-700">Recover?</a>
                                        </div>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-[16px] flex items-center pointer-events-none text-slate-400">
                                                <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                            </div>
                                            <input type="password" id="password" value={formData.password} onChange={handleInputChange} className="premium-input w-full pl-[44px] pr-4 h-[48px] rounded-[10px] text-[14px] text-slate-900 placeholder-[#94a3b8] font-[500]" placeholder="••••••••" required />
                                        </div>
                                    </div>
                                </>
                            )}
                            
                            <button type="submit" disabled={isLoading} className="bg-[#3b82f6] hover:bg-[#2563eb] mt-[32px] w-full h-[52px] rounded-[10px] text-white font-[700] text-[14.5px] transition-colors flex justify-center items-center gap-2 relative disabled:opacity-70">
                                <span>{btnText}</span>
                                {isLoading && (
                                    <svg className="absolute right-6 w-[20px] h-[20px] text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                    </svg>
                                )}
                            </button>

                            {!isMfaStep && (
                                <p className="text-center text-[13px] font-[600] text-slate-500 mt-6">
                                    <span>{isLogin ? "Don't have an account?" : "Already have an account?"}</span> 
                                    <button type="button" onClick={toggleForm} className="text-blue-600 hover:text-blue-700 ml-1">{isLogin ? 'Create one' : 'Sign in'}</button>
                                </p>
                            )}

                            {/* OAuth Section */}
                            {!isMfaStep && isLogin && (
                                <div>
                                    <div className="relative flex py-4 items-center">
                                        <div className="flex-grow border-t border-slate-200"></div>
                                        <span className="flex-shrink mx-4 text-slate-400 text-[12px] font-[700] tracking-wider">OR</span>
                                        <div className="flex-grow border-t border-slate-200"></div>
                                    </div>
                                    <a href="/oauth2/authorization/google" className="flex items-center justify-center gap-3 w-full h-[52px] rounded-[10px] border border-slate-200 bg-white hover:bg-slate-50 transition-all font-[700] text-[14px] text-slate-700 shadow-[0_2px_8px_rgba(0,0,0,0.02)] text-decoration-none">
                                        <svg className="w-[20px] h-[20px]" viewBox="0 0 24 24">
                                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                        </svg>
                                        <span>Continue with Google</span>
                                    </a>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>

            {/* Toast Container */}
            <div className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 z-50 flex flex-col gap-4 pointer-events-none">
                {toasts.map(toast => (
                    <div key={toast.id} className={`pointer-events-auto flex items-center gap-3 w-[300px] py-[14px] px-[18px] rounded-[14px] shadow-[0_15px_30px_-10px_rgba(0,0,0,0.1)] border bg-white font-[600] text-[13.5px] text-slate-800 tracking-[-0.01em] whitespace-nowrap transition-all duration-300 ${toast.type === 'success' ? 'border-emerald-100 ring-1 ring-emerald-500/10' : 'border-rose-100 ring-1 ring-rose-500/10'} toast-enter toast-enter-active`}>
                        <div className={`w-[26px] h-[26px] flex items-center justify-center rounded-full shrink-0 ${toast.type === 'success' ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
                            {toast.type === 'success' ? (
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                            ) : (
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                            )}
                        </div>
                        <span>{toast.message}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Login;
