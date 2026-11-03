import { Warga } from "../types";
import { Modal } from "@/components/ui/Modal";

interface WargaProfileModalProps {
  profilWarga: Warga;
  isOpen: boolean;
  onClose: () => void;
}

export default function WargaProfileModal({ profilWarga, isOpen, onClose }: WargaProfileModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detail Profil Warga">
      <div className="space-y-6">
        {/* Identity Header */}
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#0d7565] text-white flex items-center justify-center font-bold text-2xl shadow-xs shrink-0">
            {profilWarga.nama.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-xl font-bold text-[#102824] leading-tight truncate">
              {profilWarga.nama}
            </h3>
            <p className="text-xs text-[#526b65] font-mono mt-1 flex flex-wrap items-center gap-1.5">
              <span>ID: <strong className="text-[#0d7565] font-semibold">{profilWarga.id}</strong></span>
              <span className="text-gray-300">&bull;</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#eef7f4] text-[#0d7565] text-[10px] font-sans font-semibold border border-[#d2e5df]">
                {profilWarga.peran}{profilWarga.keterangan_peran ? ` (${profilWarga.keterangan_peran})` : ""}
              </span>
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#e2ece8]"></div>

        {/* Detail Profil */}
        <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#526b65] block mb-1">
              Peran
            </span>
            <span className="font-semibold text-[#102824]">{profilWarga.peran}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#526b65] block mb-1">
              Keterangan
            </span>
            <span className="font-semibold text-[#102824]">
              {profilWarga.keterangan_peran || "—"}
            </span>
          </div>
          <div className="col-span-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#526b65] block mb-1">
              Kontak WhatsApp
            </span>
            {profilWarga.nomor_telepon ? (
              <a
                href={`https://wa.me/${profilWarga.nomor_telepon.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-[#0d7565] hover:text-[#0a5d50] hover:underline inline-flex items-center gap-1.5"
              >
                <span>{profilWarga.nomor_telepon}</span>
                <svg className="w-3.5 h-3.5 text-[#0d7565]" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"/>
                  <path d="M6.586 1A2 2 0 0 0 5.172 1.586l-1.828 1.83a3 3 0 0 0 0 4.243l.544.544a4.01 4.01 0 0 1 .128-1.287l-.793-.793a2 2 0 1 1 2.828-2.83l1.829-1.829A2 2 0 0 1 8.586 3.5L9 2.914a1.002 1.002 0 0 0 .154-.199A2 2 0 0 0 6.586 1z"/>
                </svg>
              </a>
            ) : (
              <span className="font-semibold text-gray-400">—</span>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-[#0d7565] hover:bg-[#0a5d50] active:scale-[0.98] text-white rounded-xl transition-all shadow-xs text-xs font-bold cursor-pointer"
          >
            Tutup Profil
          </button>
        </div>
      </div>
    </Modal>
  );
}
