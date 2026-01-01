import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PropertyDetail.css';
import logoImg from '../assets/images/logo-warna.png';

const API_URL = 'http://localhost/web-resmi-fpg/server/api';

const PropertyDetail = ({ property, onClose }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [propertyDetail, setPropertyDetail] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPropertyDetail();
    }, [property.id]);

    const fetchPropertyDetail = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/property-detail.php?id=${property.id}`);
            
            if (response.data.success) {
                setPropertyDetail(response.data);
            } else {
                setPropertyDetail(property);
            }
        } catch (error) {
            console.error('Error fetching property detail:', error);
            setPropertyDetail(property);
        } finally {
            setLoading(false);
        }
    };

    const handlePrevImage = () => {
        const images = propertyDetail?.gallery_images || [];
        if (images.length === 0) return;
        setCurrentImageIndex((prev) => prev === 0 ? images.length - 1 : prev - 1);
    };

    const handleNextImage = () => {
        const images = propertyDetail?.gallery_images || [];
        if (images.length === 0) return;
        setCurrentImageIndex((prev) => prev === images.length - 1 ? 0 : prev + 1);
    };

    const handleWhatsApp = () => {
        const data = propertyDetail || property;
        const message = encodeURIComponent(
            `Halo, saya tertarik dengan properti:\n\n` +
            `Nama: ${data.title}\n` +
            `Lokasi: ${data.location}\n` +
            `Tipe: ${data.type}\n\n` +
            `Mohon informasi lebih lanjut. Terima kasih.`
        );
        window.open(`https://wa.me/6281234567890?text=${message}`, '_blank');
    };

    if (loading) {
        return (
            <div className="modal-overlay">
                <div className="modal-content loading-modal">
                    <div className="loading-spinner"></div>
                    <p>Memuat detail properti...</p>
                </div>
                <button className="modal-close" onClick={onClose}>×</button>
            </div>
        );
    }

    const data = propertyDetail || property;
    const galleryImages = data.gallery_images || [];
    const mainImage = data.main_image || data.image;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content figma-design" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>×</button>

                <div className="modal-body">
                    {/* Hero Image - Full Width */}
                    <div className="hero-image-section">
                        <img 
                            src={mainImage} 
                            alt={data.title}
                            className="hero-image"
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/1200x500?text=Property+Image';
                            }}
                        />
                    </div>

                    {/* Company Header with Logo */}
                    <div className="company-header">
                        <img src={logoImg} alt="FPG Logo" className="company-logo-img" />
                        <h1 className="company-title">PT FACHRI PROPERTY GROUP</h1>
                        <p className="welcome-text">{data.welcome_text || 'Selamat datang di PT FACHRI PROPERTY GROUP'}</p>
                    </div>

                    {/* About Section */}
                    <div className="about-section">
                        <p className="about-text">
                            {data.about_text || 'Borneo Real Properti Adalah Perusahaan Yang Bergerak Di Bidang Pengembangan Dan Pemasaran Properti, Dengan Fokus Pada Penyediaan Hunian Dan Aset Properti Yang Berkualitas, Bernilai Investasi, Serta Sesuai Dengan Kebutuhan Pasar.'}
                        </p>
                    </div>

                    {/* Statistics Icons - 4 Columns */}
                    <div className="statistics-section">
                        <div className="stat-item">
                            <div className="stat-icon">
                                <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                                    <path d="M10 50H50M15 50V30L30 15L45 30V50M20 50V35H40V50" stroke="#4CAF50" strokeWidth="2"/>
                                </svg>
                            </div>
                            <div className="stat-value">{data.land_area || '2.000 hektar'}</div>
                            <div className="stat-label">LAHAN PENGEMBANGAN</div>
                        </div>

                        <div className="stat-item">
                            <div className="stat-icon">
                                <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                                    <circle cx="30" cy="30" r="20" stroke="#2196F3" strokeWidth="2"/>
                                    <path d="M30 20V30L35 35" stroke="#2196F3" strokeWidth="2"/>
                                </svg>
                            </div>
                            <div className="stat-value" style={{fontSize: '14px', lineHeight: '1.3'}}>
                                {data.integration_type || 'Pengembangan Terintegrasi'}
                            </div>
                            <div className="stat-label">KOTA YANG BERSIH, HIJAU DAN MODERN</div>
                        </div>

                        <div className="stat-item">
                            <div className="stat-icon">
                                <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                                    <rect x="15" y="15" width="30" height="30" stroke="#FF9800" strokeWidth="2"/>
                                    <circle cx="30" cy="30" r="5" fill="#FF9800"/>
                                </svg>
                            </div>
                            <div className="stat-value">{data.city_distance || '15 km'}</div>
                            <div className="stat-label">DARI PUSAT KOTA SURABAYA</div>
                        </div>

                        <div className="stat-item">
                            <div className="stat-icon">
                                <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                                    <path d="M20 25L30 15L40 25M30 15V45" stroke="#9C27B0" strokeWidth="2"/>
                                    <circle cx="30" cy="20" r="3" fill="#9C27B0"/>
                                </svg>
                            </div>
                            <div className="stat-value">{data.airport_distance || '20 km'}</div>
                            <div className="stat-label">DARI BANDARA INTERNASIONAL JUANDA</div>
                        </div>
                    </div>

                    {/* Gallery Slider */}
                    {galleryImages.length > 0 && (
                        <div className="gallery-slider-section">
                            <div className="gallery-slider-container">
                                <button className="slider-nav prev" onClick={handlePrevImage}>
                                    ‹
                                </button>
                                
                                <div className="gallery-slide">
                                    <img 
                                        src={galleryImages[currentImageIndex]} 
                                        alt={`Gallery ${currentImageIndex + 1}`}
                                        className="gallery-slide-image"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/800x500?text=Gallery+Image';
                                        }}
                                    />
                                </div>

                                <button className="slider-nav next" onClick={handleNextImage}>
                                    ›
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Map and Contact Info */}
                    <div className="map-contact-section">
                        <div className="map-wrapper">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126748.56347862248!2d107.57311709453124!3d-6.903444400000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e6398252477f%3A0x146a1f93d3e815b2!2sBandung%2C%20Bandung%20City%2C%20West%20Java!5e0!3m2!1sen!2sid!4v1234567890"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                title="Property Location"
                            ></iframe>
                        </div>

                        <div className="contact-info-card">
                            <div className="contact-logo">
                                <img src={logoImg} alt="FPG Logo" />
                            </div>
                            <h3 className="contact-company-name">PT Fachri Property Group</h3>
                            
                            <div className="contact-detail">
                                <h4>Alamat Perusahaan</h4>
                                <p>Tanamas Hive Office, Lantai 12-15,</p>
                                <p>Jl. Let. Jend. Suprapto No.60, Kec. Cempaka</p>
                                <p>Putih, Kecamatan Johar Baru, Kota Jakarta Pusat,</p>
                                <p>Daerah Khusus Ibukota Jakarta 10510</p>
                            </div>

                            <div className="contact-detail">
                                <h4>Kontak</h4>
                                <p>Telepon: (+6221) 21101200, 21101201</p>
                                <p>Fax: (+6221) 21101202, 23582303</p>
                                <p>Email: cs@wmarkarealty.co.id</p>
                            </div>

                            <button className="contact-whatsapp-btn" onClick={handleWhatsApp}>
                                Hubungi kami
                            </button>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="detail-footer">
                        <p>Copyright © 2025 Fachri Property Group</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyDetail;
