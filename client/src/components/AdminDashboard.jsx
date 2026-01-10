import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/AdminDashboard.css';
import logoFPG from '../assets/images/logo-fpg.png'; // ← GANTI: nama variabel jadi logoFPG
import logoFPL from '../assets/images/logo-fpl.png'; // ← GANTI: nama variabel jadi logoFPL

const API_URL = 'http://localhost/web-resmi-fpg/server/api';

const AdminDashboard = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentProperty, setCurrentProperty] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        location: '',
        map_embed_url: '',
        type: '',
        company: 'FPG', // ← KEMBALIKAN INI
        description: '',
        total_blocks: 0,
        total_units: 0,
        units_sold: 0,
        units_available: 0,
        welcome_text: '',
        about_text: ''
    });
    const [mainImage, setMainImage] = useState(null);
    const [galleryImages, setGalleryImages] = useState([]);
    const [previewMainImage, setPreviewMainImage] = useState(null);

    // === TAMBAH: untuk gallery yang SUDAH ADA + yang mau dihapus ===
    const [existingGalleryImages, setExistingGalleryImages] = useState([]); // url dari DB
    const [deletedGalleryImages, setDeletedGalleryImages] = useState([]);   // url yang ditandai hapus
    // === END TAMBAH ===
    

    const [activeSection, setActiveSection] = useState('properties');
    const [awards, setAwards] = useState([]);
    const [awardFormData, setAwardFormData] = useState({
        title: '',
        year: '',
        display_order: 0
    });
    const [awardImage, setAwardImage] = useState(null);
    const [recaps, setRecaps] = useState([]); // ← TAMBAH INI
    const [editingRecap, setEditingRecap] = useState(null); // ← TAMBAH INI
    const [recapFormData, setRecapFormData] = useState({
        company_id: '',
        company_name: '',
        display_order: 0, // ← TAMBAH INI
        total_komplek: 0,
        total_rumah: 0,
        total_terjual: 0
    }); // ← TAMBAH INI
    const [isCreatingRecap, setIsCreatingRecap] = useState(false); // ← TAMBAH INI

    // =========================
    // NEWS (Berita Acara) - state
    // =========================
    const [newsItems, setNewsItems] = useState([]);
    const [newsLoading, setNewsLoading] = useState(false);
    const [newsEditMode, setNewsEditMode] = useState(false);
    const [currentNews, setCurrentNews] = useState(null);

    const [newsFormData, setNewsFormData] = useState({
        title: '',
        category: '',
        summary: '',
        location: '',
        publishedAt: '',
        contentText: '' // textarea -> akan diubah ke array content[]
    });
    const [newsCoverImage, setNewsCoverImage] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        checkAuth();
        fetchProperties();
        fetchAwards();
        fetchRecaps(); // ← TAMBAH INI
    }, []);

    const checkAuth = () => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin/login');
        }
    };

    const fetchProperties = async () => {
        try {
            const response = await axios.get(`${API_URL}/properties.php`);
            setProperties(Array.isArray(response.data) ? response.data : []);
            setLoading(false);
        } catch (error) {
            console.error('Error:', error);
            setProperties([]);
            setLoading(false);
        }
    };

    const fetchAwards = async () => {
        try {
            const response = await axios.get(`${API_URL}/awards-list.php`);
            if (response.data.success) {
                setAwards(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching awards:', error);
        }
    };

    const fetchRecaps = async () => {
        try {
            const response = await axios.get(`${API_URL}/recaps-list.php`);
            if (response.data.success) {
                setRecaps(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching recaps:', error);
        }
    };

    // =========================
    // NEWS (Berita Acara) - API
    // =========================
    const fetchNews = async () => {
        try {
            setNewsLoading(true);
            const res = await axios.get(`${API_URL}/news-list.php`);
            setNewsItems(Array.isArray(res.data) ? res.data : []);
        } catch (e) {
            console.error('Error fetching news:', e);
            setNewsItems([]);
        } finally {
            setNewsLoading(false);
        }
    };

    const handleNewsInputChange = (e) => {
        const { name, value } = e.target;
        setNewsFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleNewsCoverChange = (e) => {
        const file = e.target.files?.[0] || null;
        setNewsCoverImage(file);
    };

    const openNewsModal = () => {
        setActiveSection('news');
        setShowModal(true);

        setNewsEditMode(false);
        setCurrentNews(null);

        setNewsFormData({
            title: '',
            category: '',
            summary: '',
            location: '',
            publishedAt: '',
            contentText: ''
        });
        setNewsCoverImage(null);
    };

    const handleEditNews = (item) => {
        setActiveSection('news');
        setShowModal(true);

        setNewsEditMode(true);
        setCurrentNews(item);

        const contentArr = Array.isArray(item?.content) ? item.content : [];
        setNewsFormData({
            title: item?.title || '',
            category: item?.category || '',
            summary: item?.summary || '',
            location: item?.location || '',
            publishedAt: item?.publishedAt || '',
            contentText: contentArr.filter(Boolean).join('\n\n')
        });
        setNewsCoverImage(null);
    };

    const handleDeleteNews = async (id) => {
        const ok = window.confirm('Hapus berita ini?');
        if (!ok) return;

        try {
            const token = localStorage.getItem('adminToken');
            await axios.delete(`${API_URL}/news-delete.php?id=${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            await fetchNews();
        } catch (e) {
            console.error('Error deleting news:', e);
            alert(e.response?.data?.message || 'Gagal menghapus berita');
        }
    };

    const handleNewsSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('adminToken');

            const contentArr = (newsFormData.contentText || '')
                .split(/\n+/)
                .map((s) => s.trim())
                .filter(Boolean);

            const fd = new FormData();
            fd.append('title', newsFormData.title || '');
            fd.append('category', newsFormData.category || '');
            fd.append('summary', newsFormData.summary || '');
            fd.append('location', newsFormData.location || '');
            fd.append('publishedAt', newsFormData.publishedAt || '');
            fd.append('content', JSON.stringify(contentArr));

            if (newsCoverImage) {
                fd.append('coverImage', newsCoverImage);
            }

            if (newsEditMode && currentNews?.id) {
                fd.append('id', currentNews.id);
                await axios.post(`${API_URL}/news-update.php`, fd, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`
                    }
                });
            } else {
                await axios.post(`${API_URL}/news-create.php`, fd, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`
                    }
                });
            }

            setShowModal(false);
            setNewsEditMode(false);
            setCurrentNews(null);
            setNewsCoverImage(null);
            await fetchNews();
        } catch (e) {
            console.error('Error saving news:', e);
            alert(e.response?.data?.message || 'Gagal menyimpan berita');
        }
    };

    useEffect(() => {
        // (opsional tapi perlu) saat pindah tab ke "news" -> load datanya
        if (activeSection === 'news') {
            fetchNews();
        }
    }, [activeSection]);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/admin/login');
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleMainImageChange = (e) => {
        const file = e.target.files[0];
        setMainImage(file);
        if (file) {
            setPreviewMainImage(URL.createObjectURL(file));
        }
    };

    const handleGalleryImagesChange = (e) => {
        setGalleryImages(Array.from(e.target.files));
    };

    // === TAMBAH: klik hapus 1 foto existing gallery (ditandai untuk dihapus saat submit) ===
    const handleRemoveExistingGalleryImage = (url) => {
        if (!editMode) return;
        if (!url) return;

        const ok = window.confirm('Hapus foto galeri ini?');
        if (!ok) return;

        setExistingGalleryImages(prev => prev.filter(u => u !== url));
        setDeletedGalleryImages(prev => (prev.includes(url) ? prev : [...prev, url]));
    };
    // === END TAMBAH ===

    // Tambah helper: toggle hapus / batal hapus
  const toggleDeleteGalleryImage = (url) => {
    setDeletedGalleryImages((prev) => {
      if (prev.includes(url)) return prev.filter((x) => x !== url);
      return [...prev, url];
    });
  };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const token = localStorage.getItem('adminToken');
        const formDataToSend = new FormData();
        
        Object.keys(formData).forEach(key => {
            formDataToSend.append(key, formData[key]);
        });
        
        if (mainImage) {
            formDataToSend.append('mainImage', mainImage);
        }
        
        galleryImages.forEach((image) => {
            formDataToSend.append('galleryImages[]', image);
        });

        // === TAMBAH: kirim daftar URL gallery yang ingin dihapus ===
        if (editMode && deletedGalleryImages.length > 0) {
            formDataToSend.append('deleted_gallery_images', JSON.stringify(deletedGalleryImages));
        }
        // === END TAMBAH ===

        try {
            alert('Uploading... Please wait.');

            if (editMode && currentProperty) {
                formDataToSend.append('id', currentProperty.id);
                const response = await axios.post(
                    `${API_URL}/property-update.php`,
                    formDataToSend,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                
                if (response.data.gallery_uploaded !== undefined) {
                    alert(`Property updated! ${response.data.gallery_uploaded} gallery images uploaded.`);
                } else {
                    alert('Property updated successfully!');
                }
            } else {
                const response = await axios.post(
                    `${API_URL}/property-create.php`,
                    formDataToSend,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                
                if (response.data.gallery_uploaded !== undefined) {
                    alert(`Property created! ${response.data.gallery_uploaded} gallery images uploaded.${response.data.failed_uploads.length > 0 ? '\n\nFailed uploads:\n' + response.data.failed_uploads.join('\n') : ''}`);
                } else {
                    alert('Property created successfully!');
                }
            }
            
            closeModal();
            fetchProperties();
        } catch (error) {
            console.error('Error:', error);
            const errorMsg = error.response?.data?.message || error.message || 'Failed to save property';
            alert('Error: ' + errorMsg + '\n\nTips:\n- Check file sizes (max 5MB per image)\n- Make sure all images are valid\n- Try uploading fewer images at once');
        }
    };

    // GANTI FUNCTION handleEdit dengan yang lengkap:
    const handleEdit = async (property) => {
        setEditMode(true);
        setCurrentProperty(property);

        setExistingGalleryImages([]);
        setDeletedGalleryImages([]);

        setFormData({
            title: property.title || '',
            location: property.location || '',
            map_embed_url: property.map_embed_url || '',
            type: property.type || '',
            company: property.company || 'FPG', // ← KEMBALIKAN INI
            description: property.description || '',
            total_blocks: property.total_blocks || 0,
            total_units: property.total_units || 0,
            units_sold: property.units_sold || 0,
            units_available: property.units_available || 0,
            welcome_text: property.welcome_text || '',
            about_text: property.about_text || ''
        });
        
        setPreviewMainImage(property.main_image || property.image || null);
        setShowModal(true);

        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.get(`${API_URL}/property-detail.php?id=${property.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success && Array.isArray(response.data.gallery_images)) {
                setExistingGalleryImages(response.data.gallery_images);
            }
        } catch (err) {
            console.warn('Gagal load gallery:', err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this property?')) {
            return;
        }

        const token = localStorage.getItem('adminToken');
        
        try {
            await axios.delete(
                `${API_URL}/property-delete.php?id=${id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            alert('Property deleted successfully!');
            fetchProperties();
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to delete property');
        }
    };

    // TAMBAH FUNCTION INI
    const handleAwardInputChange = (e) => {
        const { name, value } = e.target;
        setAwardFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // TAMBAH FUNCTION INI
    const handleAwardImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setAwardImage(e.target.files[0]);
        }
    };

    // TAMBAH FUNCTION INI
    const handleAwardSubmit = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('title', awardFormData.title);
        formData.append('year', awardFormData.year);
        formData.append('display_order', awardFormData.display_order);
        if (awardImage) {
            formData.append('image', awardImage);
        }

        try {
            const response = await axios.post(`${API_URL}/award-create.php`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.success) {
                alert('Award added successfully!');
                fetchAwards();
                setShowModal(false);
                setAwardFormData({ title: '', year: '', display_order: 0 });
                setAwardImage(null);
            }
        } catch (error) {
            alert('Error adding award: ' + (error.response?.data?.message || error.message));
        }
    };

    // TAMBAH FUNCTION INI
    const handleDeleteAward = async (id) => {
        if (!window.confirm('Are you sure you want to delete this award?')) return;

        try {
            const response = await axios.delete(`${API_URL}/award-delete.php?id=${id}`);
            if (response.data.success) {
                alert('Award deleted successfully!');
                fetchAwards();
            }
        } catch (error) {
            alert('Error deleting award: ' + (error.response?.data?.message || error.message));
        }
    };

    // ← TAMBAH FUNCTION INI
    const handleEditRecap = (recap) => {
        setEditingRecap({ ...recap });
        setIsCreatingRecap(false);
        setShowModal(true);
    };

    // ← TAMBAH FUNCTION INI
    const handleCreateRecap = () => {
        setRecapFormData({
            company_id: '',
            company_name: '',
            display_order: 0, // ← TAMBAH INI
            total_komplek: 0,
            total_rumah: 0,
            total_terjual: 0
        });
        setIsCreatingRecap(true);
        setShowModal(true);
    };

    // ← TAMBAH FUNCTION INI
    const handleRecapFormChange = (e) => {
        const { name, value } = e.target;
        setRecapFormData(prev => ({
            ...prev,
            [name]: name === 'company_id' || name === 'company_name' ? value : (parseInt(value) || 0)
        }));
    };

    // ← TAMBAH FUNCTION INI
    const handleRecapInputChange = (e) => {
        const { name, value } = e.target;
        setEditingRecap(prev => ({
            ...prev,
            [name]: parseInt(value) || 0
        }));
    };

    // ← TAMBAH FUNCTION INI
    const handleRecapSubmit = async (e) => {
        e.preventDefault();
        
        const token = localStorage.getItem('adminToken');
        
        // ← TAMBAH VALIDASI TOKEN
        if (!token) {
            alert('Session expired. Please login again.');
            navigate('/admin/login');
            return;
        }
        
        const endpoint = isCreatingRecap ? 'recap-create.php' : 'recap-update.php';
        const payload = isCreatingRecap ? recapFormData : editingRecap;
        
        // ← TAMBAH LOG UNTUK DEBUG
        console.log('Sending payload:', payload);
        console.log('To endpoint:', endpoint);
        
        try {
            const response = await axios.post(
                `${API_URL}/${endpoint}`,
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {
                alert(isCreatingRecap ? 'Recap created successfully!' : 'Recap updated successfully!');
                fetchRecaps();
                closeModal();
            }
        } catch (error) {
            console.error('Full error:', error.response || error); // ← TAMBAH LOG DETAIL
            const errorMsg = error.response?.data?.message || error.message;
            alert('Error: ' + errorMsg);
        }
    };

    // GANTI FUNCTION openModal dengan yang lengkap:
    const openModal = () => {
        setShowModal(true);
        setEditMode(false);
        setCurrentProperty(null);
        setFormData({
            title: '',
            location: '',
            map_embed_url: '',
            type: '',
            company: 'FPG', // ← KEMBALIKAN INI (default saat create)
            description: '',
            total_blocks: 0,
            total_units: 0,
            units_sold: 0,
            units_available: 0,
            welcome_text: '',
            about_text: ''
        });
        setMainImage(null);
        setGalleryImages([]);
        setPreviewMainImage(null);

        setExistingGalleryImages([]);
        setDeletedGalleryImages([]);

        setAwardFormData({ title: '', year: '', display_order: 0 });
        setAwardImage(null);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditMode(false);
        setCurrentProperty(null);
        setEditingRecap(null);
        setIsCreatingRecap(false);
        setRecapFormData({
            company_id: '',
            company_name: '',
            display_order: 0,
            total_komplek: 0,
            total_rumah: 0,
            total_terjual: 0
        });
        setFormData({
            title: '',
            location: '',
            map_embed_url: '',
            type: '',
            company: 'FPG', // ← KEMBALIKAN INI (default saat create)
            description: '',
            total_blocks: 0,
            total_units: 0,
            units_sold: 0,
            units_available: 0,
            welcome_text: '',
            about_text: ''
        });
        setMainImage(null);
        setGalleryImages([]);
        setPreviewMainImage(null);

        // === TAMBAH: reset state gallery delete ===
        setExistingGalleryImages([]);
        setDeletedGalleryImages([]);
        // === END TAMBAH ===

        setAwardFormData({ title: '', year: '', display_order: 0 });
        setAwardImage(null);
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="loading-spinner"></div>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            {/* Header - pakai logoFPG sebagai default */}
            <header className="admin-header">
                <div className="admin-header-left">
                    <div className="admin-logo">
                        <img src={logoFPG} alt="Fachri Property Group" />
                        <div className="admin-header-content">
                            <h1>Admin Dashboard</h1>
                        </div>
                    </div>
                </div>

                <div className="admin-actions">
                    {activeSection === 'properties' ? (
                        <button className="btn-add" onClick={openModal}>
                            <span>+</span> Tambah Properti
                        </button>
                    ) : activeSection === 'awards' ? (
                        <button className="btn-add" onClick={openModal}>
                            <span>+</span> Tambah Penghargaan
                        </button>
                    ) : activeSection === 'news' ? (
                        <button className="btn-add" onClick={openNewsModal} type="button">
                            <span>+</span> Tambah Berita 
                        </button>
                    ) : (
                        <button className="btn-add" onClick={handleCreateRecap}>
                            <span>+</span> Tambah Rekapan
                        </button>
                    )}

                    <button className="btn-logout" onClick={handleLogout}>
                        Keluar
                    </button>
                </div>
            </header>

            {/* TAMBAH NAVIGATION TABS */}
            <div className="admin-navigation">
                <button 
                    className={activeSection === 'properties' ? 'nav-btn active' : 'nav-btn'}
                    onClick={() => setActiveSection('properties')}
                >
                    Properti
                </button>
                <button 
                    className={activeSection === 'awards' ? 'nav-btn active' : 'nav-btn'}
                    onClick={() => setActiveSection('awards')}
                >
                    Penghargaan
                </button>
                <button 
                    className={activeSection === 'recaps' ? 'nav-btn active' : 'nav-btn'}
                    onClick={() => setActiveSection('recaps')}
                >
                    Rekapan
                </button>
                <button
                    className={`nav-btn ${activeSection === 'news' ? 'active' : ''}`}
                    onClick={() => setActiveSection('news')}
                    type="button"
                >
                    Berita Acara
                </button>
            </div>

            {/* PROPERTIES SECTION */}
            {activeSection === 'properties' && (
                <>
                    <div className="dashboard-stats">
                        <div className="stat-card">
                            <h3>{properties.length}</h3>
                            <p>Total Properti</p>
                        </div>
                        <div className="stat-card">
                            <h3>{properties.filter(p => p.type === 'Tipe 36').length}</h3>
                            <p>Tipe 36</p>
                        </div>
                        <div className="stat-card">
                            <h3>{properties.filter(p => p.type === 'Tipe 40').length}</h3>
                            <p>Tipe 40</p>
                        </div>
                        <div className="stat-card">
                            <h3>{properties.filter(p => p.type === 'Tipe 45').length}</h3>
                            <p>Tipe 45</p>
                        </div>
                        <div className="stat-card">
                            <h3>{properties.filter(p => p.type === 'Tipe 50').length}</h3>
                            <p>Tipe 50</p>
                        </div>
                        <div className="stat-card">
                            <h3>{properties.filter(p => p.type === 'Tipe 60').length}</h3>
                            <p>Tipe 60</p>
                        </div>
                    </div>

                    <div className="properties-table-container">
                        <h2>Semua Properti</h2>
                        {properties.length > 0 ? (
                            <table className="properties-table">
                                <thead>
                                    <tr>
                                        <th>Foto</th>
                                        <th>Nama Perumahan</th>
                                        <th>Lokasi</th>
                                        <th>Tipe</th>
                                        <th>Menu</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {properties.map(property => (
                                        <tr key={property.id}>
                                            <td>
                                                <img 
                                                    src={property.image || property.main_image} 
                                                    alt={property.title}
                                                    className="table-image"
                                                />
                                            </td>
                                            <td>{property.title}</td>
                                            <td>{property.location}</td>
                                            <td><span className="badge">{property.type}</span></td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button 
                                                        className="btn-edit"
                                                        onClick={() => handleEdit(property)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button 
                                                        className="btn-delete"
                                                        onClick={() => handleDelete(property.id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="no-data">
                                <p>No properties found. Click "Add New Property" to create one.</p>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* AWARDS SECTION */}
            {activeSection === 'awards' && (
                <>
                    

                    <div className="awards-table-container">
                        <h2>Manajemen Penghargaan</h2>
                        {awards.length === 0 ? (
                            <div className="no-data">
                                <p>No awards found. Add your first award!</p>
                            </div>
                        ) : (
                            <table className="properties-table">
                                <thead>
                                    <tr>
                                        <th>Foto</th>
                                        <th>Judul</th>
                                        <th>Tahun</th>
                                        <th>Urutan</th>
                                        <th>Menu</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {awards.map((award) => (
                                        <tr key={award.id}>
                                            <td>
                                                <img 
                                                    src={award.image} 
                                                    alt={award.title}
                                                    className="table-image"
                                                    onError={(e) => {
                                                        e.target.src = 'https://via.placeholder.com/80x60?text=Award';
                                                    }}
                                                />
                                            </td>
                                            <td>{award.title}</td>
                                            <td>{award.year || '-'}</td>
                                            <td>{award.display_order}</td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button 
                                                        className="btn-delete"
                                                        onClick={() => handleDeleteAward(award.id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </>
            )}

            {/* ← TAMBAH RECAPS SECTION */}
            {activeSection === 'recaps' && (
                <div className="awards-table-container">
                    <h2>Manajemen Rekapan Perusahaan</h2>
                    {recaps.length === 0 ? (
                        <div className="no-data">
                            <p>No recaps found. Click "Add New Recap" to create one.</p>
                        </div>
                    ) : (
                        <table className="properties-table">
                            <thead>
                                <tr>
                                    <th>Nomor</th> {/* ← TAMBAH KOLOM INI */}
                                    <th>Perusahaan</th>
                                    <th>Total Komplek</th>
                                    <th>Total Rumah</th>
                                    <th>Total Terjual</th>
                                    <th>Menu</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recaps.map(recap => (
                                    <tr key={recap.id}>
                                        <td><strong>{recap.display_order}</strong></td> {/* ← TAMBAH INI */}
                                        <td><strong>{recap.company_name}</strong></td>
                                        <td>{recap.total_komplek}</td>
                                        <td>{recap.total_rumah}</td>
                                        <td>{recap.total_terjual}</td>
                                        <td>
                                            <button 
                                                className="btn-edit"
                                                onClick={() => handleEditRecap(recap)}
                                            >
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {/* === SECTION CONTENT: NEWS === */}
            {activeSection === 'news' ? (
                <div className="properties-table-container">
                    <h2>Berita Acara</h2>

                    {newsLoading ? (
                        <div className="no-data">
                            <p>Loading...</p>
                        </div>
                    ) : newsItems.length === 0 ? (
                        <div className="no-data">
                            <p>Belum ada berita.</p>
                        </div>
                    ) : (
                        <table className="properties-table">
                            <thead>
                                <tr>
                                    <th>Cover</th>
                                    <th>Judul</th>
                                    <th>Kategori</th>
                                    <th>Tanggal</th>
                                    <th>Lokasi</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {newsItems.map((n) => (
                                    <tr key={n.id}>
                                        <td>
                                            {n.coverImage ? (
                                                <img className="table-image" src={n.coverImage} alt={n.title} />
                                            ) : (
                                                <span>-</span>
                                            )}
                                        </td>
                                        <td>{n.title}</td>
                                        <td>{n.category || '-'}</td>
                                        <td>{n.publishedAt || '-'}</td>
                                        <td>{n.location || '-'}</td>
                                        <td>
                                            <div className="action-buttons">
                                                <button className="btn-edit" type="button" onClick={() => handleEditNews(n)}>
                                                    Edit
                                                </button>
                                                <button className="btn-delete" type="button" onClick={() => handleDeleteNews(n.id)}>
                                                    Hapus
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            ) : null}

            {/* === MODAL === */}
            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>
                                {activeSection === 'news'
                                    ? (newsEditMode ? 'Edit Berita' : 'Tambah Berita')
                                    : activeSection === 'awards'
                                    ? 'Tambah Penghargaan'
                                    : activeSection === 'recaps'
                                    ? (isCreatingRecap ? 'Tambah Rekapan' : 'Edit Rekapan')
                                    : (editMode ? 'Edit Properti' : 'Tambah Properti')}
                            </h2>
                            <button className="close-btn" type="button" onClick={closeModal}>
                                &times;
                            </button>
                        </div>

            {/* FORM NEWS */}
            {activeSection === 'news' ? (
                <form onSubmit={handleNewsSubmit}>
                    <div className="form-group">
                        <label>Judul</label>
                        <input
                            name="title"
                            value={newsFormData.title}
                            onChange={handleNewsInputChange}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Kategori</label>
                            <input
                                name="category"
                                value={newsFormData.category}
                                onChange={handleNewsInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Tanggal</label>
                            <input
                                type="date"
                                name="publishedAt"
                                value={newsFormData.publishedAt}
                                onChange={handleNewsInputChange}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Lokasi</label>
                        <input
                            name="location"
                            value={newsFormData.location}
                            onChange={handleNewsInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Summary</label>
                        <textarea
                            name="summary"
                            value={newsFormData.summary}
                            onChange={handleNewsInputChange}
                            rows={4}
                        />
                    </div>

                    <div className="form-group">
                        <label>Cover Image</label>
                        <input type="file" accept="image/*" onChange={handleNewsCoverChange} />
                    </div>

                    <div className="form-group">
                        <label>Konten (pisahkan paragraf dengan enter)</label>
                        <textarea
                            name="contentText"
                            value={newsFormData.contentText}
                            onChange={handleNewsInputChange}
                            rows={10}
                        />
                    </div>

                    <div className="form-actions">
                        <button className="btn-cancel" type="button" onClick={closeModal}>
                            Batal
                        </button>
                        <button className="btn-submit" type="submit">
                            Simpan
                        </button>
                    </div>
                </form>
            ) : null}

            {/* FORM PROPERTI */}
            {activeSection === 'properties' ? (
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Nama Perumahan</label>
                            <input name="title" value={formData.title} onChange={handleInputChange} required />
                        </div>

                        <div className="form-group">
                            <label>Lokasi</label>
                            <input name="location" value={formData.location} onChange={handleInputChange} required />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Tipe</label>
                            <select name="type" value={formData.type} onChange={handleInputChange} required>
                                <option value="">Pilih tipe</option>
                                <option value="Tipe 36">Tipe 36</option>
                                <option value="Tipe 40">Tipe 40</option>
                                <option value="Tipe 45">Tipe 45</option>
                                <option value="Tipe 50">Tipe 50</option>
                                <option value="Tipe 60">Tipe 60</option>
                            </select>
                        </div>

                        {/* ← KEMBALIKAN DROPDOWN PERUSAHAAN DI SINI */}
                        <div className="form-group">
                            <label>Perusahaan</label>
                            <select name="company" value={formData.company} onChange={handleInputChange} required>
                                <option value="FPG">Fachri Property Group</option>
                                <option value="FPL">Fachri Property Land</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Map Embed URL / Iframe</label>
                        <input name="map_embed_url" value={formData.map_embed_url} onChange={handleInputChange} />
                    </div>

                    <div className="form-group">
                        <label>Deskripsi</label>
                        <textarea name="description" value={formData.description} onChange={handleInputChange} rows={4} />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Total Blok</label>
                            <input type="number" name="total_blocks" value={formData.total_blocks} onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label>Total Unit</label>
                            <input type="number" name="total_units" value={formData.total_units} onChange={handleInputChange} />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Unit Terjual</label>
                            <input type="number" name="units_sold" value={formData.units_sold} onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label>Unit Tersedia</label>
                            <input type="number" name="units_available" value={formData.units_available} onChange={handleInputChange} />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Welcome Text</label>
                        <textarea name="welcome_text" value={formData.welcome_text} onChange={handleInputChange} rows={3} />
                    </div>

                    <div className="form-group">
                        <label>About Text</label>
                        <textarea name="about_text" value={formData.about_text} onChange={handleInputChange} rows={3} />
                    </div>

                    <div className="form-group">
                        <label>Foto Utama</label>
                        <input type="file" accept="image/*" onChange={handleMainImageChange} />
                        {previewMainImage ? (
                            <div className="image-preview">
                                <img src={previewMainImage} alt="Preview" />
                            </div>
                        ) : null}
                    </div>

                    {/* === GALLERY SAAT INI (HANYA MUNCUL SAAT EDIT) === */}
      {editMode && existingGalleryImages.length > 0 ? (
        <div className="form-group">
          <label>Gallery Saat Ini</label>

          <div className="existing-gallery">
            {existingGalleryImages.map((url) => {
              const marked = deletedGalleryImages.includes(url);
              return (
                <div
                  key={url}
                  className={`existing-gallery-item ${marked ? 'marked-delete' : ''}`}
                >
                  <img src={url} alt="Gallery" />
                  <button
                    type="button"
                    className="btn-remove-gallery"
                    onClick={() => toggleDeleteGalleryImage(url)}
                  >
                    {marked ? 'Batal' : 'Hapus'}
                  </button>
                </div>
              );
            })}
          </div>

          <small>
            Klik <b>Hapus</b> untuk menandai gambar akan dihapus saat Simpan.
          </small>
        </div>
      ) : null}

                    <div className="form-group">
                        <label>Gallery Images</label>
                        <input type="file" accept="image/*" multiple onChange={handleGalleryImagesChange} />
                    </div>

                    <div className="form-actions">
                        <button className="btn-cancel" type="button" onClick={closeModal}>
                            Batal
                        </button>
                        <button className="btn-submit" type="submit">
                            Simpan
                        </button>
                    </div>
                </form>
            ) : null}

            {/* FORM PENGHARGAAN */}
            {activeSection === 'awards' ? (
                <form onSubmit={handleAwardSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Judul</label>
                            <input name="title" value={awardFormData.title} onChange={handleAwardInputChange} required />
                        </div>
                        <div className="form-group">
                            <label>Tahun</label>
                            <input name="year" value={awardFormData.year} onChange={handleAwardInputChange} />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Urutan</label>
                        <input
                            type="number"
                            name="display_order"
                            value={awardFormData.display_order}
                            onChange={handleAwardInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Gambar</label>
                        <input type="file" accept="image/*" onChange={handleAwardImageChange} required />
                    </div>

                    <div className="form-actions">
                        <button className="btn-cancel" type="button" onClick={closeModal}>
                            Batal
                        </button>
                        <button className="btn-submit" type="submit">
                            Simpan
                        </button>
                    </div>
                </form>
            ) : null}

            {/* FORM REKAPAN */}
            {activeSection === 'recaps' ? (
                <form onSubmit={handleRecapSubmit}>
                    {isCreatingRecap ? (
                        <div className="form-row">
                            <div className="form-group">
                                <label>Company ID</label>
                                <input name="company_id" value={recapFormData.company_id} onChange={handleRecapFormChange} required />
                            </div>
                            <div className="form-group">
                                <label>Company Name</label>
                                <input name="company_name" value={recapFormData.company_name} onChange={handleRecapFormChange} required />
                            </div>
                        </div>
                    ) : null}

                    <div className="form-row">
                        <div className="form-group">
                            <label>Nomor (display_order)</label>
                            <input
                                type="number"
                                name="display_order"
                                value={isCreatingRecap ? recapFormData.display_order : (editingRecap?.display_order ?? 0)}
                                onChange={isCreatingRecap ? handleRecapFormChange : (e) => setEditingRecap(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                            />
                        </div>
                        <div className="form-group">
                            <label>Total Komplek</label>
                            <input
                                type="number"
                                name="total_komplek"
                                value={isCreatingRecap ? recapFormData.total_komplek : (editingRecap?.total_komplek ?? 0)}
                                onChange={isCreatingRecap ? handleRecapFormChange : handleRecapInputChange}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Total Rumah</label>
                            <input
                                type="number"
                                name="total_rumah"
                                value={isCreatingRecap ? recapFormData.total_rumah : (editingRecap?.total_rumah ?? 0)}
                                onChange={isCreatingRecap ? handleRecapFormChange : handleRecapInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Total Terjual</label>
                            <input
                                type="number"
                                name="total_terjual"
                                value={isCreatingRecap ? recapFormData.total_terjual : (editingRecap?.total_terjual ?? 0)}
                                onChange={isCreatingRecap ? handleRecapFormChange : handleRecapInputChange}
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button className="btn-cancel" type="button" onClick={closeModal}>
                            Batal
                        </button>
                        <button className="btn-submit" type="submit">
                            Simpan
                        </button>
                    </div>
                </form>
            ) : null}
        </div>
    </div>
)}

            {/* ...existing code... */}
        </div>
    );
};

export default AdminDashboard;