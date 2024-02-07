// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyB3Ydb30ttl_HXiK3wgJz8N239pc_mQLZ4',
  authDomain: 'carbontrack-a99b7.firebaseapp.com',
  projectId: 'carbontrack-a99b7',
  storageBucket: 'carbontrack-a99b7.appspot.com',
  messagingSenderId: '620675691389',
  appId: '1:620675691389:web:87768412a984ee340f1214',
  measurementId: 'G-K61Y9GMLQT'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// eslint-disable-next-line no-unused-vars
const analytics = getAnalytics(app);

export default app;
