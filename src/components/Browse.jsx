import React, { useEffect, useState } from "react";
import Gallery from "./Gallery";
import { faUserPlus, faUpload, faPencil, faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Swal from "sweetalert2";
import { baseUrl } from '../config/config';

const Browse = ({ selectedTag }) => {
    const [artworks, setArtworks] = useState([]);

    useEffect(() => {
        console.log(selectedTag);
        const fetchArtworks = async () => {
            try {
                let url = `${baseUrl}/data/get-all-works.json`;
                if (selectedTag) {
                    url += `?tag=${selectedTag}`;
                  }
                Swal.showLoading();
                const res = await fetch(url);
                if (!res.ok) {
                    throw new Error("Works not found");
                }
                const data = await res.json();
                setArtworks(data);
            } catch (error) {
                console.error('Error fetching works:', error);
            } finally {
                Swal.close();
            }
        }
        fetchArtworks();
    }, [selectedTag])

    return (
        <div className="container mt-5">
            <hr />
            <h2>Artwork Gallery</h2>
            <Gallery artworks={artworks} />
        </div>
    );
}

export default Browse;