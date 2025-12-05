import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, { email, password, name });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/');
        } catch (error) {
            console.error(error);
            alert('Signup failed');
        }
    };

    return (
        <div className="flex justify-center items-center h-[calc(100vh-64px)] bg-nomad-sand">
            <form onSubmit={handleSubmit} className="bg-white p-10 rounded-2xl shadow-xl w-96 border border-nomad-brown/10">
                <h2 className="text-3xl mb-8 font-bold text-center text-nomad-dark font-serif">Join the Journey</h2>
                <div className="mb-6">
                    <label className="block mb-2 text-nomad-brown font-medium uppercase tracking-wider text-xs">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border border-nomad-brown/30 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-nomad-green/50 bg-nomad-sand/30 transition-all"
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="block mb-2 text-nomad-brown font-medium uppercase tracking-wider text-xs">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-nomad-brown/30 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-nomad-green/50 bg-nomad-sand/30 transition-all"
                        required
                    />
                </div>
                <div className="mb-8">
                    <label className="block mb-2 text-nomad-brown font-medium uppercase tracking-wider text-xs">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border border-nomad-brown/30 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-nomad-green/50 bg-nomad-sand/30 transition-all"
                        required
                    />
                </div>
                <button type="submit" className="w-full bg-nomad-green text-black py-3 rounded-full hover:bg-nomad-dark transition-colors font-bold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all">
                    Signup
                </button>
                <p className="mt-6 text-center text-nomad-brown text-sm">
                    Already have an account? <Link to="/login" className="text-nomad-green font-bold hover:underline">Login</Link>
                </p>
            </form>
        </div>
    );
};

export default Signup;
