import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ArtistProfile from '../components/ArtistProfile';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { baseUrl } from '../config/config';

const ArtistProfilePage = () => {
    const [artist, setArtist] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    let { id } = useParams();

    useEffect(() => {
        const fetchArtist = async () => {
            try {
                setIsLoading(true);
                Swal.showLoading();
                const res = await fetch(`${baseUrl}/data/artist_${id}.json`, {
                    cache: "no-store"
                });
                if (!res.ok) {
                    throw new Error("User not found");
                }
                const data = await res.json();
                setArtist(data);
            } catch (error) {
                console.error('Error fetching artist:', error);
            } finally {
                setIsLoading(false);
                console.log(artist);
            }
        };

        fetchArtist();
    }, []);

    return (
        <div>
            <Navbar />
            {
                isLoading ? (<></>) : (artist ? (<ArtistProfile artist={ artist } />) : (
                    <div className="container">
                        <div className="page-content d-flex justify-content-center"><h2>Oops! User not found :(</h2></div>
                    </div>
                ))
            }
            <Footer />
        </div>
    );
};

export default ArtistProfilePage;