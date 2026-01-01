import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminForgotPassword.css';

const API_URL = 'http://localhost/web-resmi-fpg/server/api';

const AdminForgotPassword = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [email, setEmail] = useState('');
    const [userId, setUserId] = useState(null);
    const [securityQuestion, setSecurityQuestion] = useState('');
    const [securityAnswer, setSecurityAnswer] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Step 1: Verify Email
    const handleVerifyEmail = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/admin-verify-email.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (data.success) {
                setUserId(data.user_id);
                setSecurityQuestion(data.security_question);
                setCurrentStep(2);
                setSuccess('Email found! Please answer your security question.');
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError(data.message || 'Email not found');
            }
        } catch (err) {
            setError('Connection error. Please check your server.');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify Security Answer
    const handleVerifyAnswer = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/admin-verify-security.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    user_id: userId,
                    security_answer: securityAnswer 
                })
            });

            const data = await response.json();

            if (data.success) {
                setCurrentStep(3);
                setSuccess('Security answer correct! Set your new password.');
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError(data.message || 'Incorrect security answer');
            }
        } catch (err) {
            setError('Connection error. Please check your server.');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Step 3: Reset Password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!newPassword || !confirmPassword) {
            setError('Please fill in all fields');
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
            const response = await fetch(`${API_URL}/admin-reset-password.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    user_id: userId,
                    new_password: newPassword 
                })
            });

            const data = await response.json();

            if (data.success) {
                setSuccess('✅ Password reset successfully! Redirecting to login...');
                setTimeout(() => {
                    navigate('/admin/login');
                }, 2000);
            } else {
                setError(data.message || 'Failed to reset password');
            }
        } catch (err) {
            setError('Connection error. Please check your server.');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-password-page">
            <div className="forgot-container">
                <div className="forgot-card">
                    <div className="forgot-logo">
                        <div style={{
                            width: '60px',
                            height: '60px',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            borderRadius: '10px',
                            margin: '0 auto'
                        }}></div>
                    </div>
                    
                    <h2>Reset Password</h2>
                    <p className="forgot-subtitle">Follow the steps to reset your admin password</p>

                    {/* Progress Steps */}
                    <div className="progress-steps">
                        <div className={`progress-step ${currentStep >= 1 ? 'active' : ''}`}>
                            <div className="step-number">1</div>
                            <span className="step-label">Email</span>
                        </div>
                        <div className={`progress-line ${currentStep >= 2 ? 'active' : ''}`}></div>
                        <div className={`progress-step ${currentStep >= 2 ? 'active' : ''}`}>
                            <div className="step-number">2</div>
                            <span className="step-label">Security</span>
                        </div>
                        <div className={`progress-line ${currentStep >= 3 ? 'active' : ''}`}></div>
                        <div className={`progress-step ${currentStep >= 3 ? 'active' : ''}`}>
                            <div className="step-number">3</div>
                            <span className="step-label">New Password</span>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="error-message">
                            ❌ {error}
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className="success-message">
                            {success}
                        </div>
                    )}

                    {/* Step 1: Email Verification */}
                    {currentStep === 1 && (
                        <form onSubmit={handleVerifyEmail}>
                            <div className="form-group">
                                <label>📧 Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@fachripropertygroup.com"
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <button type="submit" className="reset-btn" disabled={loading}>
                                {loading ? '⏳ Verifying...' : '🔍 Verify Email'}
                            </button>
                        </form>
                    )}

                    {/* Step 2: Security Question */}
                    {currentStep === 2 && (
                        <form onSubmit={handleVerifyAnswer}>
                            <div className="security-question-box">
                                <p className="security-question">{securityQuestion}</p>
                            </div>
                            <div className="form-group">
                                <label>🔐 Security Answer</label>
                                <input
                                    type="text"
                                    value={securityAnswer}
                                    onChange={(e) => setSecurityAnswer(e.target.value)}
                                    placeholder="Enter your answer"
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <button type="submit" className="reset-btn" disabled={loading}>
                                {loading ? '⏳ Verifying...' : '✅ Verify Answer'}
                            </button>
                            <button 
                                type="button" 
                                className="back-btn" 
                                onClick={() => setCurrentStep(1)}
                                disabled={loading}
                            >
                                ← Back to Email
                            </button>
                        </form>
                    )}

                    {/* Step 3: New Password */}
                    {currentStep === 3 && (
                        <form onSubmit={handleResetPassword}>
                            <div className="form-group">
                                <label>🔑 New Password</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Minimum 8 characters"
                                    required
                                    disabled={loading}
                                    minLength="8"
                                />
                            </div>
                            <div className="form-group">
                                <label>🔑 Confirm Password</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Re-enter password"
                                    required
                                    disabled={loading}
                                    minLength="8"
                                />
                            </div>
                            <button type="submit" className="reset-btn" disabled={loading}>
                                {loading ? '⏳ Resetting...' : '🔓 Reset Password'}
                            </button>
                            <button 
                                type="button" 
                                className="back-btn" 
                                onClick={() => setCurrentStep(2)}
                                disabled={loading}
                            >
                                ← Back to Security
                            </button>
                        </form>
                    )}

                    {/* Footer */}
                    <div className="forgot-footer">
                        <a href="/admin/login">← Back to Login</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminForgotPassword;