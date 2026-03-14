import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css'; // Reuse the identical styles

function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate('/home');
        }
    }, [navigate]);

    async function handleSignup(e) {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim(), password: password.trim() }),
            });

            if (!response.ok) {
                const err = await response.json();
                alert(err.error || 'Signup failed');
                return;
            }

            alert('User registered successfully');
            navigate('/login');
        } catch (error) {
            console.error('Signup error:', error);
            alert('An error occurred during signup.');
        }
    }

    return (
        <div className="login-page">
            <form className="login-form" onSubmit={handleSignup}>
                <h2>Create an Account</h2>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                /><br />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                /><br />
                <button type="submit">Sign Up</button>
                <div style={{ marginTop: '15px' }}>
                    <span>Already have an account? </span>
                    <Link to="/login" style={{ color: '#2e8b57', textDecoration: 'none', fontWeight: 'bold' }}>Login</Link>
                </div>
            </form>
        </div>
    );
}

export default SignupPage;
