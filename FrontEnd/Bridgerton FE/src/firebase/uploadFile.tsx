import {storage} from "./firebase";
import {ref, uploadBytes, getDownloadURL} from "firebase/storage";

const uploadFile = async (file: File) => {
    if (!file) return null;

    const storageRef = ref(storage, `BridgertonDiamond/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
};

export default uploadFile;
