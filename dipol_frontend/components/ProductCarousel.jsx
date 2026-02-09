'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import ProductCard from './ProductCard';
import 'swiper/css';
import 'swiper/css/navigation';

export default function ProductCarousel({
  products,
  title,
  subtitle,
  slidesPerView = 4,
  autoplay = false,
}) {
  if (products.length === 0) return null;

  const breakpoints = {
    320: {
      slidesPerView: 1,
      spaceBetween: 10,
    },
    640: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    1024: {
      slidesPerView: 3,
      spaceBetween: 30,
    },
    1280: {
      slidesPerView: slidesPerView,
      spaceBetween: 30,
    },
  };

  return (
    <div className="w-full py-4">
      {(title || subtitle) && (
        <div className="text-center mb-8">
          {title && (
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-gray-600 text-lg">{subtitle}</p>
          )}
        </div>
      )}

      <div className="relative">
        <Swiper
          modules={[Navigation, ...(autoplay ? [Autoplay] : [])]}
          spaceBetween={30}
          slidesPerView={slidesPerView}
          breakpoints={breakpoints}
          navigation={true}
          autoplay={autoplay ? {
            delay: 3000,
            disableOnInteraction: false,
          } : false}
          loop={products.length > slidesPerView}
          className="product-carousel"
        >
          {products.map((product) => (
            <SwiperSlide key={product._id}>
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style jsx global>{`
        .product-carousel .swiper-button-next,
        .product-carousel .swiper-button-prev {
          color: var(--color-primary);
          background: white;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          top: 50%;
          transform: translateY(-50%);
        }
        .product-carousel .swiper-button-next:after,
        .product-carousel .swiper-button-prev:after {
          font-size: 18px;
          font-weight: bold;
        }
        .product-carousel .swiper-button-next:hover,
        .product-carousel .swiper-button-prev:hover {
          background: var(--color-primary);
          color: white;
        }
        .product-carousel .swiper-button-disabled {
          opacity: 0.3;
        }
      `}</style>
    </div>
  );
}

