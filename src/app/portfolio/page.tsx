import DomeGallery from '@/components/layout/DomeGallery';

export default function GalleryPage() {
  const myImages = [
    { src: '/images/clients/logo.jpg', alt: 'E-commerce Jersey Shop - Custom Online Store' },
    { src: '/images/clients/logo.png', alt: 'GSAP Animation Portfolio - Interactive Web Design' },
    { src: '/images/clients/white-version.png', alt: 'Cleaning Service Website - Professional Business Solution' },
    // Add more images here...
  ];

  return (
    <main className="relative w-full h-screen bg-[#060010]">
      {/* Optional: Add a floating header */}
      <div className="absolute top-10 left-10 z-50 pointer-events-none">
        {/* <h1 className="text-4xl font-bold text-white tracking-tighter">SELECTED WORKS</h1>
        <p className="text-gray-400">Drag to explore the dome</p> */}
      </div>

      <DomeGallery
        images={myImages}
        fit={0.8}
        minRadius={700}
        maxVerticalRotationDeg={10} // Allows slight up/down tilt
        segments={34}
        dragDampening={1.5}
        grayscale={false} // Set to false if you want color images
        openedImageWidth="600px"
        openedImageHeight="600px"
      />
    </main>
  );
}