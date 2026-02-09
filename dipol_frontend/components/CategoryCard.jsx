import Link from 'next/link';
import Image from 'next/image';

export default function CategoryCard({ category }) {
    return (
        <Link href={`/urunler?category=${category.slug}`} className="group block">
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-gray-100 mb-3">
                {category.image ? (
                    <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg
                            className="w-12 h-12"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                    </div>
                )}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-white text-2xl font-bold drop-shadow-md text-center px-4">
                        {category.name}
                    </h3>
                </div>
            </div>
        </Link>
    );
}
