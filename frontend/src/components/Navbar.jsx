import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Gem } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <nav className="bg-nomad-sand/90 backdrop-blur-md shadow-sm p-4 flex justify-between items-center sticky top-0 z-50 border-b border-nomad-brown/20">
            <Link to="/" className="text-2xl font-bold text-nomad-green font-serif tracking-wide flex items-center gap-2">
                <Gem className="w-6 h-6" /> HiddenGems
            </Link>
            <div className="flex items-center">
                <Link to="/explore" className="mr-6 text-nomad-brown hover:text-nomad-green font-medium transition-colors">Explore</Link>
                {user ? (
                    <>
                        <span className="mr-6 text-nomad-dark font-serif italic">Hello, {user.name}</span>
                        <Link to="/submit" className="mr-6 text-nomad-green hover:text-nomad-dark transition-colors font-medium">Add Gem</Link>
                        <Link to={`/users/${user.id}`} className="mr-6 text-nomad-brown hover:text-nomad-green transition-colors font-medium">Profile</Link>
                        <button onClick={handleLogout} className="text-nomad-clay hover:text-red-700 transition-colors font-medium">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="mr-6 text-nomad-brown hover:text-nomad-green transition-colors">Login</Link>
                        <Link to="/signup" className="bg-nomad-green text-white px-5 py-2 rounded-full hover:bg-nomad-dark transition-colors shadow-md">Signup</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
