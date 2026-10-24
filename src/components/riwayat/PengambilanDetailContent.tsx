"use client";

import React from "react";
import { Package, UserCheck, Users, ClipboardCheck, CheckCircle2 } from "lucide-react";
import DetailSection from "./DetailSection";
import DetailField from "./DetailField";
import { formatDateTime } from "@/lib/utils/dateFormat";

interface PengambilanDetailContentProps {
  claim: any;
  onToast?: (message: string, type: "success" | "error") => void;
}

export default function PengambilanDetailContent({ claim, onToast }: PengambilanDetailContentProps) {
  if (!claim) return null;

  const foundItem = claim.foundItem || {};

  // Identitas Pengambil / Penerima
  const claimantId =
    claim.claimantIdCard && claim.claimantIdCard !== "-"
      ? claim.claimantIdCard
      : claim.wargaId || claim.warga?.id || "—";
  const claimantName = claim.warga?.nama || claim.claimantName || "—";
  const claimantContact = claim.claimantContact && claim.claimantContact !== "-" ? claim.claimantContact : claim.warga?.nomorTelepon || "—";
  const claimantPeran = claim.warga?.peran ? `${claim.warga.peran}${claim.warga.keteranganPeran ? ` (${claim.warga.keteranganPeran})` : ""}` : null;

  // Identitas Penemu (HARUS JELAS TERPISAH)
  const finderId =
    foundItem.finderIdCard && foundItem.finderIdCard !== "-"
      ? foundItem.finderIdCard
      : foundItem.wargaId || foundItem.warga?.id || "—";
  const finderName = foundItem.warga?.nama || foundItem.finderName || "—";
  const finderContact = foundItem.finderContact && foundItem.finderContact !== "-" ? foundItem.finderContact : foundItem.warga?.nomorTelepon || "—";
  const finderPeran = foundItem.warga?.peran ? `${foundItem.warga.peran}${foundItem.warga.keteranganPeran ? ` (${foundItem.warga.keteranganPeran})` : ""}` : null;

  return (
    <div className="space-y-5">
      {/* BAGIAN 1: INFORMASI BARANG */}
      <DetailSection
        icon={<Package className="w-4 h-4" />}
        title="Informasi Barang yang Diambil"
        badge={
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            Diambil
          </span>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <DetailField
            label="Kode Barang"
            value={foundItem.businessCode}
            mono
            copyable
            copyValue={foundItem.businessCode}
            onToast={onToast}
            className="sm:col-span-2 md:col-span-1"
          />
          <DetailField
            label="Jenis / Nama Barang"
            value={foundItem.jenis?.name}
          />
          <DetailField
            label="Merek"
            value={foundItem.merek?.name}
          />
          <DetailField
            label="Warna"
            value={foundItem.warna?.name}
          />
          <DetailField
            label="Lokasi Penemuan"
            value={foundItem.lokasi?.name}
          />
          <DetailField
            label="Waktu Ditemukan"
            value={formatDateTime(foundItem.createdAt)}
          />
          {foundItem.additionalDesc && (
            <div className="sm:col-span-2 md:col-span-3 pt-1">
              <DetailField
                label="Keterangan Barang"
                value={foundItem.additionalDesc}
              />
            </div>
          )}
        </div>
      </DetailSection>

      {/* BAGIAN 2: IDENTITAS PENGAMBIL / PENERIMA */}
      <DetailSection
        icon={<UserCheck className="w-4 h-4" />}
        title="Identitas Pengambil"
        badge={
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
            Penerima Barang
          </span>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <DetailField
            label="Nama Lengkap Pengambil"
            value={claimantName}
          />
          <DetailField
            label="ID (NIS / NIP)"
            value={claimantId}
            mono
            copyable={claimantId !== "—"}
            copyValue={claimantId}
            onToast={onToast}
          />
          <DetailField
            label="Kontak"
            value={claimantContact}
          />
          {claimantPeran && (
            <div className="sm:col-span-2 md:col-span-3">
              <DetailField
                label="Status Pengambil"
                value={claimantPeran}
              />
            </div>
          )}
        </div>
      </DetailSection>

      {/* BAGIAN 3: IDENTITAS PENEMU*/}
      <DetailSection
        icon={<Users className="w-4 h-4" />}
        title="Identitas Penemu"
        badge={
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700">
            Penemu
          </span>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <DetailField
            label="Nama Penemu"
            value={finderName}
          />
          <DetailField
            label="ID Penemu"
            value={finderId}
            mono
            copyable={finderId !== "—"}
            copyValue={finderId}
            onToast={onToast}
          />
          <DetailField
            label="Kontak Penemu"
            value={finderContact}
          />
          {finderPeran && (
            <div className="sm:col-span-2 md:col-span-3">
              <DetailField
                label="Status Penemu"
                value={finderPeran}
              />
            </div>
          )}
        </div>
      </DetailSection>

      {/* BAGIAN 4: INFORMASI SERAH TERIMA */}
      <DetailSection
        icon={<ClipboardCheck className="w-4 h-4" />}
        title="Informasi Serah Terima & Transaksi"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DetailField
            label="Waktu Serah Terima"
            value={formatDateTime(claim.claimedAt)}
          />
          <DetailField
            label="Lokasi Serah Terima"
            value="LACAK"
          />
          <DetailField
            label="Status Transaksi"
            value="Selesai"
          />
          <DetailField
            label="ID Transaksi"
            value={claim.id}
            mono
            copyable
            copyValue={claim.id}
            onToast={onToast}
          />
        </div>
      </DetailSection>
    </div>
  );
}
