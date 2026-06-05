export interface MakeupPhotoInput {
  id: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  source: 'admin-upload' | 'fixture' | 'import';
  imageUrl?: string;
  uploadedBy?: string;
  uploadedAt?: string;
}
