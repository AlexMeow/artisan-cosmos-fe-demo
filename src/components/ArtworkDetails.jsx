import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faStar, faPencil, faSave, faTimes, faTrash, faPlus, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { Carousel } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import Editor from 'react-simple-wysiwyg';

const ArtworkDetails = ({ artwork }) => {
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [editedArtwork, setEditedArtwork] = useState({ ...artwork });
    const [currentUserId, setCurrentUserId] = useState(null);
    const [currentArtwork, setCurrentArtwork] = useState(artwork);

    // 驗證jwt + 取得目前登入用者的id
    useEffect(() => {
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

    const handleEditToggle = () => {
        setIsEditing(!isEditing);

        // 如果按下Cancel，先將editedArtwork還原
        if (!isEditing) {
            setEditedArtwork(currentArtwork);
        }
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem("jwt");
            const res = await fetch(`http://localhost:8080/api/works/update/${artwork.id}`, {
                method: 'PUT',
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(editedArtwork)
            });
            if (!res.ok) {
                throw new Error("Failed to update artwork");
            }
            const data = await res.json();
            Swal.fire('Success', 'Artwork updated successfully', 'success');
            console.log(data);
            setEditedArtwork(data);
            setCurrentArtwork(data);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating artwork:', error);
            Swal.fire('Error', 'Failed to update artwork', 'error');
        }
    };

    const handleImageChange = (index, e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                Swal.fire('Error', 'Invalid file type. Only image files are allowed.', 'error');
                return;
            } else if (file.size > 20971520) {
                Swal.fire('Error', 'File size exceeds 20MB.', 'error');
                return;
            }

            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const updatedImgUrls = [...editedArtwork.imgUrls];
                updatedImgUrls[index] = reader.result;
                setEditedArtwork({
                    ...editedArtwork,
                    imgUrls: updatedImgUrls
                });
            };
        }
    };

    const handleAddImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                Swal.fire('Error', 'Invalid file type. Only image files are allowed.', 'error');
                return;
            } else if (file.size > 20971520) {
                Swal.fire('Error', 'File size exceeds 20MB.', 'error');
                return;
            }
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                setEditedArtwork({
                    ...editedArtwork,
                    imgUrls: [...editedArtwork.imgUrls, reader.result]
                });
            };
        }
    };

    const handleRemoveImage = (index) => {
        const updatedImgUrls = editedArtwork.imgUrls.filter((_, i) => i !== index);
        setEditedArtwork({
            ...editedArtwork,
            imgUrls: updatedImgUrls
        });
    };

    const handleTagsChange = (index, e) => {
        // 解構賦值取得目前的Tags陣列
        const updatedTags = [...editedArtwork.tags];
        updatedTags[index] = e.target.value;
        setEditedArtwork({
            ...editedArtwork,
            tags: updatedTags
        });
    };

    const handleAddTag = () => {
        setEditedArtwork({
            ...editedArtwork,
            tags: [...editedArtwork.tags, ""]
        });
    };

    /*
        handleRemoveTag():
        filter 方法的callback function `( _, i ) => i !== index` 使用了兩個參數：
            1. _：這是元素值，但在這裡並不需要使用元素值，因此使用了下劃線 `_` 作為變數名，表示我們忽略這個參數。
            2. i：這是元素索引，用來判斷當前元素的索引是否等於我們想要移除的索引 index。
            
        具體來說，這段code的意思是：
            * 使用 filter 方法迭代 editedArtwork.tags 陣列中的每個元素。
            * 忽略元素值，只關心元素索引 i。
            * 如果元素索引 i 不等於要移除的索引 index，則保留該元素（i !== index 為 true）。
            * 如果元素索引 i 等於要移除的索引 index，則不保留該元素（i !== index 為 false）。

        最終，這個 filter 方法會返回一個新的陣列，該陣列包含所有索引不等於 index 的元素。這樣就實現了從標籤列表中移除指定索引的標籤。
    */
    const handleRemoveTag = (index) => {
        const updatedTags = editedArtwork.tags.filter((_, i) => i !== index);
        setEditedArtwork({
            ...editedArtwork,
            tags: updatedTags
        });
    };

    const handleDelete = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const token = localStorage.getItem("jwt");
                    const res = await fetch(`http://localhost:8080/api/works/delete/${artwork.id}`, {
                        method: 'DELETE',
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    });
                    if (!res.ok) {
                        throw new Error("Failed to delete artwork");
                    }
                    Swal.fire('Success', 'Artwork deleted successfully', 'success');
                    // 跳轉到個人頁面
                    setTimeout(() => navigate(`/artist/${currentUserId}`), 2000);
                } catch (error) {
                    console.error('Error deleting artwork:', error);
                    Swal.fire('Error', 'Failed to delete artwork', 'error');
                }
            }
        });

    };

    const handleImageSort = (index, direction) => {
        const updatedImgUrls = [...editedArtwork.imgUrls];
        if (direction === 'up' && index > 0) {
            [updatedImgUrls[index], updatedImgUrls[index - 1]] = [updatedImgUrls[index - 1], updatedImgUrls[index]];
        } else if (direction === 'down' && index < updatedImgUrls.length - 1) {
            [updatedImgUrls[index], updatedImgUrls[index + 1]] = [updatedImgUrls[index + 1], updatedImgUrls[index]];
        }
        setEditedArtwork({
            ...editedArtwork,
            imgUrls: updatedImgUrls
        });
    };


    return (
        <div className="container my-5">
            <div className="row">
                <div className="col-md-7">
                    {isEditing ? (
                        <div>
                            {editedArtwork.imgUrls.map((url, index) => (
                                <div key={index} className="mb-5">
                                    <input
                                        type="file"
                                        id={`imageUpload${index}`}
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        onChange={(e) => handleImageChange(index, e)}
                                    />
                                    <div className="d-flex justify-content-between mt-2 w-75">
                                        <label htmlFor={`imageUpload${index}`} className="btn main-button">
                                            Change Image
                                        </label>
                                        <button className="btn btn-secondary general-button" onClick={() => handleImageSort(index, 'up')}>
                                            <FontAwesomeIcon icon={faArrowUp} />
                                        </button>
                                        <button className="btn btn-secondary general-button" onClick={() => handleImageSort(index, 'down')}>
                                            <FontAwesomeIcon icon={faArrowDown} />
                                        </button>
                                        {
                                            editedArtwork.imgUrls.length === 1 ? <></> : <button className="btn btn-danger general-button" onClick={() => handleRemoveImage(index)}>
                                                <FontAwesomeIcon icon={faTrash} /> Remove
                                            </button>
                                        }

                                    </div>
                                    <img
                                        className="d-block w-100 mt-2"
                                        src={url}
                                        alt={`${editedArtwork.title} - ${index + 1}`}
                                    />
                                </div>
                            ))}
                            <div className="mb-3">
                                <input
                                    type="file"
                                    id="addImage"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={handleAddImage}
                                />
                                <label htmlFor="addImage" className="btn btn-success general-button">
                                    <FontAwesomeIcon icon={faPlus} /> Add New Image
                                </label>
                            </div>
                        </div>
                    ) : (
                        currentArtwork.imgUrls.length > 1 ? (
                            <Carousel className="mb-3">
                                {currentArtwork.imgUrls.map((url, index) => (
                                    <Carousel.Item key={index}>
                                        <img
                                            className="d-block w-100"
                                            src={url}
                                            alt={`${currentArtwork.name} - ${index + 1}`}
                                        />
                                    </Carousel.Item>
                                ))}
                            </Carousel>
                        ) : (
                            <img
                                className="d-block w-100 mb-3"
                                src={currentArtwork.imgUrls[0]}
                                alt={`${currentArtwork.name}`}
                            />
                        )
                    )}
                </div>
                <div className="col-md-1"></div>
                <div className="col-md-4">
                    {isEditing ? (
                        <div className="mb-3">
                            <label>TITLE:</label>
                            <input
                                type="text"
                                className="form-control"
                                value={editedArtwork.name}
                                onChange={(e) => setEditedArtwork({ ...editedArtwork, name: e.target.value })}
                            />
                        </div>
                    ) : (
                        <div className="mb-3">
                            <h2>{currentArtwork.name}</h2>
                            <small>{new Date(artwork.createdDate).toLocaleString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "numeric",
                                minute: "numeric",
                                second: "numeric"
                            })}</small>
                        </div>
                    )}

                    <div className="row">
                        <div className="col-md-3">
                            <img className="img-fluid artist-image" src={currentArtwork.artist.avatarUrl}></img>
                        </div>
                        <div className="col-md-9">
                            <p className="text-muted">by <a href={`/artist/${currentArtwork.artist.id}`}>{currentArtwork.artist.name}</a></p>
                            <p>{currentArtwork.artist.jobTitle}</p>
                        </div>
                    </div>

                    {isEditing ? (
                        <div className="editor">
                            <Editor
                                onChange={e => setEditedArtwork({ ...editedArtwork, description: e.target.value })}
                                value={editedArtwork.description}
                            />
                        </div>
                    ) : (
                        <div className="wysiwyg-content mt-3 mb-3" dangerouslySetInnerHTML={{ __html: currentArtwork.description }} />
                    )}

                    {isEditing ? (
                        <div className="artwork-details-tags mt-3 mb-3">
                            <label>TAGS:</label>
                            {editedArtwork.tags.map((tag, index) => (
                                <div key={index} className="mb-2">
                                    <input
                                        type="text"
                                        className="form-control d-inline-block"
                                        value={tag}
                                        onChange={(e) => handleTagsChange(index, e)}
                                        style={{ width: '80%', marginRight: '10px' }}
                                    />
                                    <button className="btn btn-danger d-inline-block" onClick={() => handleRemoveTag(index)}>
                                        <FontAwesomeIcon icon={faTimes} />
                                    </button>
                                </div>
                            ))}
                            <button className="btn btn-primary mb-3 main-button" onClick={handleAddTag}>
                                Add Tag
                            </button>
                        </div>
                    ) : (
                        <p className="artwork-details-tags mt-3 mb-3">TAGS: {currentArtwork.tags.map((tag, index) => (
                            <span key={index}>
                                {tag}{index < currentArtwork.tags.length - 1 ? ', ' : ''}
                            </span>
                        ))}</p>
                    )}

                    {currentUserId === currentArtwork.artist.id ? (
                        isEditing ? (
                            <div className="d-flex justify-content-between align-items-center">
                                <button className="btn btn-primary main-button" onClick={handleSave}>
                                    <FontAwesomeIcon icon={faSave} /> Save
                                </button>
                                <button className="btn btn-secondary secondary-button ms-3" onClick={handleEditToggle}>
                                    <FontAwesomeIcon icon={faTimes} /> Cancel
                                </button>
                                <button className="btn btn-danger danger-button ms-3" onClick={handleDelete}>
                                    <FontAwesomeIcon icon={faTrash} /> Delete
                                </button>
                            </div>
                        ) : (
                            <div className="d-flex justify-content-between align-items-center">
                                <button className="btn btn-outline-secondary secondary-button">
                                    <FontAwesomeIcon icon={faThumbsUp} /> Like
                                </button>
                                <button className="btn btn-outline-primary main-button">
                                    <FontAwesomeIcon icon={faStar} /> Favorite
                                </button>
                                <button className="btn btn-outline-primary main-button" onClick={handleEditToggle}>
                                    <FontAwesomeIcon icon={faPencil} /> Edit
                                </button>
                            </div>
                        )
                    ) : (
                        <div className="d-flex justify-content-between align-items-center">
                            <button className="btn btn-outline-secondary secondary-button" onClick=
                                {() => {
                                    Swal.fire({
                                        icon: "warning",
                                        title: "Oops...",
                                        text: "Please log in first!",
                                    });
                                    navigate("/login");
                                }}
                            >
                                <FontAwesomeIcon icon={faThumbsUp} /> Like
                            </button>
                            <button className="btn btn-outline-primary main-button" onClick=
                                {() => {
                                    Swal.fire({
                                        icon: "warning",
                                        title: "Oops...",
                                        text: "Please log in first!",
                                    });
                                    navigate("/login");
                                }}
                            >
                                <FontAwesomeIcon icon={faStar} /> Favorite
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ArtworkDetails;