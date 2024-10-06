/** @type {import('next').NextConfig} */

const nextConfig = {
    env: {
      NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
      NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET: 'user_uploads',
    },
    images: {
      domains: ['res.cloudinary.com'],
    },
  };
  
  export default nextConfig;