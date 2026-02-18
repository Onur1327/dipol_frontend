'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import Link from 'next/link';

export default function CartPage() {
    const { items, removeItem, updateQuantity, total, shippingCost, finalTotal, clearCart, freeShippingThreshold } = useCart();
    const { user, loading } = useAuth();
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const remainingForFreeShipping = freeShippingThreshold - total;

    if (!isClient || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="min-h-screen">
                <Navbar />
                <div className="pt-20 pb-16">
                    <div className="max-w-4xl mx-auto px-4">
                        <h1 className="text-3xl font-bold mb-8">Sepetim</h1>
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg mb-4">Sepetiniz boş</p>
                            <Link
                                href="/urunler"
                                className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
                            >
                                Alışverişe Başla
                            </Link>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="pt-20 pb-16">
                <div className="max-w-4xl mx-auto px-4">
                    <h1 className="text-3xl font-bold mb-8">Sepetim</h1>

                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        {items.map((item, index) => (
                            <div key={index} className="flex gap-4 py-4 border-b last:border-b-0">
                                <div className="relative w-24 h-24 flex-shrink-0">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-cover rounded"
                                        sizes="96px"
                                    />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold mb-1">{item.name}</h3>
                                    {item.size && <p className="text-sm text-gray-500">Beden: {item.size}</p>}
                                    {item.color && <p className="text-sm text-gray-500">Renk: {item.color}</p>}
                                    <p className="text-primary font-semibold mt-2">
                                        {item.price.toFixed(2)} ₺
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() =>
                                                updateQuantity(item.product, item.quantity - 1, item.size, item.color)
                                            }
                                            className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100"
                                        >
                                            -
                                        </button>
                                        <span className="w-8 text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => {
                                                if (item.maxStock !== undefined && item.maxStock >= 0 && item.quantity >= item.maxStock) {
                                                    alert(`Bu ürün için en fazla ${item.maxStock} adet ekleyebilirsiniz`);
                                                    return;
                                                }
                                                updateQuantity(item.product, item.quantity + 1, item.size, item.color);
                                            }}
                                            className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => removeItem(item.product, item.size, item.color)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        Sil
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Ara Toplam:</span>
                                <span className="text-lg font-semibold">
                                    {total.toFixed(2)} ₺
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Kargo:</span>
                                <span className={`text-lg font-semibold ${shippingCost === 0 ? 'text-green-600' : ''}`}>
                                    {shippingCost === 0 ? 'ÜCRETSİZ' : `${shippingCost.toFixed(2)} ₺`}
                                </span>
                            </div>
                            {total < freeShippingThreshold && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                    <p className="text-sm text-yellow-800">
                                        <span className="font-semibold">{(freeShippingThreshold - total).toFixed(2)} ₺</span> daha alışveriş yapın, kargo ücretsiz olsun!
                                    </p>
                                </div>
                            )}
                            {shippingCost === 0 && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                    <p className="text-sm text-green-800 font-semibold">
                                        🎉 Kargo ücretsiz!
                                    </p>
                                </div>
                            )}
                            <div className="border-t pt-3 flex justify-between items-center">
                                <span className="text-lg font-semibold">Toplam:</span>
                                <span className="text-2xl font-bold text-primary">
                                    {finalTotal.toFixed(2)} ₺
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={clearCart}
                                className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Sepeti Temizle
                            </button>
                            <Link
                                href="/odeme"
                                className="flex-1 bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition-colors text-center font-semibold"
                            >
                                Ödemeye Geç
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
