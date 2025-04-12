import React, { useEffect, useState } from 'react';
import Artists from './Artists';
import Gallery from './Gallery';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { baseUrl } from '../config/config';

const Home = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [artworks, setArtworks] = useState([]);
    const [artists, setArtist] = useState([]);

    useEffect(() => {
        const fetchWorksAndArtists = async () => {
            try {
                setIsLoading(true);
                Swal.showLoading();
                const res = await fetch(`${baseUrl}/data/get-all-works.json`);
                const res2 = await fetch(`${baseUrl}/data/get-all-artists.json`);
                if (!res.ok) {
                    throw new Error("Works not found");
                }
                if (!res2.ok) {
                    throw new Error("Artists not found");
                }
                const data = await res.json();
                setArtworks(data);
                const data2 = await res2.json();
                // 排序藝術家數據，根據追蹤者數量從多到少
                const sortedArtists = data2.sort((a, b) => b.followers.length - a.followers.length);
                setArtist(sortedArtists);
                console.log(artists);
            } catch (error) {
                console.error('Error fetching works:', error);
            } finally {
                setIsLoading(false);
                Swal.close();
            }
        }
        fetchWorksAndArtists();
    }, [])


    return (
        <div className="container">
            <div classNameName="row">
                <div className="col-lg-12">
                    <div className="page-content">

                        {/* ***** Banner Start ***** */}
                        <div className="main-banner">
                            <div className="row">
                                <div className="col-lg-7">
                                    <div className="header-text">
                                        <h6>Welcome To Artisan Cosmos</h6>
                                        <h4><em>Discover</em> Amazing Artworks And <br></br>Talented Artists</h4>
                                        <Link to="/browse" className="main-button">
                                            Browse Now
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* ***** Banner End ***** */}

                        {/* ***** Gallery Start ***** */}
                        <div className="general-container">
                            <div className="heading-section">
                                <h4><em>Latest</em> Artworks</h4>
                            </div>
                            <Gallery artworks={artworks.length > 8 ? (artworks.slice(artworks.length - 8, artworks.length).reverse()) : (artworks).reverse()} />
                        </div>
                        {/* ***** Gallery End ***** */}

                        {/* ***** Artists Start ***** */}
                        <div className="general-container">
                            <div className="heading-section">
                                <h4><em>Recommended</em> Artists</h4>
                            </div>
                            {!isLoading && (<Artists artists={artists.length > 8 ? (artists.slice(0, 8)) : (artists)} />)}
                            <div className="col-lg-12 d-flex justify-content-center">
                                <Link to="/artists" className="main-button">
                                    Discover More Artists
                                </Link>
                            </div>
                        </div>
                        {/* ***** Artists End ***** */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
