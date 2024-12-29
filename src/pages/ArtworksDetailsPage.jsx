import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ArtworkDetails from '../components/ArtworkDetails';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const ArtworkDetailsPage = () => {
    const [artworks, setArtworks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchArtworks = async () => {
            try {
                setIsLoading(true);
                Swal.showLoading();
                const res = await fetch("http://localhost:8080/api/works/get-all-works");
                const data = await res.json();
                setArtworks(data);
            } catch (error) {
                console.error('Error fetching artworks:', error);
            } finally {
                setIsLoading(false);
                Swal.close();
            }
        };
    
        fetchArtworks();
    }, []);

    let { id } = useParams();
    let artwork = artworks.find(a => a.id == id);
    return (
        <div>
            <Navbar />
            {
                isLoading ? (<></>) : (artwork ? (<ArtworkDetails artwork={artwork} />) : (
                    <div className="container">
                        <div className="page-content d-flex justify-content-center"><h2>Oops! Artwork not found :(</h2></div>
                    </div>
                ))
            }
            <Footer />
        </div>
    );
};

export default ArtworkDetailsPage;