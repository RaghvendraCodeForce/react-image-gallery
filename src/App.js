import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Gallery from './components/Gallery';
import SearchBar from './components/SearchBar';
import Modal from './components/Modal';
import './App.css';

function App() {
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState('nature'); // Default search term
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1); // For pagination
  const [selectedImage, setSelectedImage] = useState(null);
  const [savedImages, setSavedImages] = useState([]); // For saved images

  // Fetch images from the Unsplash API
  const fetchImages = async (query, page) => {
    setLoading(true);
    try {
      const response = await axios.get('https://api.unsplash.com/search/photos', {
        params: {
          client_id: 'OxegWHJX4jBNKvahOZ8qNF6nK_9H9xJAhZzkiQ8Ps8I', // Unsplash API key
          query,
          page,
          per_page: 10, // Number of images per page
        },
      });
      // If new search, reset images
      setImages(prevImages => page === 1 ? response.data.results : [...prevImages, ...response.data.results]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch images whenever query or page changes
  useEffect(() => {
    fetchImages(query, page);
  }, [query, page]);

  // Fetch saved images from localStorage when component mounts
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedImages')) || [];
    setSavedImages(saved);
  }, []);

  // Save image to localStorage
  const saveImage = (image) => {
    const updatedSavedImages = [...savedImages, image];
    setSavedImages(updatedSavedImages);
    localStorage.setItem('savedImages', JSON.stringify(updatedSavedImages));
  };

  // Remove image from localStorage
  const removeImage = (imageId) => {
    const updatedSavedImages = savedImages.filter(image => image.id !== imageId);
    setSavedImages(updatedSavedImages);
    localStorage.setItem('savedImages', JSON.stringify(updatedSavedImages));
  };

  // Handle image search
  const handleSearch = (term) => {
    setQuery(term);
    setPage(1); // Reset to first page when a new search is made
    setImages([]); // Reset images before fetching new ones
  };

  // Handle scroll for infinite scrolling
  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight === e.target.scrollTop + e.target.clientHeight;
    if (bottom && !loading) {
      setPage(page + 1); // Load more images when scrolled to the bottom
    }
  };

  return (
    <div className="App" onScroll={handleScroll}>
      <SearchBar onSearch={handleSearch} />
      
      <h2>Search Results</h2>
      <Gallery
        images={images}
        onImageClick={setSelectedImage}
        onSaveImage={saveImage} // Pass save function to Gallery
      />

      <h2>Saved Images</h2>
      <div className="saved-gallery">
        {savedImages.map((image) => (
          <div key={image.id} className="saved-image">
            <img src={image.urls.small} alt={image.alt_description} />
            <button onClick={() => removeImage(image.id)}>Remove</button>
          </div>
        ))}
      </div>

      {selectedImage && <Modal image={selectedImage} onClose={() => setSelectedImage(null)} />}
      {loading && <p>Loading...</p>}
    </div>
  );
}

export default App;
