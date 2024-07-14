// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {getStorage} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCsEIh8A6s8F1GPVlgPUu3un-SkESZXptY",
    authDomain: "bridgertondiamond.firebaseapp.com",
    projectId: "bridgertondiamond",
    storageBucket: "bridgertondiamond.appspot.com",
    messagingSenderId: "308231132078",
    appId: "1:308231132078:web:dd3c69c8431425c4732e3f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export { storage };