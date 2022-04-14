import React, { useEffect, useState} from 'react';
import { useParams} from "react-router-dom";
import { getFirestore, doc, deleteDoc, getDoc} from "firebase/firestore";
import Newsletter from './Newsletter';



export default function DeleteSub() {

        let { email } = useParams();
        const db = getFirestore();
        const [response,setResponse] = useState("");

        useEffect(() => {

            getEmail();
            async function getEmail() {

                const docRef = doc(db, "newsletter", email);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                console.log("Document data:", docSnap.data());
                deleteDoc(doc(db, "newsletter", email))
                setResponse("La tua email è stata rimossa correttamente dal nostro database, non riceverai più le nostre news")
                } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
                setResponse("La tua email non è più presente nei nostri database")
                }
            }
       
        }, [])
    

  return (
    <div>DeleteSub {email} <h1>{response}</h1> </div>
    
  )
}
