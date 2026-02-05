import ExifReader from "exifreader";

async function getTags(file: File) {
  return await ExifReader.load(file, { expanded: true });
}

export async function getGPS(file: File): Promise<ExifReader.GpsTags | null> {
  const { gps } = await getTags(file);
  return gps ?? null;
}

export async function getExif(
  file: File,
): Promise<ExifReader.ExpandedTags | null> {
  const { exif } = await getTags(file);
  return exif ?? null;
}
