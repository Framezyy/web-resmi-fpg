import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/AdminDashboard.css';
import logoColor from '../assets/images/logo-warna.png'; // ← TAMBAH INI

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
        map_embed_url: '',  // ← GANTI dari latitude/longitude
        type: '',
        description: ''
    });
    const [mainImage, setMainImage] = useState(null);
    const [galleryImages, setGalleryImages] = useState([]);
    const [previewMainImage, setPreviewMainImage] = useState(null);
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

    // ← TAMBAH FUNCTION INI
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

        try {
            // ← TAMBAH: Show loading
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
                
                // ← TAMBAH: Show detailed message
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
                
                // ← TAMBAH: Show detailed message
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
            // ← TAMBAH: Show detailed error
            const errorMsg = error.response?.data?.message || error.message || 'Failed to save property';
            alert('Error: ' + errorMsg + '\n\nTips:\n- Check file sizes (max 5MB per image)\n- Make sure all images are valid\n- Try uploading fewer images at once');
        }
    };

    // GANTI FUNCTION handleEdit dengan yang lengkap:
    const handleEdit = (property) => {
        setEditMode(true);
        setCurrentProperty(property);
        
        // SET SEMUA FIELD dengan nilai dari database (gunakan || '' untuk fallback)
        setFormData({
            title: property.title || '',
            location: property.location || '',
            map_embed_url: property.map_embed_url || '',
            type: property.type || '',
            description: property.description || '',
            total_blocks: property.total_blocks || 0,
            total_units: property.total_units || 0,
            units_sold: property.units_sold || 0,
            units_available: property.units_available || 0,
            welcome_text: property.welcome_text || '',
            about_text: property.about_text || ''
        });
        
        // SET preview image
        setPreviewMainImage(property.main_image || property.image || null);
        setShowModal(true);
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
            description: '',
            total_blocks: 0,         // ← TAMBAH
            total_units: 0,          // ← TAMBAH
            units_sold: 0,           // ← TAMBAH
            units_available: 0,      // ← TAMBAH
            welcome_text: '',        // ← TAMBAH
            about_text: ''           // ← TAMBAH
        });
        setMainImage(null);
        setGalleryImages([]);
        setPreviewMainImage(null);
        setAwardFormData({ title: '', year: '', display_order: 0 });
        setAwardImage(null);
    };

    // ← UPDATE closeModal
    const closeModal = () => {
        setShowModal(false);
        setEditMode(false);
        setCurrentProperty(null);
        setEditingRecap(null);
        setIsCreatingRecap(false);
        setRecapFormData({
            company_id: '',
            company_name: '',
            display_order: 0, // ← TAMBAH INI
            total_komplek: 0,
            total_rumah: 0,
            total_terjual: 0
        });
        setFormData({
            title: '',
            location: '',
            map_embed_url: '',
            type: '',
            description: '',
            total_blocks: 0,         // ← TAMBAH
            total_units: 0,          // ← TAMBAH
            units_sold: 0,           // ← TAMBAH
            units_available: 0,      // ← TAMBAH
            welcome_text: '',        // ← TAMBAH
            about_text: ''           // ← TAMBAH
        });
        setMainImage(null);
        setGalleryImages([]);
        setPreviewMainImage(null);
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
            {/* UPDATE HEADER INI */}
            <header className="admin-header">
                <div className="admin-header-left">
                    <div className="admin-logo">
                        <img src={logoColor} alt="Fachri Property Group" />
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
                    <div className="awards-stats">
                        <div className="stat-card">
                            <h3>{awards.length}</h3>
                            <p>Total Penghargaan</p>
                        </div>
                    </div>

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

            {/* ← UPDATE MODAL */}
            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>
                                {activeSection === 'properties' 
                                    ? (editMode ? 'Edit Property' : 'Add New Property')
                                    : activeSection === 'awards'
                                    ? 'Add New Award'
                                    : isCreatingRecap
                                    ? 'Add New Company Recap'
                                    : 'Edit Company Recap'
                                }
                            </h2>
                            <button className="close-btn" onClick={closeModal}>&times;</button>
                        </div>

                        {activeSection === 'properties' ? (
                            <form onSubmit={handleSubmit}>
                                {/* Row 1: Title & Type */}
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Title *</label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            placeholder="Enter property title"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Type *</label>
                                        <select
                                            name="type"
                                            value={formData.type}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Select Type</option>
                                            <option value="Tipe 36">Tipe 36</option>
                                            <option value="Tipe 40">Tipe 40</option>
                                            <option value="Tipe 50">Tipe 50</option>
                                            <option value="Tipe 60">Tipe 60</option>
                                            
                                        </select>
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="form-group">
                                    <label>Location *</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        placeholder="Enter location"
                                        required
                                    />
                                </div>

                                {/* Row 2: Total Blok & Total Unit */}
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Total Blok</label>
                                        <input
                                            type="number"
                                            name="total_blocks"
                                            value={formData.total_blocks}
                                            onChange={handleInputChange}
                                            placeholder="5"
                                            min="0"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Total Unit</label>
                                        <input
                                            type="number"
                                            name="total_units"
                                            value={formData.total_units}
                                            onChange={handleInputChange}
                                            placeholder="120"
                                            min="0"
                                        />
                                    </div>
                                </div>

                                {/* Row 3: Unit Terjual & Unit Tersedia */}
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Unit Terjual</label>
                                        <input
                                            type="number"
                                            name="units_sold"
                                            value={formData.units_sold}
                                            onChange={handleInputChange}
                                            placeholder="85"
                                            min="0"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Unit Tersedia</label>
                                        <input
                                            type="number"
                                            name="units_available"
                                            value={formData.units_available}
                                            onChange={handleInputChange}
                                            placeholder="35"
                                            min="0"
                                        />
                                    </div>
                                </div>

                                {/* Welcome Text */}
                                <div className="form-group">
                                    <label>Welcome Text</label>
                                    <input
                                        type="text"
                                        name="welcome_text"
                                        value={formData.welcome_text}
                                        onChange={handleInputChange}
                                        placeholder="Selamat datang di PT FACHRI PROPERTY GROUP"
                                    />
                                </div>

                                {/* About Text */}
                                <div className="form-group">
                                    <label>About Text</label>
                                    <textarea
                                        name="about_text"
                                        value={formData.about_text}
                                        onChange={handleInputChange}
                                        placeholder="Borneo Real Properti Adalah Perusahaan..."
                                        rows="4"
                                    />
                                </div>

                                {/* Main Image */}
                                <div className="form-group">
                                    <label>Main Image {editMode && '(Leave empty to keep current)'}</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleMainImageChange}
                                    />
                                    {previewMainImage && (
                                        <div className="image-preview">
                                            <img src={previewMainImage} alt="Preview" />
                                        </div>
                                    )}
                                </div>

                                {/* Gallery Images */}
                                <div className="form-group">
                                    <label>Gallery Images (Multiple - No Limit)</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleGalleryImagesChange}
                                    />
                                    <small style={{ color: '#666', fontSize: '13px', marginTop: '5px', display: 'block' }}>
                                        ✅ You can select <strong>unlimited images</strong> (Ctrl/Cmd + Click to select multiple)
                                    </small>
                                    
                                    {/* Preview Selected Files */}
                                    {galleryImages.length > 0 && (
                                        <div style={{ 
                                            marginTop: '15px', 
                                            padding: '10px', 
                                            background: '#f5f5f5', 
                                            borderRadius: '8px' 
                                        }}>
                                            <strong>📸 {galleryImages.length} images selected:</strong>
                                            <ul style={{ 
                                                marginTop: '8px', 
                                                paddingLeft: '20px', 
                                                fontSize: '13px',
                                                maxHeight: '120px',
                                                overflowY: 'auto'
                                            }}>
                                                {galleryImages.map((file, index) => (
                                                    <li key={index}>{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                {/* ← GANTI BAGIAN MAP INPUT */}
                                <div className="form-group">
                                    <label>Google Maps Embed URL (Optional)</label>
                                    <textarea
                                        name="map_embed_url"
                                        value={formData.map_embed_url}
                                        onChange={handleInputChange}
                                        placeholder="Paste Google Maps embed URL here..."
                                        rows="3"
                                        style={{ 
                                            fontFamily: 'monospace', 
                                            fontSize: '12px',
                                            resize: 'vertical'
                                        }}
                                    />
                                    <small style={{ display: 'block', marginTop: '5px', color: '#666' }}>
                                        Leave empty to use default location
                                    </small>
                                </div>

                                {/* Info Box - Cara Dapat Embed URL */}
                                <div style={{
                                    background: '#e3f2fd',
                                    border: '1px solid #2196F3',
                                    borderRadius: '8px',
                                    padding: '15px',
                                    marginBottom: '20px'
                                }}>
                                    <strong>📍 Cara mendapatkan Google Maps Embed URL:</strong>
                                    <ol style={{ margin: '10px 0 0 20px', fontSize: '13px', lineHeight: '1.8' }}>
                                        <li>Buka <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer" style={{ color: '#2196F3', fontWeight: '600' }}>Google Maps</a></li>
                                        <li>Cari lokasi properti</li>
                                        <li>Klik tombol <strong>"Share"</strong> atau <strong>"Bagikan"</strong></li>
                                        <li>Pilih tab <strong>"Embed a map"</strong></li>
                                        <li>Klik <strong>"COPY HTML"</strong></li>
                                        <li>Paste ke form di atas</li>
                                    </ol>
                                    <div style={{ 
                                        marginTop: '10px', 
                                        padding: '10px', 
                                        background: '#fff', 
                                        borderRadius: '5px',
                                        fontSize: '11px',
                                        fontFamily: 'monospace',
                                        color: '#666',
                                        border: '1px solid #ddd'
                                    }}>
                                        Contoh hasil copy:<br/>
                                        <code>&lt;iframe src="https://www.google.com/maps/embed?pb=!1m18..."&gt;&lt;/iframe&gt;</code>
                                    </div>
                                </div>

                                <div className="form-actions">
                                    <button type="button" className="btn-cancel" onClick={closeModal}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn-submit">
                                        {editMode ? 'Update' : 'Create'} Property
                                    </button>
                                </div>
                            </form>
                        ) : activeSection === 'awards' ? (
                            <form onSubmit={handleAwardSubmit}>
                                <div className="form-group">
                                    <label>Title *</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={awardFormData.title}
                                        onChange={handleAwardInputChange}
                                        placeholder="Enter award title"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Year</label>
                                    <input
                                        type="text"
                                        name="year"
                                        value={awardFormData.year}
                                        onChange={handleAwardInputChange}
                                        placeholder="2024"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Display Order</label>
                                    <input
                                        type="number"
                                        name="display_order"
                                        value={awardFormData.display_order}
                                        onChange={handleAwardInputChange}
                                        placeholder="0"
                                    />
                                    <small>Lower number = displayed first</small>
                                </div>

                                <div className="form-group">
                                    <label>Award Image *</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAwardImageChange}
                                        required
                                    />
                                </div>

                                <div className="form-actions">
                                    <button type="button" className="btn-cancel" onClick={closeModal}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn-submit">
                                        Create Award
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <form onSubmit={handleRecapSubmit}>
                                <div className="form-group">
                                    <label>Company ID *</label>
                                    <input
                                        type="text"
                                        name="company_id"
                                        value={isCreatingRecap ? recapFormData.company_id : editingRecap?.company_id || ''}
                                        onChange={isCreatingRecap ? handleRecapFormChange : undefined}
                                        placeholder="fpg"
                                        disabled={!isCreatingRecap}
                                        style={!isCreatingRecap ? { background: '#f5f5f5', cursor: 'not-allowed' } : {}}
                                        required
                                    />
                                    <small>Contoh: fpg, fpl, bid, brp</small>
                                </div>

                                <div className="form-group">
                                    <label>Company Name *</label>
                                    <input
                                        type="text"
                                        name="company_name"
                                        value={isCreatingRecap ? recapFormData.company_name : editingRecap?.company_name || ''}
                                        onChange={isCreatingRecap ? handleRecapFormChange : undefined}
                                        placeholder="PT Fachri Property Group"
                                        disabled={!isCreatingRecap}
                                        style={!isCreatingRecap ? { background: '#f5f5f5', cursor: 'not-allowed' } : {}}
                                        required
                                    />
                                </div>

                                {/* ← TAMBAH INPUT DISPLAY ORDER */}
                                <div className="form-group">
                                    <label>Display Order *</label>
                                    <input
                                        type="number"
                                        name="display_order"
                                        value={isCreatingRecap ? recapFormData.display_order : editingRecap?.display_order || 0}
                                        onChange={isCreatingRecap ? handleRecapFormChange : handleRecapInputChange}
                                        placeholder="1"
                                        min="0"
                                        required
                                    />
                                    <small>Angka lebih kecil = muncul lebih dulu di dropdown</small>
                                </div>

                                <div className="form-group">
                                    <label>Total Komplek</label>
                                    <input
                                        type="number"
                                        name="total_komplek"
                                        value={isCreatingRecap ? recapFormData.total_komplek : editingRecap?.total_komplek || 0}
                                        onChange={isCreatingRecap ? handleRecapFormChange : handleRecapInputChange}
                                        min="0"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Total Rumah</label>
                                    <input
                                        type="number"
                                        name="total_rumah"
                                        value={isCreatingRecap ? recapFormData.total_rumah : editingRecap?.total_rumah || 0}
                                        onChange={isCreatingRecap ? handleRecapFormChange : handleRecapInputChange}
                                        min="0"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Total Terjual</label>
                                    <input
                                        type="number"
                                        name="total_terjual"
                                        value={isCreatingRecap ? recapFormData.total_terjual : editingRecap?.total_terjual || 0}
                                        onChange={isCreatingRecap ? handleRecapFormChange : handleRecapInputChange}
                                        min="0"
                                        required
                                    />
                                </div>

                                <div className="form-actions">
                                    <button type="button" className="btn-cancel" onClick={closeModal}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn-submit">
                                        {isCreatingRecap ? 'Create' : 'Update'} Recap
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;