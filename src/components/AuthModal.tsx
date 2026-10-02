import React, { useState } from 'react';
import { 
  X, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Lock, 
  User, 
  ArrowRight, 
  LogIn,
  UserPlus,
  AlertCircle,
  Briefcase,
  Building,
  ShoppingBag,
  Sparkles,
  Check
} from 'lucide-react';
import { UserProfile, UserRole } from '../types/property';
import { BRAND_CONFIG } from '../data/mockProperties';
import { sanitizeUserPhone, resolveUserDisplayName } from '../utils/phoneSanitizer';
import { 
  loginWithEmail, 
  registerWithEmail, 
  loginWithGoogle, 
  updateUserProfileInFirestore 
} from '../services/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  initialMode?: 'login' | 'signup' | 'admin';
  customMessage?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'login',
  customMessage,
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'admin'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('Buyer');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Post-Google First-Time Role Picker Prompt
  const [googleUserPendingRole, setGoogleUserPendingRole] = useState<UserProfile | null>(null);

  // Sync mode when initialMode changes or modal opens
  React.useEffect(() => {
    if (isOpen) {
      setAuthMode(initialMode);
      setErrorMessage('');
      setEmail('');
      setPassword('');
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const getFirebaseErrorMessage = (err: any): string => {
    const code = err?.code || '';
    if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
      return 'Invalid email or password. Please verify your credentials or create a new account.';
    }
    if (code === 'auth/email-already-in-use') {
      return 'An account with this email already exists. Please log in instead.';
    }
    if (code === 'auth/weak-password') {
      return 'Password should be at least 6 characters long.';
    }
    if (code === 'auth/invalid-email') {
      return 'Please enter a valid email address.';
    }
    if (code === 'auth/popup-closed-by-user') {
      return 'Google sign-in popup was closed before completing. Please try again.';
    }
    if (code === 'auth/network-request-failed') {
      return 'Network connection issue. Please check your internet connection.';
    }
    if (code === 'auth/unauthorized-domain') {
      const host = typeof window !== 'undefined' ? window.location.hostname : 'your domain';
      return `Domain "${host}" is not authorized. Please add "${host}" to Firebase Console -> Authentication -> Settings -> Authorized Domains.`;
    }
    if (code === 'auth/popup-blocked') {
      return 'Sign-in popup was blocked by your browser. Please allow popups for this site and try again.';
    }
    if (code === 'auth/operation-not-allowed') {
      return 'Google Sign-in is not enabled in Firebase Console. Please enable Google under Authentication > Sign-in method.';
    }
    return err?.message || 'Authentication failed. Please try again.';
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage('');
    setIsLoading(true);
    try {
      const { user: userProfile, isNewUser } = await loginWithGoogle();
      setIsLoading(false);

      if (isNewUser || userProfile.pendingRoleSelection) {
        // Trigger the mandatory first-login role selection modal prompt
        setGoogleUserPendingRole(userProfile);
      } else {
        onLoginSuccess(userProfile);
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(getFirebaseErrorMessage(err));
    }
  };

  const handleSelectGoogleRoleAndProceed = async (selectedRole: UserRole) => {
    if (!googleUserPendingRole) return;
    setIsLoading(true);

    const updatedUser: UserProfile = {
      ...googleUserPendingRole,
      role: selectedRole,
      pendingRoleSelection: false
    };

    try {
      await updateUserProfileInFirestore(googleUserPendingRole.email, {
        role: selectedRole,
        pendingRoleSelection: false
      });
    } catch (e) {
      console.warn('Role update notice:', e);
    }

    setIsLoading(false);
    setGoogleUserPendingRole(null);
    onLoginSuccess(updatedUser);
  };

  const handleFirebaseLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!cleanPassword || cleanPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    const AUTHORIZED_ADMIN_EMAIL = 'supportvillasell@gmail.com';
    const validAdminPasswords = [
      '123456',
      '12345678',
      'admin@8383826205',
      'admin@123',
      'admin123',
      'admin',
      '8383826205'
    ];

    // If logging in from Admin tab (Strict Restriction)
    if (authMode === 'admin') {
      // 1. Strict Email Check: Only official authorized admin email allowed
      if (cleanEmail !== AUTHORIZED_ADMIN_EMAIL && cleanEmail !== BRAND_CONFIG.email.toLowerCase()) {
        setErrorMessage('Access Denied: Invalid administrator credentials. Please verify your admin ID and password.');
        return;
      }

      // 2. Strict Password Check: Must match valid admin password (e.g. 123456)
      if (!validAdminPasswords.includes(cleanPassword.toLowerCase()) && cleanPassword !== '123456') {
        setErrorMessage('Access Denied: Invalid administrator credentials. Please verify your admin ID and password.');
        return;
      }

      // Authorized Super Admin profile
      const adminProfile: UserProfile = {
        name: 'VillaSell Admin (Super Admin)',
        email: AUTHORIZED_ADMIN_EMAIL,
        phone: BRAND_CONFIG.phone,
        role: 'Admin',
        city: 'Varanasi',
        pendingRoleSelection: false
      };
      onLoginSuccess(adminProfile);
      return;
    }

    // Regular Sign In tab: If Admin logs in from here with valid credentials
    if (
      (cleanEmail === AUTHORIZED_ADMIN_EMAIL || cleanEmail === BRAND_CONFIG.email.toLowerCase()) &&
      (validAdminPasswords.includes(cleanPassword.toLowerCase()) || cleanPassword === '123456')
    ) {
      const adminProfile: UserProfile = {
        name: 'VillaSell Admin (Super Admin)',
        email: AUTHORIZED_ADMIN_EMAIL,
        phone: BRAND_CONFIG.phone,
        role: 'Admin',
        city: 'Varanasi',
        pendingRoleSelection: false
      };
      onLoginSuccess(adminProfile);
      return;
    }

    setIsLoading(true);
    try {
      const userProfile = await loginWithEmail(cleanEmail, cleanPassword);
      // Strictly ensure ONLY official supportvillasell@gmail.com can ever have Admin role
      if (cleanEmail === AUTHORIZED_ADMIN_EMAIL || cleanEmail === BRAND_CONFIG.email.toLowerCase()) {
        userProfile.role = 'Admin';
      } else if (userProfile.role === 'Admin') {
        // Demote any other unauthorized user account to Buyer
        userProfile.role = 'Buyer';
      }
      userProfile.name = userProfile.name || resolveUserDisplayName(null, userProfile.email);
      userProfile.phone = sanitizeUserPhone(userProfile.phone);
      setIsLoading(false);
      onLoginSuccess(userProfile);
    } catch (err: any) {
      if (
        (cleanEmail === AUTHORIZED_ADMIN_EMAIL || cleanEmail === BRAND_CONFIG.email.toLowerCase()) &&
        cleanPassword === '123456'
      ) {
        setIsLoading(false);
        const adminProfile: UserProfile = {
          name: 'VillaSell Admin (Super Admin)',
          email: AUTHORIZED_ADMIN_EMAIL,
          phone: BRAND_CONFIG.phone,
          role: 'Admin',
          city: 'Varanasi'
        };
        onLoginSuccess(adminProfile);
        return;
      }
      setIsLoading(false);
      setErrorMessage(getFirebaseErrorMessage(err));
    }
  };

  const handleFirebaseSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    try {
      const userProfile = await registerWithEmail(
        email.trim(), 
        password, 
        name.trim(), 
        sanitizeUserPhone(phone), 
        role
      );
      userProfile.name = userProfile.name || resolveUserDisplayName(name, email);
      userProfile.phone = sanitizeUserPhone(userProfile.phone);
      setIsLoading(false);
      onLoginSuccess(userProfile);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(getFirebaseErrorMessage(err));
    }
  };

  // Google First-Time Role Picker View
  if (googleUserPendingRole) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
        <div 
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-blue-100 overflow-hidden p-6 sm:p-7 space-y-5"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-inner">
              <Sparkles className="w-6 h-6 text-amber-500" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              Welcome to <span className="text-[#1b4a80]">Villa</span><span className="text-amber-500">Sell</span>!
            </h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Hi <strong>{googleUserPendingRole.name}</strong>, please select your profile type to personalize your experience:
            </p>
          </div>

          <div className="space-y-3">
            {/* Buyer / Tenant */}
            <button
              type="button"
              onClick={() => handleSelectGoogleRoleAndProceed('Buyer')}
              disabled={isLoading}
              className="w-full p-4 rounded-2xl border-2 border-slate-200 hover:border-emerald-600 hover:bg-emerald-50/50 text-left transition-all cursor-pointer group flex items-start gap-3.5"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="font-extrabold text-sm text-slate-900 group-hover:text-emerald-800">
                  Buyer / Tenant
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Browse verified listings, save shortlists, book site visits & contact owners directly with 0% brokerage.
                </p>
              </div>
            </button>

            {/* Agent / Broker */}
            <button
              type="button"
              onClick={() => handleSelectGoogleRoleAndProceed('Agent')}
              disabled={isLoading}
              className="w-full p-4 rounded-2xl border-2 border-slate-200 hover:border-blue-600 hover:bg-blue-50/50 text-left transition-all cursor-pointer group flex items-start gap-3.5"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                <Briefcase className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="font-extrabold text-sm text-slate-900 group-hover:text-blue-800">
                  Agent / Broker
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage client properties, receive direct buyer inquiries & use Cloudinary fast image uploads.
                </p>
              </div>
            </button>

            {/* Property Owner / Admin */}
            <button
              type="button"
              onClick={() => handleSelectGoogleRoleAndProceed('Owner')}
              disabled={isLoading}
              className="w-full p-4 rounded-2xl border-2 border-slate-200 hover:border-indigo-600 hover:bg-indigo-50/50 text-left transition-all cursor-pointer group flex items-start gap-3.5"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                <Building className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="font-extrabold text-sm text-slate-900 group-hover:text-indigo-800">
                  Property Owner / Admin
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Full management access, listing moderation queue, global directory & 100% free owner postings.
                </p>
              </div>
            </button>
          </div>

          <div className="text-center pt-2 text-[11px] text-slate-400">
            You can also switch or customize your role anytime from your dashboard.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-blue-100 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Luxury Brand Banner */}
        <div className="bg-gradient-to-r from-[#1b4a80] via-[#255e9c] to-[#2b568d] p-6 text-white relative overflow-hidden shrink-0">
          <div className="absolute right-0 top-0 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Close login dialog"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Luxury Architectural Villa Emblem & Brand Heading */}
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-800 to-slate-900 border border-blue-300/40 flex items-center justify-center shadow-lg shadow-slate-950/40 shrink-0">
              <svg viewBox="0 0 32 32" className="w-6 h-6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M16 4L4 14.5H8.5V26.5H23.5V14.5H28L16 4Z"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="rgba(255,255,255,0.08)"
                />
                <path d="M16 8.5L9.5 14.5H22.5L16 8.5Z" fill="#f59e0b" />
                <path
                  d="M13.5 26.5V19.5C13.5 18.4 14.6 17.5 16 17.5C17.4 17.5 18.5 18.4 18.5 19.5V26.5"
                  stroke="#f59e0b"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path d="M21.5 8.5V6H24V11" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
                {authMode === 'admin' ? (
                  <>
                    <span className="text-amber-400">Admin</span> Control Panel
                  </>
                ) : authMode === 'login' ? (
                  <>
                    Welcome Back to{' '}
                    <span className="text-white font-black">Villa</span>
                    <span className="text-amber-400 font-black drop-shadow-xs">Sell</span>
                  </>
                ) : (
                  <>
                    Join{' '}
                    <span className="text-white font-black">Villa</span>
                    <span className="text-amber-400 font-black drop-shadow-xs">Sell</span>
                  </>
                )}
              </h3>
            </div>
          </div>

          <p className="text-xs text-sky-100 mt-1">
            {authMode === 'admin'
              ? 'Authorized administrative access to moderate, approve, edit & delete property listings.'
              : authMode === 'login' 
              ? 'Sign in to access your role-specific dashboard, saved properties & inquiries.' 
              : 'Join thousands of verified buyers, agents & property owners with zero brokerage.'}
          </p>

          {customMessage && (
            <div className="bg-amber-400/15 border border-amber-300/30 text-amber-100 text-xs font-medium px-3.5 py-2.5 rounded-xl mt-3 flex items-start gap-2.5 backdrop-blur-xs leading-relaxed">
              <Sparkles className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
              <span>{customMessage}</span>
            </div>
          )}
        </div>

        {/* Tab Toggle: User Login vs Admin Login vs Sign Up */}
        <div className="flex border-b border-slate-200 bg-slate-50 p-1.5 shrink-0 gap-1">
          <button
            type="button"
            onClick={() => {
              setAuthMode('login');
              setErrorMessage('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              authMode === 'login'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthMode('admin');
              setErrorMessage('');
              setEmail('');
              setPassword('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              authMode === 'admin'
                ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                : 'text-amber-700 hover:text-amber-900 hover:bg-amber-50/50'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthMode('signup');
              setErrorMessage('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              authMode === 'signup'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Register</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto">
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* PROMINENT GOOGLE SIGN IN BUTTON (Hidden in Admin Mode) */}
          {authMode !== 'admin' && (
            <div className="mb-4">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-3 shadow-xs hover:shadow-md transition-all cursor-pointer active:scale-98"
              >
                {/* Official Google Multicolor Logo */}
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.9c2.28-2.1 3.645-5.2 3.645-9.14z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.9-3.05c-1.08.72-2.45 1.16-4.03 1.16-3.1 0-5.74-2.1-6.68-4.91H1.21v3.13C3.25 21.36 7.31 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.32 14.29c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.58H1.21C.44 8.11 0 9.99 0 12s.44 3.89 1.21 5.42l4.11-3.13z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.64 1.21 6.58l4.11 3.13c.94-2.81 3.58-4.96 6.68-4.96z"
                  />
                </svg>
                <span>{authMode === 'login' ? 'Sign in with Google' : 'Sign up with Google'}</span>
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-3 text-slate-400 font-semibold text-[10px]">
                    Or continue with email
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ADMIN LOGIN FORM */}
          {authMode === 'admin' ? (
            <form onSubmit={handleFirebaseLogin} className="space-y-4 animate-in fade-in">
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-extrabold">Administrator Access Verification</p>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    Only authorized administrators can access the moderation queue to approve, edit, and delete listings.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Admin ID / Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Admin Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password (e.g. 123456)"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 disabled:opacity-50 text-slate-950 font-black text-xs sm:text-sm shadow-md shadow-amber-900/20 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
              >
                {isLoading ? (
                  <span>Authenticating Admin...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Login to Admin Control Panel</span>
                  </>
                )}
              </button>
            </form>
          ) : authMode === 'login' ? (
            /* Login Form */
            <form onSubmit={handleFirebaseLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password (min 6 chars)"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-blue-900/20 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
              >
                {isLoading ? (
                  <span>Signing In...</span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs flex-wrap gap-2">
                <span className="text-slate-500">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signup');
                      setErrorMessage('');
                    }}
                    className="font-bold text-blue-600 hover:text-blue-800 cursor-pointer underline"
                  >
                    Create Account
                  </button>
                </span>

                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('admin');
                    setErrorMessage('');
                    setEmail('');
                    setPassword('');
                  }}
                  className="font-bold text-amber-700 hover:text-amber-900 cursor-pointer flex items-center gap-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                  <span>Admin Login →</span>
                </button>
              </div>
            </form>
          ) : (
            /* Sign Up Form */
            <form onSubmit={handleFirebaseSignUp} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Suraj Yadav"
                    className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Password (min 6 chars) *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a secure password"
                    className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Mobile Number (Optional)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>
              </div>

              {/* THREE SPECIFIED ROLES: Buyer / Tenant, Agent / Broker, Property Owner / Admin */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Select Your Role on VillaSell:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('Buyer')}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      role === 'Buyer'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-800 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-extrabold text-[11px] leading-tight">Buyer / Tenant</div>
                    <div className="text-[9px] text-slate-500 mt-0.5">Save & visit</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('Agent')}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      role === 'Agent'
                        ? 'bg-blue-50 border-blue-600 text-blue-800 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-extrabold text-[11px] leading-tight">Agent / Broker</div>
                    <div className="text-[9px] text-slate-500 mt-0.5">Leads & Cloudinary</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('Owner')}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      role === 'Owner' || role === 'Admin'
                        ? 'bg-indigo-50 border-indigo-600 text-indigo-800 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-extrabold text-[11px] leading-tight">Owner / Admin</div>
                    <div className="text-[9px] text-slate-500 mt-0.5">Full control</div>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-blue-900/20 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
              >
                {isLoading ? (
                  <span>Creating Account...</span>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-2 text-center">
                <span className="text-xs text-slate-500">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('login');
                      setErrorMessage('');
                    }}
                    className="font-bold text-blue-600 hover:text-blue-800 cursor-pointer underline"
                  >
                    Sign In
                  </button>
                </span>
              </div>
            </form>
          )}
        </div>

        {/* Security Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-500 shrink-0">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>100% Secure & SSL Encrypted Connection</span>
        </div>
      </div>
    </div>
  );
};
