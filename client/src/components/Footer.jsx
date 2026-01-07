import React from 'react';
import { FaFacebookF, FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa';
import '../styles/Footer.css';

const Footer = () => {
    return (
        <footer className="site-footer">
            <div className="footer-inner">
                <div className="footer-social">
                    <a
                        className="footer-social-link"
                        href="https://www.facebook.com/FachriiPropertyland/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Facebook"
                        title="Facebook"
                    >
                        <FaFacebookF />
                    </a>

                    <a
                        className="footer-social-link"
                        href="https://www.instagram.com/fachriproperty.group?igsh=Y2EwbXRrNWRjZDc5"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Instagram"
                        title="Instagram"
                    >
                        <FaInstagram />
                    </a>

                    <a
                        className="footer-social-link"
                        href="https://www.tiktok.com/@fachri.propertigroup"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="TikTok"
                        title="TikTok"
                    >
                        <FaTiktok />
                    </a>

                    <a
                        className="footer-social-link"
                        href="https://youtube.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="YouTube"
                        title="YouTube"
                    >
                        <FaYoutube />
                    </a>
                </div>

                <div className="footer-divider" />

                <div className="footer-copy">
                    PT Fachri Property Group © {new Date().getFullYear()} All Right Reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;