import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { MapPin, Star } from 'lucide-react';

const Explore = () => {
    const [gems, setGems] = useState([]);
    const [search, setSearch] = useState('');
    const [city, setCity] = useState('');
    const [sort, setSort] = useState('rating'); // Default sort by rating
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [category, setCategory] = useState('All');
    const [userLocation, setUserLocation] = useState(null);

    const fetchGems = async () => {
        try {
            let query = `${import.meta.env.VITE_API_URL}/api/gems?page=${page}&limit=9&search=${search}&sort=${sort}&category=${category}`;
            if (city) query += `&city=${city}`;
            if (userLocation) query += `&userLat=${userLocation.lat}&userLng=${userLocation.lng}`;

            const res = await axios.get(query);
            setGems(res.data.gems);
            setTotalPages(res.data.totalPages);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchGems();
    }, [search, sort, page, city, category, userLocation]);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const handleCityChange = (e) => {
        setCity(e.target.value);
        setPage(1);
    };

    const handleSortChange = (e) => {
        setSort(e.target.value);
        setPage(1);
    };

    const handleNearMe = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setUserLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
                setCity(''); // Clear city input if using near me
                setSort('distance'); // Auto sort by distance
            }, (error) => {
                console.error("Error getting location:", error);
                alert("Could not get your location.");
            });
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    return (
        <div className="container mx-auto p-8 max-w-7xl">
            <h1 className="text-5xl font-bold mb-10 text-center text-nomad-dark font-serif tracking-tight">Explore Hidden Gems</h1>

            {/* Controls */}
            <div className="flex flex-col lg:flex-row justify-between items-center mb-10 gap-4 bg-white p-6 rounded-2xl shadow-sm border border-nomad-brown/10">
                <input
                    type="text"
                    placeholder="Search gems..."
                    value={search}
                    onChange={handleSearchChange}
                    className="w-full lg:w-1/4 p-3 border border-nomad-brown/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-nomad-green/50 bg-nomad-sand/30 transition-all placeholder-nomad-brown/50"
                />
                <div className="flex w-full lg:w-auto gap-2">
                    <input
                        type="text"
                        placeholder="Filter by City..."
                        value={city}
                        onChange={(e) => { setCity(e.target.value); setUserLocation(null); }}
                        className="w-full p-3 border border-nomad-brown/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-nomad-green/50 bg-nomad-sand/30 transition-all placeholder-nomad-brown/50"
                    />
                    <button onClick={handleNearMe} className="bg-nomad-green text-white px-4 rounded-lg hover:bg-nomad-dark transition-colors whitespace-nowrap flex items-center gap-2" title="Near Me">
                        <MapPin className="w-4 h-4" /> Near Me
                    </button>
                </div>
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full lg:w-1/5 p-3 border border-nomad-brown/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-nomad-green/50 bg-nomad-sand/30 transition-all cursor-pointer"
                >
                    <option value="All">All Categories</option>
                    <option value="Nature">Nature</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Culture">Culture</option>
                    <option value="Food">Food</option>
                    <option value="Relaxation">Relaxation</option>
                    <option value="Other">Other</option>
                </select>
                <select
                    value={sort}
                    onChange={handleSortChange}
                    className="w-full lg:w-1/5 p-3 border border-nomad-brown/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-nomad-green/50 bg-nomad-sand/30 transition-all cursor-pointer"
                >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="title">Title</option>
                    <option value="rating">Highest Rated</option>
                    <option value="popularity">Most Popular</option>
                    <option value="distance">Distance</option>
                </select>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {gems.map((gem) => (
                    <div key={gem.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-nomad-brown/10 group">
                        {gem.images && (
                            <div className="overflow-hidden h-56">
                                <img
                                    src={JSON.parse(gem.images)[0]}
                                    alt={gem.title}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                />
                            </div>
                        )}
                        <div className="p-6">
                            <h3 className="font-bold text-2xl mb-2 truncate text-nomad-dark font-serif">{gem.title}</h3>
                            <div className="flex justify-between items-center text-sm text-nomad-brown mb-3">
                                <div className="flex items-center">
                                    <Star className="w-4 h-4 fill-current text-yellow-500 mr-1" />
                                    <span className="font-bold">{gem.averageRating ? gem.averageRating.toFixed(1) : 'New'}</span>
                                    <span className="ml-1 text-xs">({gem.reviewCount})</span>
                                </div>
                                {gem.distance !== undefined && gem.distance !== null && (
                                    <span className="text-nomad-green font-bold bg-nomad-green/10 px-2 py-1 rounded-full text-xs">
                                        {gem.distance.toFixed(1)} km away
                                    </span>
                                )}
                            </div>
                            <p className="text-nomad-dark/80 text-sm mb-6 line-clamp-3 leading-relaxed">
                                {gem.description}
                            </p>
                            <div className="flex justify-between items-center pt-4 border-t border-nomad-brown/10">
                                <span className="text-xs text-nomad-brown font-medium uppercase tracking-wider">By {gem.user.name}</span>
                                <Link
                                    to={`/gems/${gem.id}`}
                                    className="bg-nomad-sand text-nomad-dark px-4 py-2 rounded-full hover:bg-nomad-green hover:text-white text-sm font-medium transition-colors"
                                >
                                    View Details
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center mt-12 gap-6">
                <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-6 py-2 bg-white border border-nomad-brown/20 rounded-full disabled:opacity-50 hover:bg-nomad-sand transition-colors font-medium text-nomad-dark shadow-sm"
                >
                    Previous
                </button>
                <span className="text-nomad-brown font-medium font-serif italic">Page {page} of {totalPages}</span>
                <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-6 py-2 bg-white border border-nomad-brown/20 rounded-full disabled:opacity-50 hover:bg-nomad-sand transition-colors font-medium text-nomad-dark shadow-sm"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Explore;
