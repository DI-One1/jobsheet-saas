"use client";

import React from "react";
import { Package, UserCheck, ShieldCheck, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import DetailSection from "./DetailSection";
import DetailField from "./DetailField";
import { formatDateTime } from "@/lib/utils/dateFormat";

interface TemuanDetailContentProps {
  item: any;
  onToast?: (message: string, type: "success" | "error") => void;
}

export default function TemuanDetailContent({ item, onToast }: TemuanDetailContentProps) {
  if (!item) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "FOUND":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Tersedia
          </span>
        );
      case "CLAIMED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
            <UserCheck className="w-3.5 h-3.5 text-blue-600" />
            Diambil
          </span>
        );
      case "EXPIRED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">
            <Clock className="w-3.5 h-3.5 text-gray-500" />
            Kedaluwarsa
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">
            {status}
          </span>
        );
    }
  };

  const finderId =
    item.finderIdCard && item.finderIdCard !== "-"
      ? item.finderIdCard
      : item.wargaId || item.warga?.id || "—";

  const finderName = item.warga?.nama || item.finderName || "—";
  const finderContact = item.finderContact && item.finderContact !== "-" ? item.finderContact : item.warga?.nomorTelepon || "—";
  const peranWarga = item.warga?.peran ? `${item.warga.peran}${item.warga.keteranganPeran ? ` (${item.warga.keteranganPeran})` : ""}` : null;

  return (
    <div className="space-y-5">
      {/* BAGIAN 1: INFORMASI BARANG */}
      <DetailSection
        icon={<Package className="w-4 h-4" />}
        title="Informasi Barang"
        badge={getStatusBadge(item.status)}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <DetailField
            label="Kode Barang"
            value={item.businessCode}
            mono
            copyable
            copyValue={item.businessCode}
            onToast={onToast}
            className="sm:col-span-2 md:col-span-1"
          />
          <DetailField
            label="Jenis / Nama Barang"
            value={item.jenis?.name}
          />
          <DetailField
            label="Merek"
            value={item.merek?.name}
          />
          <DetailField
            label="Warna"
            value={item.warna?.name}
          />
          <DetailField
            label="Lokasi Penemuan"
            value={item.lokasi?.name}
          />
          <DetailField
            label="Waktu Ditemukan / Terdaftar"
            value={formatDateTime(item.createdAt)}
          />
          <div className="sm:col-span-2 md:col-span-3 pt-1">
            <DetailField
              label="Keterangan / Ciri Khusus"
              value={item.additionalDesc || "Tidak ada keterangan tambahan"}
            />
          </div>
        </div>
      </DetailSection>

      {/* BAGIAN 2: IDENTITAS PENEMU / PENYERAH */}
      <DetailSection
        icon={<UserCheck className="w-4 h-4" />}
        title="Identitas Penemu / Penyerah"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <DetailField
            label="Nama Lengkap Penemu"
            value={finderName}
          />
          <DetailField
            label="ID Personel (NIS / NIP)"
            value={finderId}
            mono
            copyable={finderId !== "—"}
            copyValue={finderId}
            onToast={onToast}
          />
          <DetailField
            label="Kontak / No. Telepon"
            value={finderContact}
          />
          {peranWarga && (
            <div className="sm:col-span-2 md:col-span-3">
              <DetailField
                label="Peran Personel Terdaftar"
                value={peranWarga}
              />
            </div>
          )}
        </div>
      </DetailSection>

      {/* BAGIAN 3: INFORMASI ADMINISTRATIF & SERAH TERIMA */}
      <DetailSection
        icon={<ShieldCheck className="w-4 h-4" />}
        title="Informasi Administratif"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DetailField
            label="Waktu Pencatatan Sistem"
            value={formatDateTime(item.createdAt)}
          />
          <DetailField
            label="Terakhir Diperbarui"
            value={formatDateTime(item.updatedAt)}
          />

          {item.status === "CLAIMED" && item.claim && (
            <div className="sm:col-span-2 p-3.5 bg-blue-50/70 rounded-xl border border-blue-100 space-y-2 mt-1">
              <div className="flex items-center gap-2 text-blue-900 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                Catatan Serah Terima / Pengambilan
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-500">Penerima:</span>{" "}
                  <strong className="text-gray-900 font-semibold">{item.claim.claimantName}</strong> (ID: {item.claim.claimantIdCard})
                </div>
                <div>
                  <span className="text-gray-500">Waktu Diambil:</span>{" "}
                  <span className="text-gray-900">{formatDateTime(item.claim.claimedAt)}</span>
                </div>
              </div>
            </div>
          )}

          {item.status === "FOUND" && (
            <div className="sm:col-span-2 text-xs text-emerald-800 bg-emerald-50/70 border border-emerald-100 p-3 rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Barang tersimpan di pos piket/penyimpanan dan siap diambil oleh pemilik yang sah.</span>
            </div>
          )}

          {item.status === "EXPIRED" && (
            <div className="sm:col-span-2 text-xs text-amber-800 bg-amber-50/70 border border-amber-100 p-3 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Masa simpan barang telah kedaluwarsa melewati batas hari operasional.</span>
            </div>
          )}
        </div>
      </DetailSection>
    </div>
  );
}
