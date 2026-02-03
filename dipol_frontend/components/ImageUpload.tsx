'use client';

import { useState, useRef, useMemo } from 'react';

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
  accept?: string;
}

export default function ImageUpload({
  value = '',
  onChange,
  label = 'Görsel',
  required = false,
  accept = 'image/*',
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [mode, setMode] = useState<'url' | 'upload'>('url');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Ensure value is always a string - never undefined or null
  // useMemo kullanarak her render'da aynı değeri garantiliyoruz
  const safeValue = useMemo(() => {
    if (typeof value === 'string') {
      return value;
    }
    return '';
  }, [value]);

  // Görseli optimize et (sıkıştır ve boyutlandır)
  const compressImage = (file: File, maxWidth: number = 1920, maxHeight: number = 1920, quality: number = 0.8): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Boyutlandırma
          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            } else {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Canvas context alınamadı'));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          
          // JPEG formatında sıkıştır (PNG'den daha küçük)
          const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedBase64);
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Dosya boyutunu kontrol et (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Görsel boyutu çok büyük. Maksimum 5MB olmalıdır.');
      return;
    }

    setUploading(true);

    try {
      // Görseli optimize et ve base64'e çevir
      const base64String = await compressImage(file);
        
      // Optimize edilmiş base64'i kullan
      onChange(base64String);
      setUploading(false);
      
      // Backend'e gönder (opsiyonel - validasyon için)
      try {
        const token = localStorage.getItem('token');
        // Her zaman production backend URL'ini kullan
        const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'https://dipol-backend.vercel.app').replace(/\/+$/, ''); // Sonundaki slash'ları temizle
        const res = await fetch(
          `${apiUrl}/api/upload`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token && { Authorization: `Bearer ${token}` }),
            },
            body: JSON.stringify({
              image: base64String,
              filename: file.name,
            }),
          }
        );

        if (res.ok) {
          const data = await res.json();
          // Backend'den gelen validasyonlu görseli kullan
          if (data.image && data.image !== base64String) {
            onChange(data.image);
          }
        }
        // Backend hatası olsa bile görsel zaten yüklendi, sessizce devam et
      } catch (backendError) {
        // Backend hatası olsa bile görsel zaten yüklendi - sessizce devam et
        // Sadece development'ta log
        if (process.env.NODE_ENV === 'development') {
          console.warn('Backend validation failed, using direct base64');
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Görsel yüklenirken bir hata oluştu');
      setUploading(false);
    }
  };

  const handleUrlChange = (url: string) => {
    onChange(url);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* Mod seçimi */}
      <div className="flex gap-2 mb-2">
        <button
          type="button"
          onClick={() => setMode('url')}
          className={`px-3 py-1 text-sm rounded ${
            mode === 'url'
              ? 'bg-primary text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          URL
        </button>
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={`px-3 py-1 text-sm rounded ${
            mode === 'upload'
              ? 'bg-primary text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Dosya Yükle
        </button>
      </div>

      {mode === 'url' ? (
        <div>
          <input
            type="url"
            value={safeValue}
            onChange={(e) => {
              const newValue = e.target.value || '';
              handleUrlChange(newValue);
            }}
            placeholder="https://example.com/image.jpg"
            className="w-full px-4 py-2 border rounded-lg"
            required={required}
          />
          {safeValue && (
            <div className="mt-2">
              <img
                src={safeValue}
                alt="Preview"
                className="max-w-full h-32 object-cover rounded border"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <button
                type="button"
                onClick={() => onChange('')}
                className="mt-2 text-sm text-red-600 hover:text-red-800"
              >
                Görseli Kaldır
              </button>
            </div>
          )}
        </div>
      ) : (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <span className="text-gray-500">Yükleniyor...</span>
            ) : (
              <span className="text-gray-600">Dosya Seç veya Sürükle-Bırak</span>
            )}
          </button>
          {safeValue && (
            <div className="mt-2">
              <img
                src={safeValue}
                alt="Preview"
                className="max-w-full h-32 object-cover rounded border"
              />
              <button
                type="button"
                onClick={() => onChange('')}
                className="mt-2 text-sm text-red-600 hover:text-red-800"
              >
                Görseli Kaldır
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

