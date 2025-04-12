import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { baseUrl } from '../config/config';

const Gallery = ({ artworks }) => {
    const [visibleArtworks, setVisibleArtworks] = useState(15);

    const loadMoreArtworks = () => {
        setVisibleArtworks((prevVisibleArtworks) => prevVisibleArtworks + 15);
    };

    return (
        <div>
            <div className="gallery">
                {artworks.slice(0, visibleArtworks).map((artwork) => (
                    <div key={artwork.id} className="gallery-item">
                        <Link to={`/artwork/${artwork.id}`}>
                            <img src={baseUrl + artwork.imgUrls[0]} alt={artwork.name} />
                            <div className="overlay">
                                <div className="text">
                                    <h4>{artwork.name}</h4>
                                    <p><img className="author-avatar" src={baseUrl + artwork.artist.avatarUrl}></img> {artwork.artist.name}</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
            {visibleArtworks < artworks.length && (
                <div className="text-center">
                    <button onClick={loadMoreArtworks} className="btn main-button mt-3">Load More</button>
                </div>
            )}
        </div>
    );
};

export default Gallery;