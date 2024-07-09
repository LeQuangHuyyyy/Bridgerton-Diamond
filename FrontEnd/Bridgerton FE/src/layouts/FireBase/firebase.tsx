import {initializeApp} from "firebase/app";
import {getStorage} from "firebase/storage"

const firebaseConfig = {
    apiKey: "AIzaSyCsEIh8A6s8F1GPVlgPUu3un-SkESZXptY",
    authDomain: "bridgertondiamond.firebaseapp.com",
    projectId: "bridgertondiamond",
    storageBucket: "bridgertondiamond.appspot.com",
    messagingSenderId: "308231132078",
    appId: "1:308231132078:web:dd3c69c8431425c4732e3f"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)