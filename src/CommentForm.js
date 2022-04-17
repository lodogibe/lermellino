import React, {useState, useEffect } from "react";
import { getFirestore, collection, addDoc, doc, updateDoc } from "firebase/firestore";
import {useHistory} from "react-router-dom";
import { Button } from '@mui/material';
import { context } from "./App.js";

//dad e papa ID per riferimento replies

//

function CommentForm({name, idpost, type, email, iduser, initialText, functions,whatis ,iddad}) {

  const [text, setText] = useState(initialText);
  const db = getFirestore();
  let history = useHistory();
  const [alert,setAlertz] = useState('');
  const papaid = iddad;
  const what = whatis;
  const [textModi,setTextModi] = useState("");
  const [textAgg,setTextAgg] = useState("");
  const language = React.useContext(context);

  //utilizza l'useContext per cambiare la lingua
  useEffect(() => {
    if(language.language === 'en') {
      setTextModi("Update comment");
      setTextAgg("Add Comment");
    }
    else {
      setTextModi("Modifica commento");
      setTextAgg("Aggiungi commento");
    }
  },[language]);

  

  const onSubmit = (event) => {
  event.preventDefault();

  if (text != null) {
  if(text.length < 5 || name === null) {
      if (name === null ) {
        if(language.language === 'en') {
          setAlertz('You must login in order to leave a comments')
        }
        else
          setAlertz('Devi effettuare il login per poter commentare')
      }   
      else {
        if(language.language === 'en') {
          setAlertz('Text too short')
        }
        else
        setAlertz('Testo troppo corto')
      }
  }
  else {
  addComment(text, name, idpost, new Date, type, email, iduser)
  setText('');
  if (type === "edit" || type === "reply")
  functions();
  }
}
else {
  if(language.language === 'en') {
    setAlertz('Insert a comment')
  }
  else
  setAlertz('Inserisci un commento')
}
};  

const addComment = (text, name, idpost, Date, type, email, iduser) => { 

  switch (type) {

  case "comment":

      try {
      const docRef = addDoc(collection(db, "comments"), {
              Name: name,
              Text: text,
              Idpost: idpost,
              CreatedOn: Date,
              Email: email,  
              IDuser: iduser,
              whatis: "comments",
          }).then(() => {
            history.push(`/lermellino/pageproduct/${idpost}`)
          })} catch (e) {
              console.error("Error adding document: ", e);
            }  
            
  break;

  case "edit": 
  try {
  async function fetchMyedit() {
    const washingtonRef = doc(db, what, papaid);
    // Set the "capital" field of the city 'DC'
    await updateDoc(washingtonRef, {
      Text: text,
    })
  }
  
  fetchMyedit().then(() => {
    history.push(`/lermellino/pageproduct/${idpost}`)
  })
  } catch (e) {
    console.error("Error adding document: ", e);
  }  
  break;


  case "reply": 
  
  try {
    const docRef = addDoc(collection(db, "replies"), {
            Name: name,
            Text: text,
            Iddad: papaid,
            idpost: idpost,
            CreatedOn: Date,
            Email: email,  
            IDuser: iduser,
            whatis: "replies",
        }).then(() => {
          history.push(`/lermellino/pageproduct/${idpost}`)
        })} catch (e) {
            console.error("Error adding document: ", e);
          }  
  
  break;

  }
}
  
  return (
  <div className="comments">
    <div className="comment-form-title"></div>
    <form onSubmit={onSubmit}>
    <textarea
        className="comment-form-textarea"
        value={text}
        onChange={(e) =>{ setText(e.target.value); setAlertz('')}}
    />
   { alert !== '' && <div className="alert"> {alert} </div> }
    <Button variant="contained" onClick={onSubmit} >
    {type === "edit" ? textModi  : textAgg }
    </Button>
    </form>
    <div className="comments-container">

    </div>
</div>
)}

export default CommentForm
