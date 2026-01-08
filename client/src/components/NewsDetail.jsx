import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './NewsDetail.css';
import logoHotampt from '../assets/images/logoitampt.png';
import { getNewsById, getNewsList } from '../services/newsService';

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

const NewsDetail = () => {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [latestItems, setLatestItems] = useState([]);

    const observerRef = useRef(null);

    const registerDetailAnimations = () => {
        const root = document.querySelector('.news-detail-page');
        if (!root) return;
        const obs = observerRef.current;
        if (!obs) return;

        const targets = Array.from(root.querySelectorAll('[data-animate]:not(.is-visible)'));
        targets.forEach((el) => {
            const delay = el.getAttribute('data-animate-delay');
            if (delay) el.style.transitionDelay = `${Number(delay)}ms`;
            obs.observe(el);
        });
    };

    useEffect(() => {
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

        const idRaf = window.requestAnimationFrame(() => {
            registerDetailAnimations();
        });

        return () => {
            window.cancelAnimationFrame(idRaf);
            if (observerRef.current) observerRef.current.disconnect();
            observerRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });

        let mounted = true;
        (async () => {
            const data = await getNewsById(id);
            if (mounted) setItem(data);
        })();

        return () => {
            mounted = false;
        };
    }, [id]);

    useEffect(() => {
        let mounted = true;

        (async () => {
            const list = await getNewsList();

            const sorted = [...(list || [])].sort((a, b) => {
                const da = new Date(a?.publishedAt || 0).getTime();
                const db = new Date(b?.publishedAt || 0).getTime();
                return db - da;
            });

            const withoutCurrent = sorted.filter((n) => String(n.id) !== String(id));
            const take = withoutCurrent.slice(0, 6);

            if (mounted) setLatestItems(take);
        })();

        return () => {
            mounted = false;
        };
    }, [id]);

    useEffect(() => {
        const idRaf = window.requestAnimationFrame(() => {
            registerDetailAnimations();
        });
        return () => window.cancelAnimationFrame(idRaf);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [item, latestItems.length]);

    if (!item) {
        return (
            <div className="news-detail-page">
                <section className="news-detail-body">
                    <div className="container" data-animate="fade-up" data-animate-delay="80">
                        <p className="news-detail-notfound">Berita/aktivitas tidak ditemukan.</p>
                        <Link className="news-detail-back" to="/news">
                            Kembali ke Berita
                        </Link>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="news-detail-page">
            {/* Section 1: Foto */}
            <section className="news-detail-hero" data-animate="fade-up" data-animate-delay="60">
                <img className="news-detail-hero-image" src={item.coverImage} alt={item.title} />
            </section>

            {/* Section 2: Penjelasan */}
            <section className="news-detail-body">
                <div className="container">
                    <div className="news-detail-top" data-animate="fade-up" data-animate-delay="90">
                        <Link className="news-detail-back" to="/news">
                            ← Kembali ke Berita
                        </Link>

                        <div className="news-detail-meta">
                            <span className="news-detail-chip">{item.category || 'Berita'}</span>
                            <span className="news-detail-meta-sep">•</span>
                            <span>{formatDateId(item.publishedAt)}</span>
                            {item.location ? (
                                <>
                                    <span className="news-detail-meta-sep">•</span>
                                    <span>{item.location}</span>
                                </>
                            ) : null}
                        </div>

                        <h1 className="news-detail-title">{item.title}</h1>
                        {item.summary ? <p className="news-detail-summary">{item.summary}</p> : null}
                    </div>

                    <div className="news-detail-content" data-animate="fade-up" data-animate-delay="120">
                        {(Array.isArray(item.content) ? item.content : [])
                            .filter(Boolean)
                            .map((p, idx) => (
                                <p key={idx}>{p}</p>
                            ))}
                    </div>
                </div>
            </section>

            {/* NEW Section: Berita Terbaru (card list) */}
            {latestItems.length > 0 ? (
                <section className="news-detail-latest">
                    <div className="container">
                        <h2 className="news-detail-latest-title" data-animate="fade-up" data-animate-delay="60">
                            TEMUKAN LEBIH
                        </h2>

                        <div className="news-detail-latest-grid" data-animate="fade-up" data-animate-delay="110">
                            {latestItems.map((n, idx) => (
                                <Link
                                    key={n.id}
                                    className="news-detail-card-link"
                                    to={`/news/${n.id}`}
                                    data-animate="fade-up"
                                    data-animate-delay={String(80 + Math.min(idx, 6) * 60)}
                                >
                                    <article className="news-detail-card">
                                        <div
                                            className="news-detail-card-cover"
                                            style={
                                                n.coverImage
                                                    ? { backgroundImage: `url(${n.coverImage})` }
                                                    : undefined
                                            }
                                        />
                                        <div className="news-detail-card-body">
                                            <div className="news-detail-card-tag">{n.category || 'Berita'}</div>
                                            <h3 className="news-detail-card-title">{n.title}</h3>
                                            {n.summary ? <p className="news-detail-card-summary">{n.summary}</p> : null}

                                            <div className="news-detail-card-footer">
                                                <span>{formatDateId(n.publishedAt)}</span>
                                                {n.location ? <span>{n.location}</span> : <span />}
                                            </div>
                                        </div>
                                    </article>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            ) : null}

            {/* Section 3: Contact + Footer (footer tetap dari App/layout) */}
            <section id="contact" className="contact-section">
                <div className="container">
                    <h2 data-animate="fade-up" data-animate-delay="60">GET IN TOUCH WITH US</h2>
                    <div className="contact-content">
                        <div className="contact-info" data-animate="fade-right" data-animate-delay="120">
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

                        <div className="contact-map" data-animate="fade-left" data-animate-delay="170">
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

export default NewsDetail;