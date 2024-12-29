import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Browse from '../components/Browse';
import TagButtons from '../components/TagButtons';

const BrowsePage = () => {
  const [selectedTag, setSelectedTag] = useState(null);

  const handleSelectTag = (tag) => {
    if (tag == selectedTag) {
      setSelectedTag(null);
    } else {
    setSelectedTag(tag);
    }
  };

  return (
    <div>
      <Navbar />
      <TagButtons onSelectTag={handleSelectTag} />
      <Browse selectedTag={selectedTag} />
      <Footer />
    </div>
  );
};

export default BrowsePage;