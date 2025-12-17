import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Properties.css';
import heroBg from '../assets/images/hometiga.png';
import propertyImage from '../assets/images/homesatu.png';
import btnLogo from '../assets/images/btnlogo.png';

const Properties = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');

    useEffect(() => {
        // Scroll to top when component mounts with smooth animation
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Dummy data - replace with actual API call
        const dummyProperties = [
            {
                id: 1,
                title: 'BUMI SERDAM INDAH "BLOK Q-R"',
                location: 'JL. SUPADIO RAYA DALAM',
                image: propertyImage,
                type: 'Rumah'
            },
            {
                id: 2,
                title: 'BUMI SERDAM INDAH "BLOK Q-R"',
                location: 'JL. SUPADIO RAYA DALAM',
                image: propertyImage,
                type: 'Rumah'
            },
            {
                id: 3,
                title: 'BUMI SERDAM INDAH "BLOK Q-R"',
                location: 'JL. SUPADIO RAYA DALAM',
                image: propertyImage,
                type: 'Rumah'
            },
            {
                id: 4,
                title: 'BUMI SERDAM INDAH "BLOK Q-R"',
                location: 'JL. SUPADIO RAYA DALAM',
                image: propertyImage,
                type: 'Rumah'
            }
        ];

        setProperties(dummyProperties);
        setLoading(false);
    }, []);

    const filteredProperties = properties.filter(property => {
        const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = !selectedType || property.type === selectedType;
        const matchesLocation = !selectedLocation || property.location.includes(selectedLocation);
        return matchesSearch && matchesType && matchesLocation;
    });

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="properties-page">
            <section 
                className="properties-hero"
                style={{ 
                    backgroundImage: `url(${heroBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                <div className="hero-overlay">
                    <h1>PROPERTI KAMI</h1>
                    <p>PT <span className="highlight">FACHRI</span> PROPERTY GROUP</p>
                </div>
            </section>

            <section className="properties-filter">
                <div className="container">
                    <div className="filter-group">
                        <input 
                            type="text" 
                            placeholder="Cari Properti"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="filter-input"
                        />
                        <select 
                            className="filter-select"
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                        >
                            <option value="">Tipe</option>
                            <option value="Rumah">Rumah</option>
                            <option value="Apartemen">Apartemen</option>
                            <option value="Tanah">Tanah</option>
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

            <section className="properties-grid">
                <div className="container">
                    {filteredProperties.map(property => (
                        <div key={property.id} className="property-card">
                            <div className="property-image">
                                <img src={property.image} alt={property.title} />
                            </div>
                            <div className="property-content">
                                <h3>{property.title}</h3>
                                <p className="property-location">{property.location}</p>
                                <Link to={`/properties/${property.id}`} className="property-btn">
                                    lihat detail →
                                </Link>
                            </div>
                        </div>
                    ))}
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
                    <div className="footer-grid">
                        <div className="footer-column">
                            <h4>Relasi Investor</h4>
                            <ul>
                                <li>Laporan Tahunan</li>
                                <li>Laporan Keuangan</li>
                                <li>Tata Kelola Perusahaan</li>
                            </ul>
                        </div>
                        <div className="footer-column">
                            <h4>Keberlanjutan</h4>
                            <ul>
                                <li>Aktivitas CSR</li>
                                <li>Aktivitas SHE</li>
                            </ul>
                        </div>
                        <div className="footer-column">
                            <h4>Produk & Layanan</h4>
                            <ul>
                                <li>WMA Realty Archipelago</li>
                                <li>Pengembangan Properti</li>
                                <li>Asset & Investasi Properti</li>
                                <li>Hotel</li>
                            </ul>
                        </div>
                        <div className="footer-column">
                            <h4>Berita & Acara</h4>
                            <ul>
                                <li>Media</li>
                                <li>E-Magazine</li>
                                <li>Promo</li>
                            </ul>
                        </div>
                        <div className="footer-column">
                            <h4>Perusahaan</h4>
                            <ul>
                                <li>Tentang kami</li>
                                <li>Manajemen Perusahaan</li>
                                <li>Sertifikat & Penghargaan</li>
                                <li>Karir</li>
                                <li>Hubungi Kami</li>
                            </ul>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>Copyright © 2025 Fachri Property Group</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Properties;