import React, { useState } from 'react';
import './PropertyDetail.css';
import logoImg from '../assets/images/logo-warna.png';

// Import gallery images
import gallery1 from '../assets/images/gallery/gallery1.png';
import gallery2 from '../assets/images/gallery/gallery2.png';
import gallery3 from '../assets/images/gallery/gallery3.png';
import gallery4 from '../assets/images/gallery/gallery4.png';

const PropertyDetail = ({ property, onClose }) => {
    const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);

    // Gallery images - untuk slider galeri di bawah
    const galleryImages = [
        gallery1,
        gallery2,
        gallery3,
        gallery4
    ];

    const nextGallery = () => {
        setCurrentGalleryIndex((prev) => 
            prev === galleryImages.length - 1 ? 0 : prev + 1
        );
    };

    const prevGallery = () => {
        setCurrentGalleryIndex((prev) => 
            prev === 0 ? galleryImages.length - 1 : prev - 1
        );
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>
                    ×
                </button>
                
                <div className="modal-body">
                    {/* Top Section - Gambar Utama */}
                    <div className="main-image-section">
                        <img 
                            src={property.image} 
                            alt={property.title}
                            className="main-property-image"
                        />
                    </div>

                    {/* Penjelasan */}
                    <div className="detail-content">
                        <div className="detail-intro">
                            <h2>{property.title}</h2>
                            <p className="intro-text">
                                Selaah Satu Unit Hunian Property Group. Lorem ipsum dolor sit amet, 
                                consectetur adipiscing elit. Properti dengan lokasi strategis dan fasilitas lengkap. 
                                Nikmati hunian modern dengan kualitas terbaik di lokasi yang strategis. 
                                Dekat dengan pusat kota, sekolah, rumah sakit, dan berbagai fasilitas umum lainnya.
                            </p>
                        </div>

                        {/* Fasilitas dengan Icon */}
                        <div className="facilities-section">
                            <div className="facility-item">
                                <div className="facility-icon">🏠</div>
                                <p>Rumah Subsidi</p>
                            </div>
                            <div className="facility-item">
                                <div className="facility-icon">🏡</div>
                                <p>Strategis</p>
                            </div>
                            <div className="facility-item">
                                <div className="facility-icon">📍</div>
                                <p>Dekat Pusat Kota</p>
                            </div>
                            <div className="facility-item">
                                <div className="facility-icon">✓</div>
                                <p>Fasilitas Lengkap</p>
                            </div>
                        </div>

                        {/* Slider Galeri */}
                        <div className="gallery-section">
                            <h3>Galeri</h3>
                            <div className="gallery-slider">
                                <button className="gallery-btn prev" onClick={prevGallery}>
                                    ‹
                                </button>
                                <div className="gallery-images">
                                    <img 
                                        src={galleryImages[currentGalleryIndex]} 
                                        alt={`Gallery ${currentGalleryIndex + 1}`}
                                        className="gallery-main-image"
                                    />
                                </div>
                                <button className="gallery-btn next" onClick={nextGallery}>
                                    ›
                                </button>
                            </div>
                            <div className="gallery-indicators">
                                {galleryImages.map((_, index) => (
                                    <span 
                                        key={index}
                                        className={`indicator ${index === currentGalleryIndex ? 'active' : ''}`}
                                        onClick={() => setCurrentGalleryIndex(index)}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Map dan Info Box */}
                        <div className="location-section">
                            <div className="map-container">
                                <iframe 
                                    title="Property Location"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.521260322283!2d106.8195613!3d-6.194407!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTEnMzkuOSJTIDEwNsKwNDknMTAuNCJF!5e0!3m2!1sen!2sid!4v1234567890"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen={true}
                                    loading="lazy"
                                ></iframe>
                            </div>
                            
                            <div className="info-box">
                                <div className="info-header">
                                    <img src={logoImg} alt="Logo" className="info-logo" />
                                    <h4>FACHRI PROPERTY GROUP</h4>
                                </div>
                                
                                <div className="info-details">
                                    <h5>Alamat Perusahaan</h5>
                                    <p>Panasonic Tower Lantai 16-G</p>
                                    <p>Jl. DR. Pengabean Km. 2, RT.7/RW.1</p>
                                    <p>Gambir, Campaka</p>
                                    <p>Kecamatan Ciputat Utara</p>
                                    <p>Kota Tangerang Selatan, Banten</p>
                                    <p>Indonesia 15340</p>
                                </div>

                                <div className="info-details">
                                    <h5>Kontak</h5>
                                    <p>Phone: (+6221) 23581300, 21201301</p>
                                    <p>Fax: (+6221) 23581302</p>
                                    <p>Email: cs@fachrisaebaty.co.id</p>
                                </div>

                                <button className="contact-button">
                                    HUBUNGI KAMI
                                </button>
                            </div>
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
