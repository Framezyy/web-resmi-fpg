import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropertyDetail from './PropertyDetail';
import '../styles/Properties.css';
import propertiesHeroImage from '../assets/images/hero-bg.png';
import btnLogo from '../assets/images/btnlogo.png';


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

    // TAMBAHKAN FUNCTION INI - Get unique types dari database
    const getUniqueTypes = () => {
        const types = properties.map(p => p.type).filter(Boolean);
        return [...new Set(types)].sort();
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

            {/* Filter Section - UPDATE INI */}
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
                        
                        {/* UBAH SELECT INI - Dynamic options dari database */}
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="filter-select"
                        >
                            <option value="">Semua Tipe</option>
                            {getUniqueTypes().map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                        
                        <input
                            type="text"
                            placeholder="Cari Lokasi"
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

            <section className="partner-banner">
                <div className="container">
                    <h2>FACHRI PROPERTY GROUP MITRA</h2>
                    <div className="partner-logo">
                        <img src={btnLogo} alt="Bank BTN" />
                    </div>
                </div>
            </section>

            <section className="contact-section">
                <div className="container">
                    <h2>GET IN TOUCH WITH US</h2>
                    <div className="contact-content">
                        <div className="contact-info">
                            <div className="contact-logo-container">
                                <div className="logo-box"></div>
                                <h3>FACHRI PROPERTY GROUP</h3>
                            </div>
                            <div className="address">
                                <h4>Alamat Perusahaan</h4>
                                <p>Panasonic Tower Lantai 16-G</p>
                                <p>Jl. DR. Pengabean Km. 2, RT.7/RW.1, Gambir, Campaka</p>
                                <p>Kecamatan Ciputat Utara, Kota Tangerang Selatan, Banten</p>
                                <p>Indonesia 15340</p>
                            </div>
                            <div className="contact-details">
                                <h4>Kontak</h4>
                                <p>Phone: (+6221) 23581300, 21201301</p>
                                <p>Fax: (+6221) 23581302</p>
                                <p>Email: cs@fachrisaebaty.co.id</p>
                            </div>
                        </div>
                        <div className="contact-map">
                            <iframe 
                                title="Map Location"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.521260322283!2d106.8195613!3d-6.194407!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTEnMzkuOSJTIDEwNsKwNDknMTAuNCJF!5e0!3m2!1sen!2sid!4v1234567890"
                                width="100%"
                                height="400"
                                style={{ border: 0 }}
                                allowFullScreen={true}
                                loading="lazy"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="footer">
                <div className="container">
                    <div className="footer-bottom">
                        <p>Copyright © 2025 Fachri Property Group</p>
                    </div>
                </div>
            </footer>
            {showModal && selectedProperty && (
                <PropertyDetail property={selectedProperty} onClose={handleCloseModal} />
            )}
        </div>
    );
};

export default Properties;