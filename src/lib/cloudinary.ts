import {
  v2 as cloudinary,
  type UploadApiOptions,
  type UploadApiResponse,
} from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

// Public IDs fixes : chaque nouvel upload écrase (overwrite) le même asset
// Cloudinary au lieu d'en créer un nouveau. Pour les CV, on veut une URL
// stable, sans numéro de version, qui ne change jamais après un nouvel
// upload. Ça ne marche de façon fiable QUE pour des public_id à la racine
// du compte (sans "/") - Cloudinary insère un faux "v1" pour les assets
// dans un dossier, qui ne résout pas toujours (404) selon la config
// d'invalidation du compte. D’où l’absence de dossier pour les CV ici.
export const PHOTO_PUBLIC_ID = "portfolio/about/photo";
export const CV_FR_PUBLIC_ID = "cv-fr";
export const CV_EN_PUBLIC_ID = "cv-en";

export function uploadBuffer(
  buffer: Buffer,
  options: UploadApiOptions
): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error || !result) {
        reject(error ?? new Error("Échec de l'upload Cloudinary."));
        return;
      }
      resolve(result);
    });
    stream.end(buffer);
  });
}

function stableCvUrl(publicId: string): string {
  return cloudinary.url(publicId, {
    resource_type: "image", // Cloudinary traite les PDF comme des "image"
    format: "pdf",
    secure: true,
  });
}

// À appeler depuis un Server Component (jamais depuis un Client Component :
// ça embarquerait le SDK Cloudinary et ses secrets côté navigateur).
export function getCvUrls() {
  return {
    fr: stableCvUrl(CV_FR_PUBLIC_ID),
    en: stableCvUrl(CV_EN_PUBLIC_ID),
  };
}