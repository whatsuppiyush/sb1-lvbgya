import React, { useState, useEffect } from 'react';
import Airtable from 'airtable';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LemonSqueezyPayment from './LemonSqueezyPayment';

// Configure Airtable
const base = new Airtable({ apiKey: import.meta.env.VITE_AIRTABLE_API_KEY }).base(import.meta.env.VITE_AIRTABLE_BASE_ID);

interface ImageData {
  id: string;
  imageUrl: string;
  canvaUrl: string;
  title: string;
}

const Gallery: React.FC = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const { user, isProUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const fetchImages = async () => {
      try {
        const records = await base(import.meta.env.VITE_AIRTABLE_TABLE_NAME).select().all();
        const formattedImages = records.map(record => ({
          id: record.id,
          imageUrl: record.get('Image')?.[0]?.url || '',
          canvaUrl: record.get('Canva URL') as string,
          title: record.get('Title') as string,
        }));
        setImages(formattedImages);
        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching data from Airtable:', err);
        if (err.error === 'NOT_FOUND') {
          setError('The specified Airtable base or table could not be found. Please check your configuration.');
        } else if (err.error === 'UNAUTHORIZED') {
          setError('Unable to access the Airtable base. Please check your API key.');
        } else {
          setError('An error occurred while fetching images. Please try again later.');
        }
        setLoading(false);
      }
    };

    fetchImages();
  }, [user, navigate]);

  const handleImageClick = (image: ImageData) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  if (!user) return null;
  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Click on Ad to get template Link</h1>
      {images.length === 0 ? (
        <p className="text-center text-gray-500">No images found in the gallery.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map(image => (
            <div 
              key={image.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer aspect-square relative"
              onClick={() => handleImageClick(image)}
            >
              <img src={image.imageUrl} alt={image.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black opacity-0 hover:opacity-50 transition-opacity duration-300 flex items-end">
                <h2 className="text-white p-4">{image.title}</h2>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h2 className="text-2xl font-bold mb-4">{selectedImage.title}</h2>
            {isProUser ? (
              <p className="mb-4">
                <a 
                  href={selectedImage.canvaUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Open in Canva
                </a>
              </p>
            ) : (
              <div className="mb-4">
                <p className="mb-2">Subscribe to Pro to access this template!</p>
                <LemonSqueezyPayment user={user} variantId="548748" />
              </div>
            )}
            <button 
              onClick={closeModal}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;