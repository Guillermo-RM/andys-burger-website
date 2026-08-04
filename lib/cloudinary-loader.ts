type CloudinaryLoaderProps = {
  src: string;
  width: number;
  quality?: number;
};

const uploadSegment = "/image/upload/";

export function addCloudinaryTransform(
  src: string,
  transformations: string[],
) {
  if (!src.includes(uploadSegment)) {
    return src;
  }

  return src.replace(
    uploadSegment,
    `${uploadSegment}${transformations.join("/")}/`,
  );
}

export function createCloudinarySeoImage(
  src: string,
  width: number,
  height: number,
) {
  return addCloudinaryTransform(src, [
    "f_auto",
    "q_auto",
    `c_fill,g_auto,w_${width},h_${height}`,
  ]);
}

export function createCloudinarySocialImage(
  src: string,
  width: number,
  height: number,
) {
  return addCloudinaryTransform(src, [
    "f_jpg",
    "q_auto",
    `c_fill,g_auto,w_${width},h_${height}`,
  ]);
}

export default function cloudinaryLoader({
  src,
  width,
  quality,
}: CloudinaryLoaderProps) {
  return addCloudinaryTransform(src, [
    "f_auto",
    quality ? `q_${quality}` : "q_auto",
    `c_limit,w_${width}`,
  ]);
}
