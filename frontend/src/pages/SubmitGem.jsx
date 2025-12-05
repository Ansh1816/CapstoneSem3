import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const LocationMarker = ({ setPosition, position }) => {
    useMapEvents({
        click(e) {
            setPosition(e.latlng);
        },
    });

    return position === null ? null : (
        <Marker position={position}></Marker>
    );
};

const MapUpdater = ({ position }) => {
    const map = useMapEvents({});
    useEffect(() => {
        if (position) {
            map.flyTo(position, 13);
        }
    }, [position, map]);
    return null;
};

const SubmitGem = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Other');
    const [location, setLocation] = useState('');
    const [position, setPosition] = useState(null);
    const [image, setImage] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const navigate = useNavigate();

    const handlePaste = (e) => {
        const items = e.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                e.preventDefault();
                const blob = items[i].getAsFile();
                const reader = new FileReader();
                reader.onload = (event) => {
                    setImage(event.target.result);
                };
                reader.readAsDataURL(blob);
                return;
            }
        }
    };

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (location.length > 2 && showSuggestions) {
                try {
                    const res = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${location}`);
                    setSuggestions(res.data);
                } catch (error) {
                    console.error("Error fetching suggestions:", error);
                }
            } else {
                setSuggestions([]);
            }
        }, 500); // 500ms debounce

        return () => clearTimeout(timer);
    }, [location, showSuggestions]);

    const handleLocationChange = (e) => {
        setLocation(e.target.value);
        setShowSuggestions(true);
    };

    const handleSelectSuggestion = (suggestion) => {
        setLocation(suggestion.display_name);
        const lat = parseFloat(suggestion.lat);
        const lon = parseFloat(suggestion.lon);
        setPosition({ lat, lng: lon });
        setSuggestions([]);
        setShowSuggestions(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!position) {
            alert('Please select a location from the dropdown or click on the map');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.post(`${import.meta.env.VITE_API_URL}/api/gems`, {
                title,
                description,
                category,
                latitude: position.lat,
                longitude: position.lng,
                images: [image],
                location: location
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate('/');
        } catch (error) {
            console.error(error);
            alert('Failed to submit gem');
        }
    };

    return (
        <div className="container mx-auto p-8 max-w-6xl">
            <h2 className="text-4xl font-bold mb-8 text-nomad-dark font-serif text-center">Share a Hidden Gem</h2>
            <div className="flex flex-col lg:flex-row gap-8">
                <form onSubmit={handleSubmit} className="w-full lg:w-1/2 bg-white p-8 rounded-2xl shadow-lg border border-nomad-brown/10">
                    <div className="mb-6">
                        <label className="block mb-2 text-nomad-brown font-medium uppercase tracking-wider text-xs">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border border-nomad-brown/30 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-nomad-green/50 transition-all bg-nomad-sand/30"
                            placeholder="Name of the place"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block mb-2 text-nomad-brown font-medium uppercase tracking-wider text-xs">Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full border border-nomad-brown/30 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-nomad-green/50 bg-nomad-sand/30 transition-all"
                        >
                            <option value="Other">Other</option>
                            <option value="Nature">Nature</option>
                            <option value="Adventure">Adventure</option>
                            <option value="Culture">Culture</option>
                            <option value="Food">Food</option>
                            <option value="Relaxation">Relaxation</option>
                        </select>
                    </div>
                    <div className="mb-6">
                        <label className="block mb-2 text-nomad-brown font-medium uppercase tracking-wider text-xs">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full border border-nomad-brown/30 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-nomad-green/50 transition-all bg-nomad-sand/30 h-32"
                            placeholder="What makes this place special?"
                            required
                        />
                    </div>
                    <div className="mb-6 relative">
                        <label className="block mb-2 text-nomad-brown font-medium uppercase tracking-wider text-xs">City/Location</label>
                        <input
                            type="text"
                            value={location}
                            onChange={handleLocationChange}
                            className="w-full border border-nomad-brown/30 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-nomad-green/50 transition-all bg-nomad-sand/30"
                            placeholder="Search for a location..."
                            required
                        />
                        {suggestions.length > 0 && (
                            <ul className="absolute z-10 w-full bg-white border border-nomad-brown/20 rounded-lg shadow-xl mt-1 max-h-60 overflow-y-auto">
                                {suggestions.map((suggestion) => (
                                    <li
                                        key={suggestion.place_id}
                                        onClick={() => handleSelectSuggestion(suggestion)}
                                        className="p-3 hover:bg-nomad-sand/50 cursor-pointer text-sm text-nomad-dark border-b border-nomad-brown/10 last:border-0 transition-colors"
                                    >
                                        {suggestion.display_name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className="mb-8">
                        <label className="block mb-2 text-nomad-brown font-medium uppercase tracking-wider text-xs">Image</label>
                        <input
                            type="text"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            onPaste={handlePaste}
                            className="w-full border border-nomad-brown/30 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-nomad-green/50 transition-all bg-nomad-sand/30"
                            placeholder="Paste image or URL"
                        />
                        <p className="text-xs text-nomad-brown/60 mt-1">Tip: You can paste an image directly from your clipboard.</p>
                    </div>
                    <button type="submit" className="w-full bg-nomad-green text-black px-6 py-3 rounded-full hover:bg-nomad-dark transition-colors font-bold shadow-md hover:shadow-xl transform hover:-translate-y-0.5 transition-all">
                        Submit Gem
                    </button>
                </form>
                <div className="w-full lg:w-1/2 h-[500px] rounded-2xl overflow-hidden shadow-lg border border-nomad-brown/10 relative group">
                    <MapContainer center={[51.505, -0.09]} zoom={13} className="h-full w-full">
                        <TileLayer
                            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        />
                        <LocationMarker setPosition={setPosition} position={position} />
                        <MapUpdater position={position} />
                    </MapContainer>
                </div>
            </div>
        </div>
    );
};

export default SubmitGem;
