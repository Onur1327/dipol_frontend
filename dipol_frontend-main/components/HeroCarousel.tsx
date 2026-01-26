'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import Image from 'next/image';
import Link from 'next/link';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

interface HeroSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  link?: string;
  buttonText?: string;
}

interface HeroCarouselProps {
  slides: HeroSlide[];
}

export default function HeroCarousel({ slides }: HeroCarouselProps) {
  return (
    <div className="relative w-full">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        navigation={true}
        loop={slides.length > 1}
        className="hero-carousel"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-[350px] md:h-[400px] lg:h-[450px] w-full">
              {slide.image && slide.image !== '/placeholder.jpg' ? (
                slide.image.startsWith('data:image') ? (
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="100vw"
                    unoptimized
                  />
                )
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 via-secondary to-accent/20" />
              )}
              <div className="absolute inset-0 bg-black/30 flex items-end justify-center pb-16 md:pb-20 lg:pb-24">
                <div className="text-center px-4 max-w-4xl mx-auto">
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                    {slide.title}
                  </h2>
                  <p className="text-xl md:text-2xl text-white drop-shadow-md">
                    {slide.subtitle}
                  </p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      
      <style jsx global>{`
        .hero-carousel .swiper-pagination-bullet {
          background: white;
          opacity: 0.5;
          width: 12px;
          height: 12px;
        }
        .hero-carousel .swiper-pagination-bullet-active {
          opacity: 1;
          background: var(--color-primary);
        }
        .hero-carousel .swiper-button-next,
        .hero-carousel .swiper-button-prev {
          color: white;
          background: rgba(0, 0, 0, 0.3);
          width: 50px;
          height: 50px;
          border-radius: 50%;
        }
        .hero-carousel .swiper-button-next:after,
        .hero-carousel .swiper-button-prev:after {
          font-size: 20px;
        }
        .hero-carousel .swiper-button-next:hover,
        .hero-carousel .swiper-button-prev:hover {
          background: rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </div>
  );
}

