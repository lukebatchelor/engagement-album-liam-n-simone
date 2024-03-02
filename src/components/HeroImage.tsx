import { useCallback, useState } from "react";

/* eslint-disable @next/next/no-img-element */
const images = [
  "/liam-n-simone-1-crop.jpg",
  "/liam-n-simone-2-crop.jpg",
  "/liam-n-simone-3-crop.jpg",
  "/liam-n-simone-4-crop.jpg",
];

export const HeroImage = function () {
  const [imgIndex, setImgIndex] = useState<number>(0);
  const onImgClick = useCallback(() => {
    setImgIndex((imgIndex) => (imgIndex + 1) % images.length);
  }, [setImgIndex]);
  return (
    <img
      onClick={onImgClick}
      src={images[imgIndex]}
      className="rounded-full object-scale-down"
      width="200"
      height="200"
      alt="A cute photo of the couple"
    />
  );
};
