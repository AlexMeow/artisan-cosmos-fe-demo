import React, { useState, useEffect } from "react";
import Gallery from "./Gallery";
import { faUserPlus, faUpload, faPencil, faGear, faTimes, faUserMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import Editor from 'react-simple-wysiwyg';

const ArtistProfile = ({ artist }) => {
    const [artworks, setArtworks] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [currentArtist, setCurrentArtist] = useState(artist);
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [bioContent, setBioContent] = useState("");

    // Triggered when props 'artist' changes.
    useEffect(() => {
        setCurrentArtist(artist);
        setBioContent(artist.bio);
    }, [artist]);

    useEffect(() => {
        // 解析JWT並獲取使用者ID
        const token = localStorage.getItem("jwt");
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setCurrentUserId(decodedToken.id);
            } catch (error) {
                console.error("Invalid token:", error);
            }
        }
    }, []);

    useEffect(() => {
        const fetchArtworks = async () => {
            if (artist.id) {
                try {
                    Swal.showLoading();
                    const res = await fetch(`http://localhost:8080/api/works/author/${artist.id}`);
                    const data = await res.json();
                    setArtworks(data);
                } catch (error) {
                    console.error('Error fetching artworks:', error);
                } finally {
                    Swal.close();
                }
            }
        };

        fetchArtworks();
    }, [artist.id]);

    useEffect(() => {
        const checkFollowing = async () => {
            if (currentUserId && artist.id) {
                try {
                    const res = await fetch(`http://localhost:8080/api/users/${currentUserId}/following/${artist.id}`);
                    const data = await res.json();
                    setIsFollowing(data.isFollowing);
                } catch (error) {
                    console.error('Error checking following status:', error);
                }
            }
        };

        checkFollowing();
    }, [currentUserId, artist.id]);

    const handleFollowToggle = async () => {
        const token = localStorage.getItem("jwt");
        if (!token) {
            Swal.fire("Error", "Please log in first!", "error");
            return;
        }

        try {
            const res = await fetch(`http://localhost:8080/api/users/${currentUserId}/follow/${artist.id}`, {
                method: isFollowing ? 'DELETE' : 'POST',
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (res.ok) {
                setIsFollowing(!isFollowing);
                Swal.fire("Success", `You have ${isFollowing ? 'unfollowed' : 'followed'} ${artist.name}`, "success");
            } else {
                throw new Error("Failed to update following status");
            }
        } catch (error) {
            console.error('Error updating following status:', error);
            Swal.fire("Error", "Failed to update following status", "error");
        }
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];

        // 檢查檔案類型是否為圖片
        if (!file.type.startsWith('image/')) {
            Swal.fire('Error', 'Invalid file type. Only image files are allowed.', 'error');
            return;
        }

        if (file) {
            // Check if the file is larger than 2MB.
            if (file.size > 2097152) {
                Swal.fire('Error', 'File size exceeds 2MB.', 'error');
                return;
            }

            // Convert image to base64.
            const reader = new FileReader();
            reader.readAsDataURL(file);
            // onload 會在成功讀取文件時觸發
            reader.onload = async () => {
                const base64Image = reader.result;

                try {
                    const token = localStorage.getItem("jwt");
                    const res = await fetch(`http://localhost:8080/api/users/update/${currentUserId}/avatar`, {
                        method: 'POST',
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ avatar: base64Image })
                    });
                    if (!res.ok) {
                        throw new Error("Failed to upload avatar");
                    }
                    const data = await res.json();
                    Swal.fire('Success', 'Avatar updated successfully', 'success');
                    // Update  current shown avatar
                    setCurrentArtist({
                        ...currentArtist,
                        avatarUrl: base64Image
                    })
                } catch (error) {
                    console.error('Error uploading avatar:', error);
                    Swal.fire('Error', 'Failed to upload avatar', 'error');
                }
            };
            reader.onerror = error => {
                console.error('Error converting file:', error);
                Swal.fire('Error', 'Failed to read the file', 'error');
            };
        }
    };

    const handleBioEditToggle = () => {
        setIsEditingBio(!isEditingBio);
        if (!isEditingBio) {
            // 如果按下Cancel，還原bio內文
            // setBioContent(artist.bio);
        }
    };

    const handleBioSave = async () => {
        try {
            const token = localStorage.getItem("jwt");
            const res = await fetch(`http://localhost:8080/api/users/update/${currentUserId}/bio`, {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ bio: bioContent })
            });
            if (!res.ok) {
                throw new Error("Failed to update bio");
            }
            const data = await res.json();
            Swal.fire('Success', 'Bio updated successfully', 'success');
            setIsEditingBio(false);
        } catch (error) {
            console.error('Error updating bio:', error);
            Swal.fire('Error', 'Failed to update bio', 'error');
        }
    };

    const handleEditorChange = (e) => {
        setBioContent(e.target.value);
        setCurrentArtist({
            ...currentArtist,
            bio: e.target.value
        })
    };

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-3 d-flex justify-content-center">
                    {
                        currentUserId === currentArtist.id ? (
                            <div className="user-avatar-container">
                                <img
                                    src={currentArtist.avatarUrl}
                                    className="user-avatar rounded-circle"
                                    alt="Artist Photo"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => document.getElementById('avatarUpload').click()}
                                />
                                <div className="upload-overlay" onClick={() => document.getElementById('avatarUpload').click()}>
                                    Upload Avatar
                                </div>
                                <input
                                    type="file"
                                    id="avatarUpload"
                                    style={{ display: 'none' }}
                                    onChange={handleAvatarUpload}
                                    accept="image/*"
                                />
                            </div>
                        ) : (
                            <img
                                src={currentArtist.avatarUrl}
                                className="user-avatar rounded-circle"
                                alt="Artist Photo"
                            />
                        )
                    }
                </div>
                <div className="col-md-9">
                    <h1 className="mb-2">{currentArtist.name}</h1>
                    <h5 className="mb-3">{currentArtist.jobTitle}</h5>
                    {
                        isEditingBio ? (
                            <div>
                                <div className="editor">
                                    <Editor
                                        onChange={handleEditorChange}
                                        value={bioContent}
                                    />
                                </div>
                                <button className="btn btn-danger mt-3" onClick={handleBioEditToggle}>
                                    <FontAwesomeIcon icon={faTimes} /> Cancel
                                </button>
                            </div>
                        ) : (
                            <div className="wysiwyg-content" dangerouslySetInnerHTML={{ __html: currentArtist.bio }} />
                        )
                    }
                    {
                        currentUserId === currentArtist.id ? (
                            <div className="d-flex align-items-center mt-3 button-group">
                                <button className="btn btn-outline-primary main-button" onClick={isEditingBio ? handleBioSave : handleBioEditToggle}>
                                    <FontAwesomeIcon icon={faPencil} /> {isEditingBio ? 'Save Bio' : 'Edit Bio'}
                                </button>
                                <Link to={"/settings"}>
                                    <button className="btn btn-outline-primary main-button ms-4">
                                        <FontAwesomeIcon icon={faGear} /> Settings
                                    </button>
                                </Link>
                            </div>
                        ) : (
                            <div className="d-flex align-items-center mt-3">
                                <button className="btn btn-outline-primary main-button" onClick={handleFollowToggle}>
                                    <FontAwesomeIcon icon={isFollowing ? faUserMinus : faUserPlus} /> {isFollowing ? 'Unfollow' : 'Follow'}
                                </button>
                                {/* TBD */}
                                <img className="btn" src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style={{ height: "60px", width: "217px", marginLeft: "1rem" }} />
                            </div>
                        )
                    }
                </div>
            </div>
            <hr className="my-4" />
            <h2>Artwork Gallery</h2>
            {
                currentUserId === currentArtist.id ?
                    (<Link to={"/upload"}>
                        <button className="btn btn-outline-primary main-button mt-4 mb-4">
                            <FontAwesomeIcon icon={faUpload} /> Upload New Artwork
                        </button>
                    </Link>) :
                    (<></>)
            }
            {
                artworks ? <Gallery artworks={artworks} /> : <></>
            }
        </div>
    );
}

export default ArtistProfile;