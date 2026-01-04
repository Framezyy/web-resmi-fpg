import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import PropertyDetail from './PropertyDetail';
import '../styles/Properties.css';
import propertiesHeroImage from '../assets/images/hero-bg.png';
import btnLogo from '../assets/images/btnlogo.png';
import btnsyariahLogo from '../assets/images/btnsyariahlogo.png';
import mandiriLogo from '../assets/images/mandirilogo.png';
import bniLogo from '../assets/images/bnilogo.png';
import logoHotampt from '../assets/images/logoitampt.png'; // ADD

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

    // NEW: dropdown recap
    const [selectedRecapCompany, setSelectedRecapCompany] = useState('all');

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

    const getUniqueTypes = () => {
        const types = properties.map(p => p.type).filter(Boolean);
        return [...new Set(types)].sort();
    };

    const formatNumber = (n) => new Intl.NumberFormat('id-ID').format(Number(n || 0));

    // ===== DUMMY RECAP DATA (sementara) =====
    const recapCompanies = useMemo(
        () => ([
            { id: 'all', label: 'Semua' },
            { id: 'fpg', label: 'PT Fachri Property Group' },
            { id: 'fpl', label: 'PT Fachri Properti Land' },
            { id: 'bid', label: 'PT Borneo Icon Developer' },
            { id: 'brp', label: 'PT Borneo Real Properti' },
        ]),
        []
    );

    const recapDummyByCompany = useMemo(
        () => ({
            fpg: { totalKomplek: 8, totalRumah: 420, totalTerjual: 265 },
            fpl: { totalKomplek: 5, totalRumah: 310, totalTerjual: 140 },
            bid: { totalKomplek: 3, totalRumah: 180, totalTerjual: 95 },
            brp: { totalKomplek: 4, totalRumah: 260, totalTerjual: 155 },
        }),
        []
    );

    const recap = useMemo(() => {
        if (selectedRecapCompany !== 'all') {
            return recapDummyByCompany[selectedRecapCompany] || { totalKomplek: 0, totalRumah: 0, totalTerjual: 0 };
        }

        // agregasi "Semua"
        const keys = Object.keys(recapDummyByCompany);
        return keys.reduce(
            (acc, k) => {
                const cur = recapDummyByCompany[k];
                acc.totalKomplek += Number(cur.totalKomplek || 0);
                acc.totalRumah += Number(cur.totalRumah || 0);
                acc.totalTerjual += Number(cur.totalTerjual || 0);
                return acc;
            },
            { totalKomplek: 0, totalRumah: 0, totalTerjual: 0 }
        );
    }, [selectedRecapCompany, recapDummyByCompany]);

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

            {/* ===== RECAP SECTION (FULL 1 layar + center + dropdown kanan atas kartu) ===== */}
            <section className="properties-recap">
                <div className="container recap-container">
                    <div className="recap-center">
                        <h2 className="recap-heading">REKAPAN PERUMAHAN</h2>
                        <p className="recap-subheading">
                            {recapSubtitleText}
                        </p>
                    </div>

                    <div className="recap-cards-area">
                        <div className="recap-controls recap-controls--inline">
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
                            <div className="recap-stat-card recap-stat-card--big">
                                <div className="recap-stat-label">TOTAL KOMPLEK</div>
                                <div className="recap-stat-value recap-stat-value--red">
                                    {formatNumber(recap.totalKomplek)}
                                </div>
                            </div>

                            <div className="recap-stat-card recap-stat-card--big">
                                <div className="recap-stat-label">TOTAL RUMAH</div>
                                <div className="recap-stat-value recap-stat-value--dark">
                                    {formatNumber(recap.totalRumah)}
                                </div>
                            </div>

                            <div className="recap-stat-card recap-stat-card--big">
                                <div className="recap-stat-label">TOTAL RUMAH TERJUAL</div>
                                <div className="recap-stat-value recap-stat-value--orange">
                                    {formatNumber(recap.totalTerjual)}
                                </div>
                            </div>
                        </div>
                    </div>
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

            {/* Properties List */}
            <section className="properties-list-section">
                <div className="container">
                    {filteredProperties.length > 0 ? (
                        <div className="properties-horizontal-list">
                            {filteredProperties.map(property => (
                                <div key={property.id} className="property-horizontal-item">
                                    <div className="property-image-box">
                                        <img
                                            src={property.image || property.main_image}
                                            alt={property.title}
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/450x300?text=Property+Image';
                                            }}
                                        />
                                    </div>

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

                {/* Partner Banner (dipindah ke dalam section properties) */}
                <div className="partner-banner">
                    <div className="container">
                        <h2>FACHRI PROPERTY GROUP MITRA</h2>
                        <div className="partner-logo">
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
                    <h2>GET IN TOUCH WITH US</h2>
                    <div className="contact-content">
                        <div className="contact-info">
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
                        <div className="contact-map">
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