import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/AdminForgotPassword.css';
import logoColor from '../assets/images/logo.png';

const API_URL = 'http://localhost/web-resmi-fpg/server/api';

const AdminForgotPassword = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    
    // Form states
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [resetToken, setResetToken] = useState('');
    
    // UI states
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    
    // Timer states
    const [otpTimer, setOtpTimer] = useState(600);
    const [resendTimer, setResendTimer] = useState(120);
    const [canResend, setCanResend] = useState(false);
    const [sessionTimer, setSessionTimer] = useState(1800); // ← UBAH: 30 menit = 1800 detik

    // OTP Timer countdown
    useEffect(() => {
        if (currentStep === 2 && otpTimer > 0) {
            const timer = setInterval(() => {
                setOtpTimer(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [currentStep, otpTimer]);

    // Resend Timer countdown
    useEffect(() => {
        if (currentStep === 2 && resendTimer > 0) {
            const timer = setInterval(() => {
                setResendTimer(prev => {
                    if (prev <= 1) {
                        setCanResend(true);
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [currentStep, resendTimer]);

    // ← TAMBAH: Session Timer countdown
    useEffect(() => {
        if (currentStep === 3 && sessionTimer > 0) {
            const timer = setInterval(() => {
                setSessionTimer(prev => {
                    if (prev <= 1) {
                        setError('Session expired. Please start over.');
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [currentStep, sessionTimer]);

    // Format time display
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // STEP 1: Send OTP
    const handleSendOTP = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post(`${API_URL}/admin-send-otp.php`, { email });

            if (response.data.success) {
                setCurrentStep(2);
                setOtpTimer(600);
                setResendTimer(120);
                setCanResend(false);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Handle OTP input (auto-focus next box)
    const handleOtpChange = (index, value) => {
        value = value.trim();
        
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`).focus();
        }
    };

    // Handle OTP paste
    const handleOtpPaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').trim();
        
        if (/^\d{6}$/.test(pastedData)) {
            const newOtp = pastedData.split('');
            setOtp(newOtp);
            document.getElementById('otp-5').focus();
        }
    };

    // Handle backspace on OTP
    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`).focus();
        }
    };

    // STEP 2: Verify OTP
    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setError('');

        const otpString = otp.map(digit => digit.trim()).join('');
        
        if (otpString.length !== 6) {
            setError('Please enter complete 6-digit OTP');
            return;
        }

        if (otpTimer === 0) {
            setError('OTP has expired. Please request a new one.');
            return;
        }

        setLoading(true);

        console.log('Verifying OTP:', {
            email,
            otp: otpString,
            timer: otpTimer
        });

        try {
            const response = await axios.post(`${API_URL}/admin-verify-otp.php`, {
                email,
                otp: otpString
            });

            console.log('Verify response:', response.data);

            if (response.data.success) {
                setResetToken(response.data.reset_token);
                setSessionTimer(response.data.expires_in || 1800); // ← UBAH: Default 30 menit
                console.log('Session expires at:', response.data.expires_at); // ← TAMBAH LOG
                setCurrentStep(3);
            }
        } catch (err) {
            console.error('Verify error:', err.response?.data);
            setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Resend OTP
    const handleResendOTP = async () => {
        if (!canResend) return;

        setError('');
        setLoading(true);
        setOtp(['', '', '', '', '', '']);

        try {
            const response = await axios.post(`${API_URL}/admin-send-otp.php`, { email });

            if (response.data.success) {
                setOtpTimer(600);
                setResendTimer(120);
                setCanResend(false);
                alert('New OTP has been sent to your email');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to resend OTP');
        } finally {
            setLoading(false);
        }
    };

    // STEP 3: Reset Password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');

        // Cek session masih valid
        if (sessionTimer === 0) {
            setError('Session expired. Please start over.');
            setTimeout(() => {
                setCurrentStep(1);
                setEmail('');
                setOtp(['', '', '', '', '', '']);
                setNewPassword('');
                setConfirmPassword('');
                setResetToken('');
            }, 2000);
            return;
        }

        if (!resetToken) {
            setError('Invalid or expired reset session. Please request a new OTP.');
            return;
        }

        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(`${API_URL}/admin-reset-password.php`, {
                reset_token: resetToken, // ✅ FIX: kirim session reset token dari verify OTP
                new_password: newPassword,
                confirm_password: confirmPassword
            });

            if (response.data.success) {
                setSuccess(true);
                setSuccessMessage(response.data.message);

                setTimeout(() => {
                    navigate('/admin/login');
                }, 3000);
            }
        } catch (err) {
            console.error('Reset error:', err.response?.data);
            setError(err.response?.data?.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    // Password strength indicator
    const getPasswordStrength = (password) => {
        if (!password) return { strength: 0, label: '', color: '' };
        
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;

        const levels = [
            { strength: 0, label: '', color: '' },
            { strength: 1, label: 'Weak', color: '#dc3545' },
            { strength: 2, label: 'Fair', color: '#ffc107' },
            { strength: 3, label: 'Good', color: '#17a2b8' },
            { strength: 4, label: 'Strong', color: '#28a745' }
        ];

        return levels[strength];
    };

    const passwordStrength = getPasswordStrength(newPassword);

    return (
        <div className="forgot-password-page">
            <div className="forgot-container">
                <div className="forgot-card">
                    <div className="forgot-logo">
                        <img src={logoColor} alt="Fachri Property Group" />
                    </div>

                    <h2>Reset Password</h2>
                    <p className="forgot-subtitle">
                        {currentStep === 1 && 'Enter your email to receive OTP'}
                        {currentStep === 2 && 'Enter 6-digit OTP sent to your email'}
                        {currentStep === 3 && 'Create your new password'}
                    </p>

                    {/* Progress Steps */}
                    <div className="progress-steps">
                        <div className={`progress-step ${currentStep >= 1 ? 'active' : ''}`}>
                            <div className="step-number">1</div>
                            <span>Email</span>
                        </div>
                        <div className={`progress-step ${currentStep >= 2 ? 'active' : ''}`}>
                            <div className="step-number">2</div>
                            <span>Verify OTP</span>
                        </div>
                        <div className={`progress-step ${currentStep >= 3 ? 'active' : ''}`}>
                            <div className="step-number">3</div>
                            <span>New Password</span>
                        </div>
                    </div>

                    {error && (
                        <div className="error-message">
                            <span>⚠️</span> {error}
                        </div>
                    )}
                    {success && (
                        <div className="success-message">
                            <span>✅</span> {successMessage}
                        </div>
                    )}

                    {/* STEP 1: Email Input */}
                    {currentStep === 1 && (
                        <form onSubmit={handleSendOTP}>
                            <div className="form-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@example.com"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <button type="submit" className="btn-submit" disabled={loading}>
                                {loading ? 'Sending...' : 'Send OTP'}
                            </button>

                            <div className="back-to-login">
                                <button type="button" onClick={() => navigate('/admin/login')}>
                                    ← Back to Login
                                </button>
                            </div>
                        </form>
                    )}

                    {/* STEP 2: OTP Verification */}
                    {currentStep === 2 && (
                        <form onSubmit={handleVerifyOTP}>
                            <div className="otp-info">
                                <p>OTP sent to: <strong>{email}</strong></p>
                                <button 
                                    type="button" 
                                    className="btn-change-email"
                                    onClick={() => {
                                        setCurrentStep(1);
                                        setOtp(['', '', '', '', '', '']);
                                    }}
                                >
                                    Change Email
                                </button>
                            </div>

                            <div className="otp-container">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        id={`otp-${index}`}
                                        type="text"
                                        maxLength="1"
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                        onPaste={index === 0 ? handleOtpPaste : undefined}
                                        className="otp-input"
                                        disabled={loading || otpTimer === 0}
                                    />
                                ))}
                            </div>

                            <div className="timer-info">
                                {otpTimer > 0 ? (
                                    <p className="expires-in">
                                        Code expires in: <strong>{formatTime(otpTimer)}</strong>
                                    </p>
                                ) : (
                                    <p className="expired">OTP has expired</p>
                                )}
                            </div>

                            <button 
                                type="submit" 
                                className="btn-submit" 
                                disabled={loading || otpTimer === 0}
                            >
                                {loading ? 'Verifying...' : 'Verify OTP'}
                            </button>

                            <div className="resend-section">
                                {canResend ? (
                                    <button 
                                        type="button" 
                                        className="btn-resend"
                                        onClick={handleResendOTP}
                                        disabled={loading}
                                    >
                                        Resend OTP
                                    </button>
                                ) : (
                                    <p className="resend-timer">
                                        Resend available in: <strong>{formatTime(resendTimer)}</strong>
                                    </p>
                                )}
                            </div>
                        </form>
                    )}

                    {/* STEP 3: New Password */}
                    {currentStep === 3 && (
                        <form onSubmit={handleResetPassword}>
                            {/* ← TAMBAH: Session timer warning */}
                            {sessionTimer > 0 && sessionTimer <= 300 && (
                                <div className="session-warning">
                                    ⏰ Session expires in: <strong>{formatTime(sessionTimer)}</strong>
                                </div>
                            )}

                            <div className="form-group">
                                <label>New Password</label>
                                <div className="password-input-wrapper">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Enter new password"
                                        required
                                        disabled={loading || sessionTimer === 0}
                                    />
                                    <button
                                        type="button"
                                        className="toggle-password"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? '👁️' : '👁️‍🗨️'}
                                    </button>
                                </div>
                                
                                {newPassword && (
                                    <div className="password-strength">
                                        <div className="strength-bar">
                                            <div 
                                                className="strength-fill" 
                                                style={{ 
                                                    width: `${(passwordStrength.strength / 4) * 100}%`,
                                                    backgroundColor: passwordStrength.color
                                                }}
                                            />
                                        </div>
                                        <span style={{ color: passwordStrength.color }}>
                                            {passwordStrength.label}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label>Confirm Password</label>
                                <div className="password-input-wrapper">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm new password"
                                        required
                                        disabled={loading || sessionTimer === 0}
                                    />
                                    <button
                                        type="button"
                                        className="toggle-password"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                                    </button>
                                </div>
                            </div>

                            <div className="password-requirements">
                                <p>Password must contain:</p>
                                <ul>
                                    <li className={newPassword.length >= 8 ? 'met' : ''}>
                                        ✓ At least 8 characters
                                    </li>
                                    <li className={/[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword) ? 'met' : ''}>
                                        ✓ Uppercase & lowercase letters
                                    </li>
                                    <li className={/\d/.test(newPassword) ? 'met' : ''}>
                                        ✓ At least one number
                                    </li>
                                </ul>
                            </div>

                            <button 
                                type="submit" 
                                className="btn-submit" 
                                disabled={loading || sessionTimer === 0}
                            >
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminForgotPassword;