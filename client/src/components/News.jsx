import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import './News.css';
import heroBg from '../assets/images/bg-2.jpeg';
import logoHotampt from '../assets/images/logoitampt.png';
import { getNewsList } from '../services/newsService';

const formatDateId = (isoDate) => {
    try {
        const date = new Date(isoDate);
        return new Intl.DateTimeFormat('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        }).format(date);
    } catch {
        return isoDate;
    }
};

const News = () => {
    const [query, setQuery] = useState('');
    const [items, setItems] = useState([]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });

        let mounted = true;
        (async () => {
            const list = await getNewsList();
            if (mounted) setItems(Array.isArray(list) ? list : []);
        })();

        return () => {
            mounted = false;
        };
    }, []);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return items;

        return items.filter((n) => {
            const haystack = [n.title, n.category, n.summary, n.location]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();
            return haystack.includes(q);
        });
    }, [items, query]);

    return (
        <div className="news-page">
            <section
                className="news-hero"
                style={{
                    backgroundImage: `url(${heroBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            >
                <div className="hero-overlay">
                    <h1>
                        BERITA ACARA
                    </h1>
                    <p>PT <span className="highlight">FACHRI</span> PROPERTY GROUP</p>
                </div>
            </section>

            <section className="news-container">
                <div className="news-search">
                    <input
                        className="news-search-input"
                        type="text"
                        placeholder="Cari berita atau aktivitas (contoh: progress, pelatihan, kunjungan…)"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        aria-label="Cari berita atau aktivitas"
                    />
                </div>

                <div className="news-search-meta">
                    Menampilkan {filtered.length} dari {items.length} data
                </div>

                {filtered.length === 0 ? (
                    <div className="news-empty">Tidak ada berita/aktivitas yang cocok.</div>
                ) : (
                    <div className="news-grid">
                        {filtered.map((n) => (
                            <Link key={n.id} className="news-card-link" to={`/news/${n.id}`}>
                                <article className="news-card">
                                    <div
                                        className="news-card-cover"
                                        style={
                                            n.coverImage
                                                ? { backgroundImage: `url(${n.coverImage})` }
                                                : undefined
                                        }
                                    />
                                    <div className="news-card-body">
                                        <div className="news-card-tag">{n.category || 'Berita'}</div>
                                        <h3 className="news-card-title">{n.title}</h3>
                                        <p className="news-card-summary">{n.summary}</p>
                                        <div className="news-card-footer">
                                            <span>{formatDateId(n.publishedAt)}</span>
                                            <span>{n.location}</span>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                )}
            </section>

            <section id="contact" className="contact-section">
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
        </div>
    );
};

export default News;
