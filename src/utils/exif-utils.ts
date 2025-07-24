
import ExifReader from "exifreader";


async function getTags(file: File){

    return await ExifReader.load(file, { expanded: true });
};

export async function getGPS(file: File){

    const { gps } = await getTags(file);
        return gps;
}

export async function getExif(file: File){
    const { exif } = await getTags(file);

    return exif;
}