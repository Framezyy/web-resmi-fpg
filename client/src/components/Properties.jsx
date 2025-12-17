import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Properties = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Scroll to top when component mounts
        window.scrollTo(0, 0);

        const fetchProperties = async () => {
            try {
                const response = await axios.get('/api/properties.php');
                setProperties(response.data);
            } catch (err) {
                setError('Failed to fetch properties');
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>Properties</h1>
            <ul>
                {properties.map(property => (
                    <li key={property.id}>
                        <h2>{property.title}</h2>
                        <p>{property.description}</p>
                        <p>Price: ${property.price}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Properties;