import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User as UserIcon, Phone, Check, ArrowLeft, ArrowRight } from 'lucide-react';

const Register = () => {
  const [step, setStep] = useState(1); // 1: Form, 2: OTP Verification
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const { register, verifyOtp } = useAuth(); // Use verifyOtp from context
  const navigate = useNavigate();

  // Countdown timer for OTP expiry
  useEffect(() => {
    if (step === 2 && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      // Step 1: Initialize registration (sends OTP)
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      });

      setSuccess('Verification code sent to your email!');
      setStep(2);
      setTimeLeft(600); // Reset timer
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerify = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Step 2: Verify OTP and Login via Context
      await verifyOtp({
        email: formData.email,
        otp,
        name: formData.name,
        password: formData.password,
        phone: formData.phone,
      });

      navigate('/'); // Seamless redirect, NO reload
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
    // Reuse register logic or call specific resend endpoint if available 
    // For now assuming register resends if user exists but unverified (logic in backend may need tweak if user not created yet)
    // Actually our backend resend endpoint is /auth/resend-otp. Let's assume we use register again or add resend to Context.
    // For simplicity, let's just trigger register again which resends OTP in our current backend logic? 
    // Wait, backend logic for register checks if user exists. We haven't created user yet, so calling register again works to resend OTP.
    try {
        await register({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
        });
        setSuccess('New OTP sent to your email!');
        setTimeLeft(600);
    } catch (err) {
        setError('Failed to resend OTP');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Image Overlay */}
      <div className="hidden lg:flex w-1/2 relative bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-60 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
        <div className="relative z-10 p-12 flex flex-col justify-end h-full text-white">
            <h2 className="text-4xl font-bold mb-4">Join the Elite.</h2>
            <p className="text-lg text-gray-300 max-w-md">Create your profile to start building your dream setup and tracking your orders.</p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16">
        <div className="max-w-md w-full">
            
            {/* Step 1: Registration Form */}
            {step === 1 && (
            <div className="animate-fade-in">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Create Account</h1>
                    <p className="mt-2 text-sm text-gray-500">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-black hover:underline">
                        Sign in
                    </Link>
                    </p>
                </div>

                <form onSubmit={handleRegisterSubmit} className="space-y-5">
                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                            <ArrowRight size={16} className="rotate-45" /> {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                            <div className="relative">
                                <UserIcon size={18} className="absolute left-3.5 top-3.5 text-gray-400" />
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-3.5 top-3.5 text-gray-400" />
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone (Optional)</label>
                            <div className="relative">
                                <Phone size={18} className="absolute left-3.5 top-3.5 text-gray-400" />
                                <input
                                    name="phone"
                                    type="tel"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                                    placeholder="+1 234 567 890"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                                <div className="relative">
                                    <Lock size={18} className="absolute left-3.5 top-3.5 text-gray-400" />
                                    <input
                                        name="password"
                                        type="password"
                                        required
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                                        placeholder="••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm</label>
                                <div className="relative">
                                    <Lock size={18} className="absolute left-3.5 top-3.5 text-gray-400" />
                                    <input
                                        name="confirmPassword"
                                        type="password"
                                        required
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                                        placeholder="••••••"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-black hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Processing...' : 'Create Account'} <ArrowRight size={18} />
                    </button>
                    
                    <p className="text-xs text-center text-gray-500 mt-4">
                        By registering, you agree to our Terms of Service and Privacy Policy.
                    </p>
                </form>
            </div>
            )}

            {/* Step 2: OTP Verification */}
            {step === 2 && (
            <div className="animate-fade-in text-center">
                <button
                    onClick={() => setStep(1)}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-8 transition-colors"
                >
                    <ArrowLeft size={16} /> Back to details
                </button>

                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Mail size={32} className="text-green-600" />
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify your email</h2>
                <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                    We've sent a 6-digit code to <br/>
                    <span className="font-semibold text-gray-900">{formData.email}</span>
                </p>

                <form onSubmit={handleOTPVerify} className="space-y-6 max-w-xs mx-auto">
                     {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}
                    
                    {success && (
                        <div className="bg-green-50 border border-green-100 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center justify-center gap-2">
                            <Check size={16} /> {success}
                        </div>
                    )}

                    <input
                        name="otp"
                        type="text"
                        required
                        maxLength={6}
                        className="w-full text-center text-3xl font-mono font-bold tracking-[0.5em] py-4 border-b-2 border-gray-200 focus:border-black outline-none transition-all placeholder-gray-200"
                        placeholder="000000"
                        value={otp}
                        onChange={(e) => {
                            setOtp(e.target.value.replace(/\D/g, ''));
                            setError('');
                        }}
                    />

                    <div className="text-sm">
                        <p className="text-gray-500 mb-4">
                            Code expires in <span className="font-bold text-gray-900">{formatTime(timeLeft)}</span>
                        </p>
                        <button
                            type="button"
                            onClick={handleResendOTP}
                            disabled={loading || timeLeft > 540}
                            className="text-black font-semibold hover:underline disabled:opacity-50 disabled:no-underline"
                        >
                            Resend Code
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || otp.length !== 6}
                        className="w-full btn btn-primary py-3.5 rounded-xl font-bold text-base shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Verifying...' : 'Verify & Continue'}
                    </button>
                </form>
            </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Register;
