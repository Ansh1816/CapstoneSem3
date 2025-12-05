import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import L from 'leaflet';

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Component to update map center programmatically
const MapUpdater = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, 13); // Zoom level 13 for city view
        }
    }, [center, map]);
    return null;
};

const Home = () => {
    const [gems, setGems] = useState([]);
    const [search, setSearch] = useState('');
    const [city, setCity] = useState('');
    const [sort, setSort] = useState('newest');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [mapCenter, setMapCenter] = useState(null); // State for map redirection

    const fetchGems = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/gems', {
                params: { search, city, sort, page, limit: 10 }
            });
            setGems(res.data.gems);
            setTotalPages(res.data.totalPages);

            // If API returns cityCenter (from geocoding), update map center
            if (res.data.cityCenter) {
                setMapCenter([res.data.cityCenter.lat, res.data.cityCenter.lon]);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchGems();
    }, [search, city, sort, page]);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setPage(1); // Reset to first page on search
    };

    const handleCityChange = (e) => {
        setCity(e.target.value);
        setPage(1); // Reset to first page on city change
    };

    const handleSortChange = (e) => {
        setSort(e.target.value);
        setPage(1); // Reset to first page on sort
    };

    const handlePrevPage = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNextPage = () => {
        if (page < totalPages) setPage(page + 1);
    };

    return (
        <div className="h-[calc(100vh-64px)] w-full relative">
            {/* Control Panel */}
            <div className="absolute top-6 left-6 z-[1000] bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-xl w-80 border border-nomad-brown/10">
                <h2 className="text-2xl font-bold mb-4 text-nomad-dark font-serif">Find Gems</h2>
                <input
                    type="text"
                    placeholder="Search gems..."
                    value={search}
                    onChange={handleSearchChange}
                    className="w-full p-3 border border-nomad-brown/30 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-nomad-green/50 bg-nomad-sand/30"
                />
                <input
                    type="text"
                    placeholder="Filter by City..."
                    value={city}
                    onChange={handleCityChange}
                    className="w-full p-3 border border-nomad-brown/30 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-nomad-green/50 bg-nomad-sand/30"
                />
                <select
                    value={sort}
                    onChange={handleSortChange}
                    className="w-full p-3 border border-nomad-brown/30 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-nomad-green/50 bg-nomad-sand/30"
                >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="title">Title</option>
                    <option value="rating">Highest Rated</option>
                    <option value="popularity">Most Popular</option>
                </select>
                <div className="flex justify-between items-center mt-2">
                    <button
                        onClick={handlePrevPage}
                        disabled={page === 1}
                        className="px-4 py-1.5 bg-nomad-sand text-nomad-dark rounded-full disabled:opacity-50 hover:bg-nomad-brown/20 transition-colors font-medium text-sm"
                    >
                        Prev
                    </button>
                    <span className="text-sm text-nomad-brown font-serif italic">Page {page} of {totalPages}</span>
                    <button
                        onClick={handleNextPage}
                        disabled={page === totalPages}
                        className="px-4 py-1.5 bg-nomad-sand text-nomad-dark rounded-full disabled:opacity-50 hover:bg-nomad-brown/20 transition-colors font-medium text-sm"
                    >
                        Next
                    </button>
                </div>
            </div>

            <MapContainer center={[28.6139, 77.2090]} zoom={6} scrollWheelZoom={true} className="h-full w-full z-0">
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />
                <MapUpdater center={mapCenter} />
                {gems.map((gem) => (
                    <Marker key={gem.id} position={[gem.latitude, gem.longitude]}>
                        <Popup className="custom-popup" closeButton={true}>
                            <div className="flex flex-col">
                                {gem.images && JSON.parse(gem.images)[0] && (
                                    <div className="w-full h-40 overflow-hidden relative">
                                        <img
                                            src={JSON.parse(gem.images)[0]}
                                            alt={gem.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 pt-8">
                                            <h3 className="font-bold text-lg text-white font-serif leading-tight shadow-sm">{gem.title}</h3>
                                        </div>
                                    </div>
                                )}
                                <div className="p-4">
                                    {!gem.images && <h3 className="font-bold text-lg text-nomad-dark font-serif mb-2">{gem.title}</h3>}

                                    <p className="text-sm mb-3 text-nomad-dark/80 line-clamp-3 leading-relaxed font-sans">{gem.description}</p>

                                    <div className="flex justify-between items-center mt-2">
                                        {gem.distance !== undefined && gem.distance !== null ? (
                                            <span className="text-xs text-nomad-green font-bold bg-nomad-green/10 px-2 py-1 rounded-full">
                                                {gem.distance.toFixed(1)} km
                                            </span>
                                        ) : <span></span>}

                                        <Link to={`/gems/${gem.id}`} className="text-white bg-nomad-green hover:bg-nomad-dark px-3 py-1.5 rounded-full text-xs font-bold transition-colors shadow-sm">
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default Home;
