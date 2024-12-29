import React, { useState, useEffect } from 'react';

const TagButtons = ({ onSelectTag }) => {
    const [tags, setTags] = useState([]);

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const res = await fetch('http://localhost:8080/api/tags');
                const data = await res.json();
                setTags(data);
            } catch (error) {
                console.error('Error fetching tags:', error);
            }
        };

        fetchTags();
    }, []);

    return (
        <div className="container">
            <div className="tag-buttons">
                {tags.map(tag => (
                    <button key={tag.id} onClick={() => onSelectTag(tag.name)} className="btn btn-outline-primary m-1">
                        {tag.name}
                    </button>
                ))}
            </div>

        </div>
    );
};

export default TagButtons;
