export const PETUGAS_EMAILS = [
  "lacak.smktibazma@gmail.com",
  "mochcomeback@gmail.com",
  "mcakbarutama@gmail.com",
].map((email) => email.trim().toLowerCase());

export function isPetugasEmail(email: string | null | undefined): boolean {
  return email ? PETUGAS_EMAILS.includes(email.trim().toLowerCase()) : false;
}
