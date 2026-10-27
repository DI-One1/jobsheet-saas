const DEFAULT_PETUGAS_EMAILS = [
  "lacak.smktibazma@gmail.com",
  "mochcomeback@gmail.com",
  "mcakbarutama@gmail.com",
];

const envPetugasEmails = process.env.PETUGAS_EMAILS
  ? process.env.PETUGAS_EMAILS.split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean)
  : [];

export const PETUGAS_EMAILS = Array.from(
  new Set([
    ...DEFAULT_PETUGAS_EMAILS.map((email) => email.trim().toLowerCase()),
    ...envPetugasEmails,
  ])
);

export function isPetugasEmail(email: string | null | undefined): boolean {
  return email ? PETUGAS_EMAILS.includes(email.trim().toLowerCase()) : false;
}

