'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useEffect, useState, useMemo } from 'react';
import { api } from '@/lib/api';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [allCategories, setAllCategories] = useState([]);
  const [mainCategories, setMainCategories] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function fetchCategories() {
      try {
        setCategoriesLoading(true);
        const res = await api.getCategories();
        if (res.ok) {
          const data = await res.json();
          const categories = data.categories || data || [];

          const activeCategories = categories.filter((cat) => cat.active !== false);
          setAllCategories(activeCategories);

          const activeMainCategories = activeCategories.filter((cat) => {
            const hasNoParent = !cat.parent ||
              (typeof cat.parent === 'object' && !cat.parent._id) ||
              cat.parent === null ||
              cat.parent === undefined;
            return hasNoParent;
          });

          activeMainCategories.sort((a, b) => (a.order || 0) - (b.order || 0));
          setMainCategories(activeMainCategories);
        }
      } catch (error) {
        console.error('Kategoriler yüklenirken hata:', error);
      } finally {
        setCategoriesLoading(false);
      }
    }
    fetchCategories();
  }, []);

  // Favoriler sayısını yükle ve güncelle
  useEffect(() => {
    const updateFavoriteCount = () => {
      try {
        const favoritesKey = user ? `favorites_${user.id}` : 'favorites_guest';
        const savedFavorites = localStorage.getItem(favoritesKey);
        if (savedFavorites) {
          const favoriteIds = JSON.parse(savedFavorites);
          setFavoriteCount(favoriteIds.length);
        } else {
          setFavoriteCount(0);
        }
      } catch {
        setFavoriteCount(0);
      }
    };

    updateFavoriteCount();
    // Storage event listener ekle (diğer tab'lardan güncellemeler için)
    window.addEventListener('storage', updateFavoriteCount);
    // Custom event listener (aynı tab içinde güncellemeler için)
    window.addEventListener('favoritesUpdated', updateFavoriteCount);

    return () => {
      window.removeEventListener('storage', updateFavoriteCount);
      window.removeEventListener('favoritesUpdated', updateFavoriteCount);
    };
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const target = event.target;
      if (!target.closest('[data-category]') && !target.closest('.dropdown-menu')) {
        setOpenDropdown(null);
      }
    };

    if (openDropdown) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [openDropdown]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `/urunler?search=${encodeURIComponent(searchTerm.trim())}`;
    }
  };

  const getSubcategories = (categoryId) => {
    if (!categoryId || !allCategories.length) return [];

    return allCategories.filter((sub) => {
      if (!sub.parent) return false;
      let parentId = null;
      if (typeof sub.parent === 'object' && sub.parent !== null) {
        parentId = sub.parent._id ? sub.parent._id.toString() : null;
      } else if (sub.parent) {
        parentId = sub.parent.toString();
      }
      return parentId === categoryId.toString() && sub.active !== false;
    }).sort((a, b) => (a.order || 0) - (b.order || 0));
  };

  const mainNavItems = useMemo(() => {
    const staticItems = [
      { name: 'Ana Sayfa', href: '/', hasDropdown: false },
      { name: 'Yeni Gelenler', href: '/urunler?new=true', hasDropdown: false },
      { name: 'İndirimli', href: '/urunler?discount=true', hasDropdown: false },
      { name: 'Beden Tablosu', href: '/beden-tablosu', hasDropdown: false },
    ];

    if (categoriesLoading) return staticItems;

    const dynamicItems = mainCategories.map((cat) => {
      const categoryId = cat._id ? cat._id.toString() : '';
      const subcategories = getSubcategories(categoryId);
      return {
        name: cat.name,
        href: `/urunler?category=${cat.slug || cat._id}`,
        hasDropdown: subcategories.length > 0,
        subcategories: subcategories,
        categoryId: categoryId,
      };
    });

    return [
      ...staticItems.slice(0, 2),
      ...dynamicItems,
      ...staticItems.slice(2),
    ];
  }, [mainCategories, allCategories, categoriesLoading]);

  return (
    <div className="nav-root" suppressHydrationWarning={true}>
      {/* Top Promotional Bar */}
      <div className="bg-black text-white text-sm py-2 fixed w-full top-0 z-50 overflow-hidden" suppressHydrationWarning={true}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden h-6">
            <div className="animate-marquee whitespace-nowrap absolute" suppressHydrationWarning={true}>
              <span className="inline-block px-4">24 SAATTE KARGONUZ HAZIR • 2500 TL ÜZERİ ALIŞVERİŞLERDE KARGO ÜCRETSİZ • HIZLI TESLİMAT • 24 SAATTE KARGONUZ HAZIR • 2500 TL ÜZERİ ALIŞVERİŞLERDE KARGO ÜCRETSİZ • HIZLI TESLİMAT</span>
              <span className="inline-block px-4">24 SAATTE KARGONUZ HAZIR • 2500 TL ÜZERİ ALIŞVERİŞLERDE KARGO ÜCRETSİZ • HIZLI TESLİMAT • 24 SAATTE KARGONUZ HAZIR • 2500 TL ÜZERİ ALIŞVERİŞLERDE KARGO ÜCRETSİZ • HIZLI TESLİMAT</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-sm fixed w-full top-8 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <span className="text-3xl font-bold" style={{ color: '#D4A574' }}>
                DipOL Butik
              </span>
            </Link>

            {/* Right Side Icons */}
            <div className="flex items-center gap-6">
              {/* Search */}
              <div className="relative">
                {searchOpen ? (
                  <form onSubmit={handleSearch} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Ara..."
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="text-gray-700 hover:text-primary"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchOpen(false);
                        setSearchTerm('');
                      }}
                      className="text-gray-700 hover:text-primary"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => setSearchOpen(true)}
                    className="text-gray-700 hover:text-primary transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Wishlist */}
              <Link
                href="/favoriler"
                className="relative text-gray-700 hover:text-primary transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {mounted && favoriteCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {favoriteCount}
                  </span>
                )}
              </Link>

              {/* User Login */}
              {user ? (
                <div className="flex items-center gap-3">
                  <Link
                    href="/hesabim"
                    className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="hidden md:inline">{user.name}</span>
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors"
                      title="Admin Paneli"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="hidden md:inline">Admin</span>
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      window.location.href = '/';
                    }}
                    className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition-colors"
                    title="Çıkış Yap"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="hidden md:inline">Çıkış</span>
                  </button>
                </div>
              ) : (
                <Link
                  href="/giris"
                  className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="hidden md:inline">Üye Girişi</span>
                </Link>
              )}

              {/* Shopping Cart */}
              <Link
                href="/sepet"
                className="relative text-gray-700 hover:text-primary transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {mounted && (
                  <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Bar */}
      <nav className="bg-white border-t border-gray-200 fixed w-full top-28 z-30" style={{ overflow: 'visible' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ overflow: 'visible' }}>
          <div className="flex items-center h-14" style={{ overflow: 'visible' }}>
            <div className="hidden md:flex items-center gap-4" style={{ overflow: 'visible', position: 'relative' }}>
              {mainNavItems.map((item) => {
                const isOpen = openDropdown === item.name;
                const hasSubcategories = item.hasDropdown && item.subcategories && Array.isArray(item.subcategories) && item.subcategories.length > 0;

                return (
                  <div
                    key={item.name}
                    className="relative group overflow-visible"
                    data-category={item.name}
                  >
                    <div className="flex items-center">
                      <Link
                        href={item.href}
                        className="text-gray-700 hover:text-primary transition-colors text-sm font-medium whitespace-nowrap py-2 relative"
                      >
                        {item.name}
                      </Link>
                      {item.hasDropdown && hasSubcategories && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setOpenDropdown(openDropdown === item.name ? null : item.name);
                          }}
                          className="text-gray-700 hover:text-primary transition-colors ml-1 p-2 -mr-2"
                          aria-label="Alt kategorileri göster"
                        >
                          <svg
                            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      )}
                    </div>

                    {/* Dropdown Menu - Alt kategoriler */}
                    {hasSubcategories && (
                      <div
                        className={`dropdown-menu absolute top-full left-0 mt-2 bg-white rounded-lg shadow-2xl border border-gray-200 py-3 z-[1000] ${isOpen ? 'block' : 'hidden'
                          }`}
                        data-category={item.name}
                        style={{
                          opacity: isOpen ? 1 : 0,
                          transform: isOpen ? 'translateY(0) translateX(0)' : 'translateY(-10px) translateX(0)',
                          transition: isOpen ? 'opacity 0.2s ease-out, transform 0.2s ease-out' : 'opacity 0.15s ease-out, transform 0.15s ease-out',
                          minWidth: '300px',
                          maxWidth: '350px',
                          maxHeight: '500px',
                          overflowY: 'auto',
                        }}
                        onClick={(e) => {
                          // Dropdown içindeki tıklamaları durdur
                          e.stopPropagation();
                        }}
                      >
                        <div className="px-2">
                          {/* Alt kategoriler */}
                          {item.subcategories.map((sub) => (
                            <Link
                              key={sub._id || sub.name}
                              href={`/urunler?category=${sub.slug || sub._id}`}
                              className="block px-5 py-3.5 text-sm font-medium text-gray-700 hover:bg-primary hover:text-white transition-all duration-200 rounded-md cursor-pointer relative z-[1001] mb-0.5 w-full"
                              onClick={() => {
                                setOpenDropdown(null);
                              }}
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-2 border-t border-gray-200">
              {mainNavItems.map((item) => (
                <div key={item.name}>
                  <Link
                    href={item.href}
                    className="block px-4 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                  {item.hasDropdown && 'subcategories' in item && item.subcategories && item.subcategories.length > 0 && (
                    <div className="pl-6 space-y-1">
                      {item.subcategories.map((sub) => (
                        <Link
                          key={sub._id}
                          href={`/urunler?category=${sub.slug || sub._id}`}
                          className="block px-4 py-2 text-sm text-gray-600 hover:text-primary hover:bg-gray-50 transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Mobile User Menu */}
              <div className="border-t border-gray-200 mt-4 pt-4">
                {user ? (
                  <div className="space-y-2">
                    {user.role === 'admin' && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors font-medium text-orange-600"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>Admin Paneli</span>
                      </Link>
                    )}
                    <Link
                      href="/hesabim"
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>{user.name}</span>
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                        window.location.href = '/';
                      }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-gray-50 transition-colors text-left"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Çıkış Yap</span>
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/giris"
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Üye Girişi</span>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-40"></div>
    </div>
  );
}
