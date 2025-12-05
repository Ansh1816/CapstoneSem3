import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Heart, ThumbsUp, ThumbsDown, Star, User, Calendar, MapPin, Trash2 } from 'lucide-react';

const GemDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [gem, setGem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [vote, setVote] = useState(null);
    const [score, setScore] = useState(0);
    const [isSaved, setIsSaved] = useState(false);
    const [reviewContent, setReviewContent] = useState('');
    const [rating, setRating] = useState(5);
    const [currentUser, setCurrentUser] = useState(null);

    // Edit Mode State
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editImage, setEditImage] = useState('');

    useEffect(() => {
        const fetchGem = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/gems/${id}`, { headers });
                setGem(res.data);
                setScore(res.data.upvotes - res.data.downvotes);
                setVote(res.data.userVote);
                setIsSaved(res.data.isSaved);

                setEditTitle(res.data.title);
                setEditDescription(res.data.description);
                if (res.data.images) {
                    setEditImage(JSON.parse(res.data.images)[0] || '');
                }
                setLoading(false);
            } catch (error) {
                console.error(error);
                setError('Gem not found');
                setLoading(false);
            }
        };
        fetchGem();

        const userStr = localStorage.getItem('user');
        if (userStr) {
            setCurrentUser(JSON.parse(userStr));
        }
    }, [id]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) return alert('Please login to review');

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/reviews`, {
                content: reviewContent,
                rating: parseInt(rating),
                gemId: id,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Refresh gem data to show new review
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/gems/${id}`);
            setGem(res.data);
            setReviewContent('');
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 401) {
                alert('Session expired. Please login again.');
                navigate('/login');
            } else {
                alert('Failed to submit review');
            }
        }
    };

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm('Are you sure you want to delete this review?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/reviews/${reviewId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Refresh gem data
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/gems/${id}`);
            setGem(res.data);
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 401) {
                alert('Session expired. Please login again.');
                navigate('/login');
            } else {
                alert('Failed to delete review');
            }
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this gem?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/gems/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate('/');
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 401) {
                alert('Session expired. Please login again.');
                navigate('/login');
            } else {
                alert('Failed to delete gem');
            }
        }
    };

    const handleUpdate = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/gems/${id}`, {
                title: editTitle,
                description: editDescription,
                images: [editImage],
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setGem(res.data);
            setIsEditing(false);
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 401) {
                alert('Session expired. Please login again.');
                navigate('/login');
            } else {
                alert('Failed to update gem');
            }
        }
    };

    const handleVote = async (type) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return alert('Please login to vote');

            await axios.post(`${import.meta.env.VITE_API_URL}/api/gems/${id}/vote`, { type }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Optimistic update
            if (vote === type) {
                // If voting the same way, it means un-voting
                setVote(null);
                setScore(score + (type === 'UP' ? -1 : 1));
            } else {
                let newScore = score;
                if (vote === null) { // No previous vote
                    newScore += (type === 'UP' ? 1 : -1);
                } else { // Switching vote
                    newScore += (type === 'UP' ? 2 : -2); // e.g., from DOWN to UP: score +1 (for UP) +1 (cancel DOWN) = +2
                }
                setVote(type);
                setScore(newScore);
            }
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 401) {
                alert('Session expired. Please login again.');
                navigate('/login');
            } else {
                alert('Failed to submit vote');
            }
        }
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return alert('Please login to save');

            if (isSaved) {
                await axios.delete(`${import.meta.env.VITE_API_URL}/api/gems/${id}/save`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setIsSaved(false);
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL}/api/gems/${id}/save`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setIsSaved(true);
            }
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 401) {
                alert('Session expired. Please login again.');
                navigate('/login');
            } else {
                alert('Failed to save/unsave gem');
            }
        }
    };

    if (loading) return <div className="text-center mt-20 text-nomad-brown animate-pulse">Loading...</div>;
    if (error) return <div className="text-center mt-20 text-red-500">{error}</div>;
    if (!gem) return <div className="text-center mt-20 text-nomad-brown">Gem not found.</div>;

    const isOwner = currentUser && gem && currentUser.id === gem.userId;

    return (
        <div className="container mx-auto p-8 max-w-5xl">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-nomad-brown/10 mb-8">
                {/* Header Image */}
                <div className="relative h-96">
                    {gem.images && JSON.parse(gem.images)[0] ? (
                        <img
                            src={JSON.parse(gem.images)[0]}
                            alt={gem.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-nomad-sand flex items-center justify-center text-nomad-brown">
                            No Image Available
                        </div>
                    )}
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-transparent to-black/70"></div>
                    <div className="absolute bottom-0 left-0 p-8 w-full text-white">
                        <div className="flex justify-between items-end">
                            <div>
                                <span className="bg-nomad-green/90 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 inline-block backdrop-blur-sm">
                                    {gem.category || 'Hidden Gem'}
                                </span>
                                <h1 className="text-5xl font-bold font-serif mb-2 shadow-sm">{gem.title}</h1>
                                <div className="flex items-center gap-4 text-sm font-medium opacity-90">
                                    <span className="flex items-center gap-1"><User className="w-4 h-4" /> {gem.user.name}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(gem.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button
                                    onClick={handleSave}
                                    className={`px-6 py-2 rounded-full font-bold transition-all flex items-center gap-2 ${isSaved ? 'bg-nomad-clay text-white' : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-md'}`}
                                >
                                    <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                                    {isSaved ? 'Saved' : 'Save'}
                                </button>
                                {isOwner && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-full font-bold backdrop-blur-md transition-all"
                                    >
                                        Edit
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {isEditing ? (
                    <div className="p-8">
                        <label className="block mb-2 text-nomad-brown font-medium uppercase tracking-wider text-xs">Title</label>
                        <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="w-full border border-nomad-brown/30 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-nomad-green/50"
                        />
                        <label className="block mb-2 text-nomad-brown font-medium uppercase tracking-wider text-xs">Image URL</label>
                        <input
                            type="text"
                            value={editImage}
                            onChange={(e) => setEditImage(e.target.value)}
                            className="w-full border border-nomad-brown/30 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-nomad-green/50"
                        />
                        <label className="block mb-2 text-nomad-brown font-medium uppercase tracking-wider text-xs">Description</label>
                        <textarea
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            className="w-full border border-nomad-brown/30 p-3 rounded-lg mb-4 h-32 focus:outline-none focus:ring-2 focus:ring-nomad-green/50"
                        />
                        <div className="flex gap-3">
                            <button onClick={handleUpdate} className="bg-nomad-green text-white px-6 py-2 rounded-full hover:bg-nomad-dark transition-colors font-medium">Save Changes</button>
                            <button onClick={() => setIsEditing(false)} className="bg-gray-200 text-nomad-dark px-6 py-2 rounded-full hover:bg-gray-300 transition-colors font-medium">Cancel</button>
                        </div>
                    </div>
                ) : (
                    <div className="p-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            <div>
                                <h2 className="text-2xl font-bold text-nomad-dark font-serif mb-4">About this Gem</h2>
                                <p className="text-nomad-dark/80 leading-relaxed text-lg font-sans whitespace-pre-line">
                                    {gem.description}
                                </p>
                            </div>

                            {/* Voting Section */}
                            <div className="flex items-center gap-4 bg-nomad-sand/30 p-4 rounded-xl border border-nomad-brown/10">
                                <span className="font-bold text-nomad-dark">Is this worth visiting?</span>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleVote('UP')}
                                        className={`p-2 rounded-full transition-colors ${vote === 'UP' ? 'bg-nomad-green text-white' : 'bg-white text-nomad-green hover:bg-nomad-green/10'}`}
                                    >
                                        <ThumbsUp className="w-5 h-5" />
                                    </button>
                                    <span className="font-bold text-xl min-w-[30px] text-center">{score}</span>
                                    <button
                                        onClick={() => handleVote('DOWN')}
                                        className={`p-2 rounded-full transition-colors ${vote === 'DOWN' ? 'bg-red-500 text-white' : 'bg-white text-red-500 hover:bg-red-50'}`}
                                    >
                                        <ThumbsDown className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar (Reviews) */}
                        <div className="lg:col-span-1">
                            <h3 className="text-2xl font-bold mb-6 text-nomad-dark font-serif">Community Reviews</h3>
                            <div className="space-y-6">
                                {gem.reviews && gem.reviews.length > 0 ? (
                                    gem.reviews.map((review) => (
                                        <div key={review.id} className="bg-nomad-sand/30 p-6 rounded-xl border border-nomad-brown/10 relative group">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="font-bold text-nomad-dark">{review.user.name}</p>
                                                <div className="flex text-yellow-500 text-sm">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : ''}`} />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-nomad-dark/80 text-sm leading-relaxed">{review.content}</p>
                                            {currentUser && currentUser.id === review.userId && (
                                                <button
                                                    onClick={() => handleDeleteReview(review.id)}
                                                    className="absolute top-4 right-4 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    title="Delete Review"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-nomad-brown italic">No reviews yet. Be the first!</p>
                                )}
                            </div>

                            {/* Add Review Form */}
                            <div className="mt-8 pt-8 border-t border-nomad-brown/10">
                                <h4 className="text-lg font-bold mb-4 text-nomad-dark font-serif">Leave a Review</h4>
                                <form onSubmit={handleReviewSubmit}>
                                    <div className="mb-4">
                                        <label className="block mb-2 text-xs font-bold uppercase text-nomad-brown">Rating</label>
                                        <select
                                            value={rating}
                                            onChange={(e) => setRating(parseInt(e.target.value))}
                                            className="w-full border border-nomad-brown/30 p-2 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-nomad-green/50"
                                        >
                                            <option value="5">5 - Excellent</option>
                                            <option value="4">4 - Very Good</option>
                                            <option value="3">3 - Good</option>
                                            <option value="2">2 - Fair</option>
                                            <option value="1">1 - Poor</option>
                                        </select>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block mb-2 text-xs font-bold uppercase text-nomad-brown">Review</label>
                                        <textarea
                                            value={reviewContent}
                                            onChange={(e) => setReviewContent(e.target.value)}
                                            className="w-full border border-nomad-brown/30 p-3 rounded-lg bg-white h-24 focus:outline-none focus:ring-2 focus:ring-nomad-green/50"
                                            placeholder="Share your experience..."
                                            required
                                        ></textarea>
                                    </div>
                                    <button type="submit" className="w-full bg-nomad-green text-black py-2 rounded-full font-bold hover:bg-nomad-dark transition-colors shadow-md">
                                        Submit Review
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GemDetails;
