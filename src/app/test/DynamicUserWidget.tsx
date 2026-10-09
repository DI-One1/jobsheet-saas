// app/components/DynamicUserWidget.tsx
import { cookies, headers } from 'next/headers';

export default async function DynamicUserWidget() {
  // Penggunaan Dynamic Functions
  const cookieStore = await cookies();
  const headersList = await headers();
  
  const userRole = cookieStore.get('user_role')?.value || 'Guest User';
  const userAgent = headersList.get('user-agent') || 'Unknown Device';
  const requestTime = new Date().toLocaleTimeString('id-ID');

  return (
    <div className="p-4 bg-emerald-100 border border-emerald-300 rounded-lg my-4">
      <h2 className="text-xl font-bold text-emerald-900">
        Widget Pengguna Interaktif (Dynamic Component)
      </h2>
      <p className="text-sm text-emerald-800">
        Halaman/komponen ini memicu Dynamic Rendering karena membaca data request waktu nyata (Cookies/Headers).
      </p>
      <ul className="mt-2 text-xs text-emerald-900 space-y-1">
        <li><strong>Role Pengguna:</strong> {userRole}</li>
        <li><strong>Waktu Request:</strong> {requestTime}</li>
        <li><strong>Browser/Device:</strong> {userAgent.substring(0, 40)}...</li>
      </ul>
    </div>
  );
}