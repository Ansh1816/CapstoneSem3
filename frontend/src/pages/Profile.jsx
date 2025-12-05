import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { Star, Compass, Heart, ImageOff } from 'lucide-react';

const Profile = () => {
    const { id } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('submitted'); // 'submitted' or 'saved'

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/api/users/${id}`);
                setProfile(res.data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchProfile();
    }, [id]);

    if (loading) return <div className="text-center mt-20 text-nomad-brown animate-pulse">Loading...</div>;
    if (!profile) return <div className="text-center mt-20 text-nomad-brown">User not found.</div>;

    const GemCard = ({ gem }) => (
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-nomad-brown/10 group">
            <div className="h-48 overflow-hidden relative">
                {gem.images && JSON.parse(gem.images)[0] ? (
                    <img
                        src={JSON.parse(gem.images)[0]}
                        alt={gem.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                ) : (
                    <div className="w-full h-full bg-nomad-sand flex flex-col items-center justify-center text-nomad-brown">
                        <ImageOff className="w-8 h-8 mb-2 opacity-50" />
                        <span className="text-sm">No Image</span>
                    </div>
                )}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold text-nomad-dark shadow-sm flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current text-yellow-500" /> {gem.averageRating.toFixed(1)}
                </div>
            </div>
            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-nomad-dark font-serif truncate">{gem.title}</h3>
                </div>
                <p className="text-nomad-dark/70 text-sm mb-4 line-clamp-2">{gem.description}</p>
                <Link
                    to={`/gems/${gem.id}`}
                    className="block w-full text-center bg-nomad-sand text-nomad-dark py-2 rounded-lg font-bold hover:bg-nomad-green hover:text-white transition-colors"
                >
                    View Details
                </Link>
            </div>
        </div>
    );

    return (
        <div className="container mx-auto p-8 max-w-6xl">
            {/* Profile Header */}
            <div className="bg-white rounded-3xl shadow-lg p-8 mb-10 border border-nomad-brown/10 flex flex-col md:flex-row items-center gap-8">
                <div className="w-32 h-32 bg-nomad-sand rounded-full flex items-center justify-center text-4xl shadow-inner text-nomad-brown font-serif">
                    {profile.user.name.charAt(0)}
                </div>
                <div className="text-center md:text-left">
                    <h1 className="text-4xl font-bold text-nomad-dark font-serif mb-2">{profile.user.name}</h1>
                    <p className="text-nomad-brown">Joined {new Date(profile.user.joinedAt).toLocaleDateString()}</p>
                    <div className="flex gap-6 mt-4 justify-center md:justify-start">
                        <div className="text-center">
                            <span className="block text-2xl font-bold text-nomad-green">{profile.submittedGems.length}</span>
                            <span className="text-xs uppercase tracking-wider text-nomad-brown flex items-center gap-1 justify-center"><Compass className="w-3 h-3" /> Discoveries</span>
                        </div>
                        <div className="text-center">
                            <span className="block text-2xl font-bold text-nomad-clay">{profile.savedGems.length}</span>
                            <span className="text-xs uppercase tracking-wider text-nomad-brown flex items-center gap-1 justify-center"><Heart className="w-3 h-3" /> Wanderlist</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex justify-center mb-8 border-b border-nomad-brown/10">
                <button
                    onClick={() => setActiveTab('submitted')}
                    className={`px-8 py-3 font-bold text-lg transition-all border-b-2 flex items-center gap-2 ${activeTab === 'submitted' ? 'border-nomad-green text-nomad-green' : 'border-transparent text-nomad-brown hover:text-nomad-dark'}`}
                >
                    <Compass className="w-5 h-5" /> Discoveries
                </button>
                <button
                    onClick={() => setActiveTab('saved')}
                    className={`px-8 py-3 font-bold text-lg transition-all border-b-2 flex items-center gap-2 ${activeTab === 'saved' ? 'border-nomad-clay text-nomad-clay' : 'border-transparent text-nomad-brown hover:text-nomad-dark'}`}
                >
                    <Heart className="w-5 h-5" /> Wanderlist
                </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeTab === 'submitted' ? (
                    profile.submittedGems.length > 0 ? (
                        profile.submittedGems.map(gem => <GemCard key={gem.id} gem={gem} />)
                    ) : (
                        <div className="col-span-full text-center py-20 text-nomad-brown italic">
                            No gems discovered yet.
                        </div>
                    )
                ) : (
                    profile.savedGems.length > 0 ? (
                        profile.savedGems.map(gem => <GemCard key={gem.id} gem={gem} />)
                    ) : (
                        <div className="col-span-full text-center py-20 text-nomad-brown italic">
                            Your Wanderlist is empty. Go explore!
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default Profile;
