import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropertyDetail from './PropertyDetail';
import '../styles/Properties.css';
import propertiesHeroImage from '../assets/images/hero-bg.png';

const API_URL = 'http://localhost/web-resmi-fpg/server/api';

const Properties = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState(null);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(`${API_URL}/properties.php`);
            
            if (Array.isArray(response.data)) {
                setProperties(response.data);
            } else {
                setProperties([]);
            }
        } catch (error) {
            console.error('Error fetching properties:', error);
            setError('Failed to load properties');
            setProperties([]);
        } finally {
            setLoading(false);
        }
    };

    const handlePropertyClick = (property) => {
        setSelectedProperty(property);
        setShowModal(true);
        document.body.style.overflow = 'hidden';
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedProperty(null);
        document.body.style.overflow = 'auto';
    };

    const filteredProperties = properties.filter(property => {
        const matchesSearch = property.title?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = !selectedType || property.type === selectedType;
        const matchesLocation = !selectedLocation || property.location?.toLowerCase().includes(selectedLocation.toLowerCase());
        return matchesSearch && matchesType && matchesLocation;
    });

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading properties...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <p>{error}</p>
                <button onClick={fetchProperties}>Retry</button>
            </div>
        );
    }

    return (
        <div className="properties-page">
            {/* Hero Section */}
            <section 
                className="properties-hero" 
                style={{ 
                    backgroundImage: `url(${propertiesHeroImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            >
                <div className="hero-overlay">
                    <h1>PROPERTI KAMI</h1>
                    <p>PT <span className="highlight">FACHRI</span> PROPERTY GROUP</p>
                </div>
            </section>

            {/* Filter Section */}
            <section className="properties-filter">
                <div className="container">
                    <div className="filter-grid">
                        <input
                            type="text"
                            placeholder="Cari Properti"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="filter-input"
                        />
                        
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="filter-select"
                        >
                            <option value="">Tipe</option>
                            <option value="Residential">Residential</option>
                            <option value="Commercial">Commercial</option>
                            <option value="Industrial">Industrial</option>
                            <option value="Land">Land</option>
                        </select>
                        
                        <input
                            type="text"
                            placeholder="Cari"
                            value={selectedLocation}
                            onChange={(e) => setSelectedLocation(e.target.value)}
                            className="filter-input"
                        />
                    </div>
                </div>
            </section>

            {/* Properties List - LAYOUT HORIZONTAL SEPERTI FIGMA */}
            <section className="properties-list-section">
                <div className="container">
                    {filteredProperties.length > 0 ? (
                        <div className="properties-horizontal-list">
                            {filteredProperties.map(property => (
                                <div key={property.id} className="property-horizontal-item">
                                    {/* Gambar Kiri */}
                                    <div className="property-image-box">
                                        <img 
                                            src={property.image || property.main_image} 
                                            alt={property.title}
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/450x300?text=Property+Image';
                                            }}
                                        />
                                    </div>
                                    
                                    {/* Info Kanan */}
                                    <div className="property-info-box">
                                        <h2 className="property-title-main">{property.title}</h2>
                                        <p className="property-location-text">{property.location}</p>
                                        <button 
                                            className="detail-link-btn"
                                            onClick={() => handlePropertyClick(property)}
                                        >
                                            lihat detail →
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-properties">
                            <p>Tidak ada properti yang ditemukan</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Modal */}
            {showModal && selectedProperty && (
                <PropertyDetail property={selectedProperty} onClose={handleCloseModal} />
            )}
        </div>
    );
};

export default Properties;