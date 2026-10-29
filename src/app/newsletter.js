import { collection, addDoc } from 'firebase/firestore'
import { db } from '../Config/firebaseConfig'

// Saves a newsletter sign-up. The footer loads this module, and Firebase with it,
// only when someone subscribes.
export function subscribe(email)
{
    return addDoc(collection(db, 'newsletter'), { email })
}
