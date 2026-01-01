import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Tambahkan Link
import axios from 'axios';
import '../styles/AdminLogin.css';
import logoColor from '../assets/images/logo-warna.png';

const API_URL = 'http://localhost/web-resmi-fpg/server/api';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post(`${API_URL}/auth-login.php`, {
                username,
                password
            });

            if (response.data.token) {
                localStorage.setItem('adminToken', response.data.token);
                localStorage.setItem('adminUser', JSON.stringify(response.data.user));
                navigate('/admin/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-page">
            <div className="login-container">
                <div className="login-card">
                    <div className="login-logo">
                        <img src={logoColor} alt="Fachri Property Group" />
                    </div>
                    
                    <h2>Admin Login</h2>
                    
                    {error && <div className="error-message">{error}</div>}
                    
                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <label>Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter your username"
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        {/* Forgot Password Link */}
                        <div className="forgot-link">
                            <Link to="/admin/forgot-password">Forgot Password?</Link>
                        </div>
                        
                        <button 
                            type="submit" 
                            className="login-btn"
                            disabled={loading}
                        >
                            {loading ? 'Loading...' : 'Login'}
                        </button>
                    </form>
                    
                    <div className="login-footer">
                        <a href="/">← Back to Home</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;