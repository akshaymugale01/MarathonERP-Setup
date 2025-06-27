import { useState } from "react";

type ImageState = {
  [key: string]: File[];
};

export default function useImageUpload() {
  const [images, setImages] = useState<ImageState>({});

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setImages((prev) => ({ ...prev, [key]: files }));
    }
  };

  return { images, handleImageUpload };
}