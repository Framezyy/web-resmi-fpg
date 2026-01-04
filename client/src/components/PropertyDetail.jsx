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
        window.open(`https://wa.me/6282298990669?text=${message}`, '_blank');
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
                {/* Close Button */}
                <button className="modal-close" onClick={onClose}>×</button>
                
                {/* Modal Body dengan Scroll */}
                <div className="modal-body">
                    {/* Hero Image Section */}
                    <div className="hero-image-section">
                        <img 
                            src={mainImage} 
                            alt={data.title} 
                            className="hero-image"
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/900x400?text=Property+Image';
                            }}
                        />
                    </div>

                    {/* Company Header */}
                    <div className="company-header">
                        <img src={logoImg} alt="PT Fachri Property Group" className="company-logo-img" />
                        <h1 className="company-title">{data.title}</h1>
                        <p className="welcome-text">{data.welcome_text}</p>
                    </div>

                    {/* About Section */}
                    <div className="about-section">
                        <p className="about-text">{data.about_text}</p>
                    </div>

                    {/* Statistics Section */}
                    <div className="statistics-section">
                        <div className="stat-item">
                            <div className="stat-icon">
                                <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                                    <rect x="10" y="15" width="15" height="35" fill="#4CAF50"/>
                                    <rect x="27" y="20" width="15" height="30" fill="#4CAF50"/>
                                </svg>
                            </div>
                            <div className="stat-value">{data.total_blocks || 0}</div>
                            <div className="stat-label">TOTAL BLOK</div>
                        </div>

                        <div className="stat-item">
                            <div className="stat-icon">
                                <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                                    <rect x="15" y="15" width="12" height="30" fill="#2196F3"/>
                                    <rect x="33" y="15" width="12" height="30" fill="#2196F3"/>
                                    <path d="M20 10L30 5L40 10" stroke="#2196F3" strokeWidth="2"/>
                                </svg>
                            </div>
                            <div className="stat-value">{data.total_units || 0}</div>
                            <div className="stat-label">TOTAL UNIT</div>
                        </div>

                        <div className="stat-item">
                            <div className="stat-icon">
                                <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                                    <path d="M30 10L10 25V50H50V25L30 10Z" fill="#FF9800"/>
                                    <path d="M25 50V35H35V50" fill="white"/>
                                </svg>
                            </div>
                            <div className="stat-value">{data.units_sold || 0}</div>
                            <div className="stat-label">UNIT TERJUAL</div>
                        </div>

                        <div className="stat-item">
                            <div className="stat-icon">
                                <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                                    <rect x="15" y="20" width="30" height="25" stroke="#9C27B0" strokeWidth="2" fill="none"/>
                                    <path d="M20 45V30H40V45" stroke="#9C27B0" strokeWidth="2"/>
                                    <circle cx="25" cy="37" r="2" fill="#9C27B0"/>
                                </svg>
                            </div>
                            <div className="stat-value">{data.units_available || 0}</div>
                            <div className="stat-label">UNIT TERSEDIA</div>
                        </div>
                    </div>

                    {/* Description Section */}
                    {data.description && (
                        <div className="description-section">
                            <h3>Deskripsi</h3>
                            <p>{data.description}</p>
                        </div>
                    )}

                    {/* Gallery Slider */}
                    {galleryImages.length > 0 && (
                        <div className="gallery-slider-section">
                            <div className="gallery-carousel">
                                {galleryImages.length > 1 && (
                                    <div className="carousel-card prev-card">
                                        <img 
                                            src={galleryImages[currentImageIndex === 0 ? galleryImages.length - 1 : currentImageIndex - 1]} 
                                            alt="Previous"
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/300x400?text=Gallery';
                                            }}
                                        />
                                    </div>
                                )}

                                <div className="carousel-card current-card">
                                    <img 
                                        src={galleryImages[currentImageIndex]} 
                                        alt={`Gallery ${currentImageIndex + 1}`}
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/400x500?text=Gallery';
                                        }}
                                    />
                                    <div className="card-label">{data.title}</div>
                                </div>

                                {galleryImages.length > 1 && (
                                    <div className="carousel-card next-card">
                                        <img 
                                            src={galleryImages[currentImageIndex === galleryImages.length - 1 ? 0 : currentImageIndex + 1]} 
                                            alt="Next"
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/300x400?text=Gallery';
                                            }}
                                        />
                                    </div>
                                )}

                                {galleryImages.length > 1 && (
                                    <>
                                        <button className="carousel-nav-btn prev-btn" onClick={handlePrevImage}>
                                            ‹
                                        </button>
                                        <button className="carousel-nav-btn next-btn" onClick={handleNextImage}>
                                            ›
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Map and Contact Section */}
                    <div className="map-contact-section">
                        <div className="map-container">
                            <iframe
                                src={
                                    data.map_embed_url 
                                        ? data.map_embed_url
                                        : `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126748.5634786!2d107.5731170945312!3d-6.903444400000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e6398252477f%3A0x146a1f93d3e815b2!2sBandung!5e0!3m2!1sen!2sid!4v1234567890`
                                }
                                width="100%"
                                height="100%"
                                style={{ border: 0, borderRadius: '15px' }}
                                allowFullScreen=""
                                loading="lazy"
                                title="Property Location"
                            ></iframe>
                        </div>

                        <div className="contact-info-card">
                            <div className="contact-logo">
                                <img src={logoImg} alt="Logo" />
                            </div>
                            <h3 className="contact-company-name">PT Fachri Property Group</h3>
                            
                            <div className="contact-detail">
                                <h4>📍 Alamat</h4>
                                <p>{data.location}</p>
                            </div>

                            <div className="contact-detail">
                                <h4>📞 Telepon</h4>
                                <p>+62 822-9899-0669</p>
                            </div>

                            <div className="contact-detail">
                                <h4>✉️ Email</h4>
                                <p>info@fachripropertygroup.com</p>
                            </div>

                            <button className="contact-whatsapp-btn" onClick={handleWhatsApp}>
                                💬 Hubungi via WhatsApp
                            </button>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="detail-footer">
                        <p>© 2024 PT Fachri Property Group. All Rights Reserved.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyDetail;
