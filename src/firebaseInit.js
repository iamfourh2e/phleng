import firebase from 'firebase'
import 'firebase/firestore'
const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDKWLyLqfTKZAnqPltUaPPGohFQQ2DHzFs",
    authDomain: "phleng-c9c54.firebaseapp.com",
    databaseURL: "https://phleng-c9c54.firebaseio.com",
    projectId: "phleng-c9c54",
    storageBucket: "phleng-c9c54.appspot.com",
    messagingSenderId: "491160555387"
})
export default {
    db: firebaseApp.firestore(),
    storage: firebaseApp.storage(),
    storageState: firebase.storage.TaskState
}
