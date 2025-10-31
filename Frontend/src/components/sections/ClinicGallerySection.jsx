import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from "../../config/api";


const ClinicGallerySection = () => {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch images from backend
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await axios.get(`${API_URL}/gallery`);
        setGallery(res.data);
      } catch (err) {
        console.error('Error fetching gallery:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-500">
        Loading gallery...
      </div>
    );
  }

  if (gallery.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        No images available.
      </div>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-primary-600">
          Our Clinic
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gallery.map((item) => (
            <div
              key={item._id}
              className="group relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl"
            >
              <img
                src={`${API_URL}${item.imageUrl}`}
                alt={item.caption}
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <h3 className="text-white font-semibold text-lg">
                  {item.caption}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClinicGallerySection;
