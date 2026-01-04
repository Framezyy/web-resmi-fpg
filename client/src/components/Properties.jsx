import React, { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import PropertyDetail from './PropertyDetail';
import '../styles/Properties.css';
import propertiesHeroImage from '../assets/images/hero-bg.png';
import btnLogo from '../assets/images/btnlogo.png';
import btnsyariahLogo from '../assets/images/btnsyariahlogo.png';
import mandiriLogo from '../assets/images/mandirilogo.png';
import bniLogo from '../assets/images/bnilogo.png';
import logoHotampt from '../assets/images/logoitampt.png';

const API_URL = 'http://localhost/web-resmi-fpg/server/api';

const Properties = () => {
    const observerRef = useRef(null);

    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [selectedRecapCompany, setSelectedRecapCompany] = useState('all');
    const [recapData, setRecapData] = useState([]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        fetchProperties();
        fetchRecapData();
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

    const fetchRecapData = async () => {
        try {
            const response = await axios.get(`${API_URL}/recaps-list.php`);
            if (response.data.success) {
                setRecapData(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching recap data:', error);
        }
    };

    const getUniqueTypes = () => {
        const types = properties.map(p => p.type).filter(Boolean);
        return [...new Set(types)].sort();
    };

    const formatNumber = (n) => new Intl.NumberFormat('id-ID').format(Number(n || 0));

    const recapCompanies = useMemo(() => {
        const companies = [{ id: 'all', label: 'Semua' }];
        recapData.forEach(r => {
            companies.push({
                id: r.company_id,
                label: r.company_name
            });
        });
        return companies;
    }, [recapData]);

    const recap = useMemo(() => {
        if (selectedRecapCompany !== 'all') {
            const found = recapData.find(r => r.company_id === selectedRecapCompany);
            return found || { total_komplek: 0, total_rumah: 0, total_terjual: 0 };
        }

        return recapData.reduce(
            (acc, cur) => {
                acc.total_komplek += cur.total_komplek;
                acc.total_rumah += cur.total_rumah;
                acc.total_terjual += cur.total_terjual;
                return acc;
            },
            { total_komplek: 0, total_rumah: 0, total_terjual: 0 }
        );
    }, [selectedRecapCompany, recapData]);

    const selectedCompanyLabel = useMemo(() => {
        return recapCompanies.find(c => c.id === selectedRecapCompany)?.label || 'Semua';
    }, [recapCompanies, selectedRecapCompany]);

    const recapSubtitleText = useMemo(() => {
        if (selectedRecapCompany === 'all') {
            return 'Perumahan yang ada di semua perusahaan dan anak cabang fachri';
        }
        return `Perumahan yang ada di ${selectedCompanyLabel}`;
    }, [selectedRecapCompany, selectedCompanyLabel]);

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

    const registerPropertiesAnimations = () => {
        const root = document.querySelector('.properties-page');
        if (!root) return;

        const observer = observerRef.current;
        if (!observer) return;

        const targets = Array.from(root.querySelectorAll('[data-animate]:not(.is-visible)'));
        if (targets.length === 0) return;

        targets.forEach((el) => {
            const delay = el.getAttribute('data-animate-delay');
            if (delay) el.style.transitionDelay = `${Number(delay)}ms`;
            observer.observe(el);
        });
    };

    useEffect(() => {
        if (loading || error) return;

        if (observerRef.current) {
            const id = window.requestAnimationFrame(() => registerPropertiesAnimations());
            return () => window.cancelAnimationFrame(id);
        }

        observerRef.current = new IntersectionObserver(
            (entries, obs) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        obs.unobserve(entry.target);
                    }
                }
            },
            { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
        );

        const id = window.requestAnimationFrame(() => registerPropertiesAnimations());

        return () => {
            window.cancelAnimationFrame(id);
            if (observerRef.current) observerRef.current.disconnect();
            observerRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading, error]);

    const filteredProperties = useMemo(() => {
        return properties.filter(property => {
            const matchesSearch = property.title?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = !selectedType || property.type === selectedType;
            const matchesLocation =
                !selectedLocation || property.location?.toLowerCase().includes(selectedLocation.toLowerCase());
            return matchesSearch && matchesType && matchesLocation;
        });
    }, [properties, searchTerm, selectedType, selectedLocation]);

    useEffect(() => {
        const id = window.requestAnimationFrame(() => registerPropertiesAnimations());
        return () => window.cancelAnimationFrame(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filteredProperties, selectedRecapCompany, recapData, loading, error]);

    if (loading) {
        return (
            <div className="loading-container" data-animate="fade-up" data-animate-delay="60">
                <div className="loading-spinner"></div>
                <p>Loading properties...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container" data-animate="fade-up" data-animate-delay="60">
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
                <div className="hero-overlay" data-animate="fade-up" data-animate-delay="80">
                    <h1 data-animate="fade-up" data-animate-delay="120">PROPERTI KAMI</h1>
                    <p data-animate="fade-up" data-animate-delay="170">
                        PT <span className="highlight">FACHRI</span> PROPERTY GROUP
                    </p>
                </div>
            </section>

            {/* RECAP SECTION */}
            <section className="properties-recap">
                <div className="container recap-container">
                    <div className="recap-center" data-animate="fade-up" data-animate-delay="80">
                        <h2 className="recap-heading" data-animate="fade-up" data-animate-delay="120">
                            REKAPAN PERUMAHAN
                        </h2>
                        <p className="recap-subheading" data-animate="fade-up" data-animate-delay="170">
                            {recapSubtitleText}
                        </p>
                    </div>

                    <div className="recap-cards-area" data-animate="fade-up" data-animate-delay="220">
                        <div className="recap-controls recap-controls--inline" data-animate="fade-left" data-animate-delay="260">
                            <label className="recap-controls-title" htmlFor="recapCompany">
                                PILIH PERUSAHAAN
                            </label>

                            <select
                                id="recapCompany"
                                className="recap-select recap-select--light"
                                value={selectedRecapCompany}
                                onChange={(e) => setSelectedRecapCompany(e.target.value)}
                            >
                                {recapCompanies.map(c => (
                                    <option key={c.id} value={c.id}>{c.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="recap-cards recap-cards--big">
                            <div className="recap-stat-card recap-stat-card--big" data-animate="rise" data-animate-delay="220">
                                <div className="recap-stat-label">TOTAL KOMPLEK</div>
                                <div className="recap-stat-value recap-stat-value--red">
                                    {formatNumber(recap.total_komplek)}
                                </div>
                            </div>

                            <div className="recap-stat-card recap-stat-card--big" data-animate="rise" data-animate-delay="280">
                                <div className="recap-stat-label">TOTAL RUMAH</div>
                                <div className="recap-stat-value recap-stat-value--dark">
                                    {formatNumber(recap.total_rumah)}
                                </div>
                            </div>

                            <div className="recap-stat-card recap-stat-card--big" data-animate="rise" data-animate-delay="340">
                                <div className="recap-stat-label">TOTAL RUMAH TERJUAL</div>
                                <div className="recap-stat-value recap-stat-value--orange">
                                    {formatNumber(recap.total_terjual)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Filter Section */}
            <section className="properties-filter">
                <div className="container">
                    <div className="filter-grid" data-animate="fade-up" data-animate-delay="80">
                        <input
                            type="text"
                            placeholder="Cari Properti"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="filter-input"
                            data-animate="fade-right"
                            data-animate-delay="120"
                        />

                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="filter-select"
                            data-animate="fade-up"
                            data-animate-delay="160"
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
                            data-animate="fade-left"
                            data-animate-delay="200"
                        />
                    </div>
                </div>
            </section>

            {/* Properties List */}
            <section className="properties-list-section">
                <div className="container">
                    {filteredProperties.length > 0 ? (
                        <div className="properties-horizontal-list">
                            {filteredProperties.map((property, idx) => (
                                <div
                                    key={property.id}
                                    className="property-horizontal-item"
                                    data-animate="fade-up"
                                    data-animate-delay={Math.min(60 + idx * 60, 360)}
                                >
                                    <div className="property-image-box" data-animate="fade-right" data-animate-delay="80">
                                        <img
                                            src={property.image || property.main_image}
                                            alt={property.title}
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/450x300?text=Property+Image';
                                            }}
                                        />
                                    </div>

                                    <div className="property-info-box" data-animate="fade-left" data-animate-delay="140">
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
                        <div className="no-properties" data-animate="fade-up" data-animate-delay="80">
                            <p>Tidak ada properti yang ditemukan</p>
                        </div>
                    )}
                </div>

                {/* Partner Banner */}
                <div className="partner-banner" data-animate="fade-up" data-animate-delay="80">
                    <div className="container">
                        <h2 data-animate="fade-up" data-animate-delay="120">FACHRI PROPERTY GROUP MITRA</h2>
                        <div className="partner-logo" data-animate="zoom-in" data-animate-delay="180">
                            <img src={btnLogo} alt="Bank BTN" />
                            <img src={btnsyariahLogo} alt="Bank BTN Syarian" />
                            <img src={bniLogo} alt="Bank BNI" />
                            <img src={mandiriLogo} alt="Bank MANDIRI" />
                        </div>
                    </div>
                </div>
            </section>

            <section className="contact-section">
                <div className="container">
                    <h2 data-animate="fade-up" data-animate-delay="80">GET IN TOUCH WITH US</h2>
                    <div className="contact-content">
                        <div className="contact-info" data-animate="fade-right" data-animate-delay="140">
                            <div className="contact-logo-container">
                                <div className="logo-box">
                                    <img src={logoHotampt} alt="Fachri Property Group" />
                                </div>
                                <h3>FACHRI PROPERTY GROUP</h3>
                            </div>
                            <div className="address">
                                <h4>Alamat Perusahaan</h4>
                                <p>Jl. Ampera No.02, Sungai Jawi, Kec. Pontianak Kota,</p>
                                <p>Kota Pontianak, Kalimantan Barat 78114</p>
                            </div>
                            <div className="contact-details">
                                <h4>Kontak</h4>
                                <p>Phone: +62 822-9899-0669</p>
                                <p>Fax: (0561) 8177746</p>
                                <p>Email: fachripropertygroup@gmail.com</p>
                            </div>
                        </div>
                        <div className="contact-map" data-animate="fade-left" data-animate-delay="180">
                            <iframe
                                title="Map Location"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.816827422188!2d109.2972812!3d-0.0495655!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e1d5939bcb36055%3A0xbbfe8d8aa6d9c520!2sPT.FACHRI%20PROPERTY%20LAND!5e0!3m2!1sid!2sid!4v1766506338420!5m2!1sid!2sid"
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

            {showModal && selectedProperty && (
                <PropertyDetail property={selectedProperty} onClose={handleCloseModal} />
            )}
        </div>
    );
};

export default Properties;