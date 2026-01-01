import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/AdminDashboard.css';

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
        type: '',
        description: '',
        land_area: '',
        development_type: '',
        city_distance: '',
        airport_distance: '',
        welcome_text: '',
        about_text: '',
        video_url: '',
        features: '',
        amenities: ''
    });
    const [mainImage, setMainImage] = useState(null);
    const [galleryImages, setGalleryImages] = useState([]);
    const [previewMainImage, setPreviewMainImage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        checkAuth();
        fetchProperties();
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
            if (editMode && currentProperty) {
                formDataToSend.append('id', currentProperty.id);
                await axios.post(
                    `${API_URL}/property-update.php`,
                    formDataToSend,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                alert('Property updated successfully!');
            } else {
                await axios.post(
                    `${API_URL}/property-create.php`,
                    formDataToSend,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                alert('Property created successfully!');
            }
            
            closeModal();
            fetchProperties();
        } catch (error) {
            console.error('Error:', error);
            alert(error.response?.data?.message || 'Failed to save property');
        }
    };

    const handleEdit = (property) => {
        setEditMode(true);
        setCurrentProperty(property);
        setFormData({
            title: property.title,
            location: property.location,
            type: property.type,
            description: property.description || '',
            land_area: property.land_area || '',
            development_type: property.development_type || '',
            city_distance: property.city_distance || '',
            airport_distance: property.airport_distance || '',
            welcome_text: property.welcome_text || '',
            about_text: property.about_text || '',
            video_url: property.video_url || '',
            features: property.features || '',
            amenities: property.amenities || ''
        });
        setPreviewMainImage(property.image || property.main_image);
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

    const openModal = () => {
        setShowModal(true);
        setEditMode(false);
        setCurrentProperty(null);
        setFormData({
            title: '',
            location: '',
            type: '',
            description: '',
            land_area: '',
            development_type: '',
            city_distance: '',
            airport_distance: '',
            welcome_text: '',
            about_text: '',
            video_url: '',
            features: '',
            amenities: ''
        });
        setMainImage(null);
        setGalleryImages([]);
        setPreviewMainImage(null);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditMode(false);
        setCurrentProperty(null);
        setFormData({
            title: '',
            location: '',
            type: '',
            description: '',
            land_area: '',
            development_type: '',
            city_distance: '',
            airport_distance: '',
            welcome_text: '',
            about_text: '',
            video_url: '',
            features: '',
            amenities: ''
        });
        setMainImage(null);
        setGalleryImages([]);
        setPreviewMainImage(null);
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
            <header className="admin-header">
                <div className="admin-header-content">
                    <h1>Admin Dashboard</h1>
                    <p className="admin-subtitle">PT. Fajar Perkasa Group - Property Management</p>
                </div>
                <div className="admin-actions">
                    <button className="btn-add" onClick={openModal}>
                        <span>+</span> Add New Property
                    </button>
                    <button className="btn-logout" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </header>

            <div className="dashboard-stats">
                <div className="stat-card">
                    <h3>{properties.length}</h3>
                    <p>Total Properties</p>
                </div>
                <div className="stat-card">
                    <h3>{properties.filter(p => p.type === 'Residential').length}</h3>
                    <p>Residential</p>
                </div>
                <div className="stat-card">
                    <h3>{properties.filter(p => p.type === 'Commercial').length}</h3>
                    <p>Commercial</p>
                </div>
                <div className="stat-card">
                    <h3>{properties.filter(p => p.type === 'Industrial').length}</h3>
                    <p>Industrial</p>
                </div>
            </div>

            <div className="properties-table-container">
                <h2>All Properties</h2>
                {properties.length > 0 ? (
                    <table className="properties-table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Title</th>
                                <th>Location</th>
                                <th>Type</th>
                                <th>Actions</th>
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

            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editMode ? 'Edit Property' : 'Add New Property'}</h2>
                            <button className="close-btn" onClick={closeModal}>&times;</button>
                        </div>
                        
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
                                        <option value="Residential">Residential</option>
                                        <option value="Commercial">Commercial</option>
                                        <option value="Industrial">Industrial</option>
                                        <option value="Land">Land</option>
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
                                    rows="3"
                                />
                            </div>

                            {/* Row 2: Land Area & Development Type */}
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Land Area</label>
                                    <input
                                        type="text"
                                        name="land_area"
                                        value={formData.land_area}
                                        onChange={handleInputChange}
                                        placeholder="2.000 hektar"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Development Type</label>
                                    <input
                                        type="text"
                                        name="development_type"
                                        value={formData.development_type}
                                        onChange={handleInputChange}
                                        placeholder="Pengembangan Terintegrasi"
                                    />
                                </div>
                            </div>

                            {/* Row 3: City Distance & Airport Distance */}
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Distance to City</label>
                                    <input
                                        type="text"
                                        name="city_distance"
                                        value={formData.city_distance}
                                        onChange={handleInputChange}
                                        placeholder="15 km dari Pusat Kota Surabaya"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Distance to Airport</label>
                                    <input
                                        type="text"
                                        name="airport_distance"
                                        value={formData.airport_distance}
                                        onChange={handleInputChange}
                                        placeholder="20 km dari Bandara Internasional Juanda"
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Enter property description"
                                    rows="4"
                                />
                            </div>

                            {/* Video URL */}
                            <div className="form-group">
                                <label>Video URL (YouTube/Vimeo)</label>
                                <input
                                    type="text"
                                    name="video_url"
                                    value={formData.video_url}
                                    onChange={handleInputChange}
                                    placeholder="https://youtube.com/..."
                                />
                            </div>

                            {/* Features */}
                            <div className="form-group">
                                <label>Features (comma separated)</label>
                                <textarea
                                    name="features"
                                    value={formData.features}
                                    onChange={handleInputChange}
                                    placeholder="Security 24/7, Swimming Pool, Gym"
                                    rows="2"
                                />
                            </div>

                            {/* Amenities */}
                            <div className="form-group">
                                <label>Amenities (comma separated)</label>
                                <textarea
                                    name="amenities"
                                    value={formData.amenities}
                                    onChange={handleInputChange}
                                    placeholder="Park, Playground, Shopping Center"
                                    rows="2"
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
                                <label>Gallery Images (Multiple)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleGalleryImagesChange}
                                />
                                <small>You can select multiple images</small>
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
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;