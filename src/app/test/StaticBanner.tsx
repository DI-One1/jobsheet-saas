// app/components/StaticBanner.tsx
export default function StaticBanner() {
  const buildTimestamp = new Date().toLocaleTimeString('id-ID');
  
  return (
    <div className="p-4 bg-blue-100 border border-blue-300 rounded-lg my-4">
      <h2 className="text-xl font-bold text-blue-900">
        Promo Spesial Hari Ini! (Static Component)
      </h2>
      <p className="text-sm text-blue-700">
        Komponen ini dirender saat build time dan dibagikan secara statis ke seluruh pengguna.
      </p>
      <span className="text-xs bg-blue-200 px-2 py-1 rounded mt-2 inline-block">
        Waktu Generasi Statis: {buildTimestamp}
      </span>
    </div>
  );
}