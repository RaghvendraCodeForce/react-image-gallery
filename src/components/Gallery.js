import React from 'react';

const Gallery = ({ images, onImageClick, onSaveImage }) => {
  return (
    <div className="gallery">
      {images.map((image) => (
        <div key={image.id} className="image-item">
          <img src={image.urls.small} alt={image.alt_description} onClick={() => onImageClick(image)} />
          <button onClick={() => onSaveImage(image)}>Save</button> {/* Save Button */}
        </div>
      ))}
    </div>
  );
};

export default Gallery;
