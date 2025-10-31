import React from 'react';

const PatientGallerySection = () => {
  // Sample data - Replace with actual patient testimonials and images
  const testimonials = [
    {
      id: 1,
      beforeImage: '/path/to/before-image-1.jpg',
      afterImage: '/path/to/after-image-1.jpg',
      description: 'Patient recovered from chronic skin condition',
      patientName: 'Anonymous',
    },
    // Add more testimonials here
  ];

  return (
    // <section className="py-16 bg-gray-50">
    //   <div className="container mx-auto px-4">
    //     <h2 className="text-3xl font-bold text-center mb-12 text-primary-600">
    //       Patient Success Stories
    //     </h2>
        
    //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    //       {testimonials.map((testimonial) => (
    //         <div key={testimonial.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
    //           <div className="flex flex-col space-y-4 p-6">
    //             <div className="grid grid-cols-2 gap-4">
    //               <div>
    //                 <p className="text-sm font-semibold mb-2">Before</p>
    //                 <img
    //                   src={testimonial.beforeImage}
    //                   alt="Before treatment"
    //                   className="w-full h-48 object-cover rounded"
    //                 />
    //               </div>
    //               <div>
    //                 <p className="text-sm font-semibold mb-2">After</p>
    //                 <img
    //                   src={testimonial.afterImage}
    //                   alt="After treatment"
    //                   className="w-full h-48 object-cover rounded"
    //                 />
    //               </div>
    //             </div>
    //             <div className="mt-4">
    //               <p className="text-gray-600 italic">{testimonial.description}</p>
    //               <p className="text-sm font-medium text-gray-500 mt-2">- {testimonial.patientName}</p>
    //             </div>
    //           </div>
    //         </div>
    //       ))}
    //     </div>
    //   </div>
    // </section>

    
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-primary-600">
          Patient Success Stories
        </h2>
        <h4 className='text-center'>This Section is Under Construction</h4>
      </div>
    </section>
  );
};

export default PatientGallerySection;