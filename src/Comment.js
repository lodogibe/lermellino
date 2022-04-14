import React, {useState, useEffect} from 'react'
import CommentForm from "./CommentForm";
import {getFirestore, doc, deleteDoc,  query,  where, collection, getDocs} from "firebase/firestore";
import { confirmAlert } from 'react-confirm-alert';
import { getAuth} from 'firebase/auth';
import { useLocation, useHistory } from "react-router-dom";
import icon from './user-icon.png';
import { useTranslation } from "react-i18next";
import { context } from "./App.js";



function Comment({id,idprodowner,comment,idowner,nameowner,date,name,idpost,email,iduser, whatis,iddad, loadcomment}) {


const [replies,setReplies] = useState([])
const [isEditing,setIsediting] = useState(false)
const [isReplying,setIsreplying] = useState(false)
const dates = new Intl.DateTimeFormat('eu-EU', { year: 'numeric', month: '2-digit', day: '2-digit'}).format(date*1000)
const db = getFirestore();
const auth = getAuth();
const user = auth.currentUser;
const location = useLocation();
let history = useHistory();
const { t, i18n } = useTranslation();
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



useEffect(() => {
    getCommentsReplies();
    async function getCommentsReplies() {
        const q = query(collection(db, "replies"),where("Iddad","==", id));
        const querySnapshot =  await getDocs(q);
        const saveFirebaseTodos = []; 
        querySnapshot.forEach((doc) => {
        saveFirebaseTodos.push(({id: doc.id, ...doc.data()}));
    });
    console.log(saveFirebaseTodos)
    setReplies(saveFirebaseTodos)
   }

  
}, [location])



 
console.log(dates);


    const replyComment = () => {
      setIsreplying(true)
      setIsediting(false)
      if (isReplying === true)
      setIsreplying(false)
    }

    const updateComment = () => {
      setIsediting(true)
      setIsreplying(false)
      if (isEditing === true)
      setIsediting(false)
    }

    const deleteComment = () => {

      confirmAlert({
        message: 'Sei sicuro di voler eliminare il tuo commento?',
        buttons: [
          {
            label: 'Yes',
            onClick: () =>   fetchMydelete().then(() => {
              if (whatis === "comments") {
                history.push(`/pageproduct/${idpost}`)
              }
            else {
              history.push(`/pageproduct/${idpost}`) }}) 
          },
          {
            label: 'No',
          }
        ]
      });

      async function fetchMydelete() {
      await deleteDoc(doc(db, whatis, id));
      }        
    }

    console.log(id,whatis,comment,idowner,nameowner,name,idpost,email,iduser,iddad)
    return (
        <div>
             <div key={id} className={`comment ${whatis==="replies" ? "replic" : ""}`}>
      <div className="comment-image-container">
        <img src={icon} style={{width:"32px"}}/>
      </div>
      <div className="comment-right-part">
        <div className="comment-content">
          <div className="comment-author">{nameowner}</div>
          <div style={{color:"rgb(0 161 157)"}}> {dates} </div>
          
        </div>
        <div style={{textAlign:"initial", fontWeight: "600",fontSize: "small"}}>ID:{idowner}</div>
        {!isEditing && <div className="comment-text">{comment}</div>}
        {isEditing && (
          <CommentForm 
          onClick={() =>
            updateComment()
           }
          name = {name}
          initialText = {comment} 
          type = 'edit'
          email = {email}
          iduser = {iduser}
          idpost = {idpost}
          functions = {updateComment}
          whatis = {whatis}
          iddad = {id} 
          loadcomment = {loadcomment} /> 
        )}
        <div className="comment-actions">
          
            <div
              className="comment-action"
              onClick={() =>
                replyComment()
              }
            >
              {t("Rispondi")}
            </div>
        
          {idowner === iduser && (
            <div
              className="comment-action"
              onClick={() =>
               updateComment()
              }
            >
              {t("Modifica")}
            </div>
          )}
          {idowner === iduser && (
            <div
              className="comment-action"
              onClick={() => deleteComment()}
            >
              {t("Elimina")}
            </div>
          )}
        </div>
        {isReplying && (
          <CommentForm 
          name = {name}
          type = 'reply'
          email = {email}
          idpost = {idpost}
          iduser = {iduser}
          functions = {replyComment}
          whatis = 'replies'
          iddad = {id}
          loadcomment = {loadcomment}
          /> 
        )}
        {replies.length > 0 && (
          <div className="replies">
             {replies.map((value,key) => (
            <Comment
            key = {key}
            id = {value.id}
            //replies= {replies}
            idprodowner = {idprodowner}
            comment = {value.Text}
            idowner = {value.IDuser}
            nameowner = {value.Name} 
            date = {value.CreatedOn.seconds}
            name = {user && user.displayName}
            idpost = {idpost}
            email = {email}
            iduser = {iduser}
            whatis = 'replies'
            iddad = {id}
            loadcomment = {loadcomment}
          /> ))}
          </div>
        )}
      </div>
    </div>
</div>
    )
}

export default Comment
