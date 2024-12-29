import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Artists from '../components/Artists';
import Swal from 'sweetalert2';

const ArtistsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [artists, setArtist] = useState(null);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        setIsLoading(true);
        Swal.showLoading();
        const res = await fetch("http://localhost:8080/api/artists/get-all-artists");
        const data = await res.json();
        setArtist(data);
      } catch (error) {
        console.error('Error fetching artworks:', error);
      } finally {
        setIsLoading(false);
        Swal.close();
      }
    };

    fetchArtists();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <div className="heading-section">
          <h4><em>All</em> Artists</h4>
        </div>
        {!isLoading && (artists ? <Artists artists={artists} /> : <></>)}
        <div className="col-lg-12 d-flex justify-content-center">
          <a to="/artists" className="main-button">
            Load more
          </a>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ArtistsPage;