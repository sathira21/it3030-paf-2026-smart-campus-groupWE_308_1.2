import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');

        if (token) {
            localStorage.setItem('jwt_token', token);
            // Decode token to see role for proper redirection
            try {
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const payload = JSON.parse(atob(base64));
                console.log('Decoded Token Payload:', payload);
                
                // Robust role extraction: check for role or roles, handle array or string
                let rawRole = payload.role || payload.roles || 'STUDENT';
                let roleString = String(rawRole).toUpperCase();
                
                // If it's the Spring Security format [ROLE_ADMIN], extract the inside
                if (roleString.includes('ROLE_ADMIN')) {
                    roleString = 'ADMIN';
                } else if (roleString.includes('ROLE_STUDENT')) {
                    roleString = 'STUDENT';
                } else {
                    // Fallback to strip punctuation and ROLE_ prefix
                    roleString = roleString.replace(/[\[\]]/g, '').replace('ROLE_', '').trim();
                }
                
                console.log('Final Parsed Role:', roleString);

                if (roleString === 'ADMIN') {
                    navigate('/admin');
                } else {
                    navigate('/dashboard');
                }
            } catch (e) {
                console.error('Failed to parse token', e);
                navigate('/dashboard');
            }
        } else {
            navigate('/login');
        }
    }, [location, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f2f6fa]">
            <div className="text-center">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <h2 className="text-xl font-bold text-slate-900">Finalizing Identity...</h2>
                <p className="text-slate-500 text-sm mt-2">Connecting you to the Smart Campus network.</p>
            </div>
        </div>
    );
};

export default AuthSuccess;
