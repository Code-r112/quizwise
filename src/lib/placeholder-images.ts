import data from './placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

export const placeholderImagesData: { placeholderImages: ImagePlaceholder[] } = data;

export const placeholderImages: ImagePlaceholder[] = placeholderImagesData.placeholderImages;
