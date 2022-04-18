import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import { getFirestore, doc, getDoc, setDoc} from "firebase/firestore";
import { useTranslation } from "react-i18next";
import { context } from "./App.js";

export default function Newsletter() {

  const [mailerState, setMailerState] = useState({
      sender: "L'ERMELLINO",
      email: "",
      subject: "ISCRIZIONE NEWSLETTER",
      message: "Resoconto del suo ordine eseguito il: giorno test " ,
      html: "<h1> Benvenuto nella newsletter dell'Ermellino! </h1> <br> Sarai sempre aggiornato sui nuovi arrivi ai nostri magazzini. <br> href='http://localhost:3000/test/'"      
  });

//Sezione dedicata alla newsletter
const [loading, setLoading] = useState(false);
const [email, setEmail] = useState('');
const [frase, setFrase] = useState('');
const [checkemail, setCheckemail] = useState('');
const [classstyle, setClassstyle] = useState('default');
const db = getFirestore();
const { t } = useTranslation();
const [buttontext,setbuttontext] = useState("");
const language = React.useContext(context);


//utilizza l'useContext per cambiare la lingua
useEffect(() => {
  if(language.language === 'en') {
    setbuttontext("Subscribe");
    console.log(language.language)
  }
  else {
    setbuttontext("Iscriviti");
    console.log(language.language)
  }
},[language]);

useEffect(() => {
  let regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if(!regEmail.test(email)){
  setCheckemail(false);
  }
  else 
  setCheckemail(true);
}, [email]);

async function subscribenewsletter() {

  if (checkemail) {
  setLoading(true)
  const docRef = doc(db, "newsletter", email);
  const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
          setLoading(false);
          setFrase("Email già presente nella nostra lista");
          setClassstyle("error");
      }  
      else {
          try {
            const docRef = await setDoc(doc(db, "newsletter", email), {
            }).then(() => {
              mailerState.email = email;
              mailerState.html = "<h1> Benvenuto nella newsletter dell'Ermellino! </h1> <br> Sarai sempre aggiornato sui nuovi arrivi ai nostri magazzini. <br> <a href='" + window.location.hostname + "/lermellino/deletesub/" + email + "'>Disiscriviti</a> <br> <br> <p> Copyright &copy; All Rights Reserved by ERMELLINO S.P.A. </p>";
              sendnewsletter();
              async function sendnewsletter () {
              const response = await fetch("https://hosteapitestlodux.herokuapp.com/"+process.env.REACT_APP_API_KEY, {
                method: "POST",
                headers : { 
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
                  },
                body: JSON.stringify({ mailerState }),
                })
                .then((res) => res.json())
                .then(async (res) => {
                  const resData = await res;
                  console.log(resData);
                  if (resData.status === "success") {
                   console.log("Message Sent");
                  } else if (resData.status === "fail") {
                   console.log("Message failed to send");
                  }
                })
                .then(() => {
                  setLoading(false);
                  if(language.language === 'en') {
                    setFrase("Thank you for subscribing to our newsletter, a confirmation email has been sent to your address!");
                  }
                  else {
                    setFrase("Grazie per esserti iscritto alla nostra newsletter, un email di conferma è stata mandata al tuo indirizzo!");
                  }
                    setClassstyle("success");
                    setEmail('')
                    });
                }
          })} catch (e) {
              setLoading(false);
              console.error("Error adding document: ", e);
          }
      }
  }

  else { 
    if(language.language === 'en') {
      setFrase("Email not valid");              
    }
    else {
      setFrase("Email non valida");
    }
  setClassstyle("error");
  }
}


  return (
    <div className="login__container">
                  <div className="headtext" style={{width:"100%"}}>
                    <span className="intro" style={{color: "#E05D5D", fontSize:"40px"}}>Newsletter</span>
                      </div>
                      <br />
                      <div className="newslettertext"> <p style={{textAlign:"initial"}}>
                      {t("Rimani sempre connesso e scopri tutte le novità dell'ERMELLINO, iscriviti alla nostra newsletter!")}</p>
                      </div>
                        <h5>{t("Inserisci il tuo indirizzo E-mail")}</h5>
                          <input style={{width:'100%',borderRadius:"inherit"}}
                            id="outlined-textareanam"
                            maxLength="30"
                            onChange={e => setEmail(e.target.value)}
                          />
                          <div style={{fontSize:"12px"}}>{t("Non condivideremo questa informazione con altri")}</div>
                          <div style={{textAlign:"end"}}>
                        <div className={classstyle} style={{textAlign:"start", fontSize:"20px", fontWeight:"900"}}> {frase} </div>
                      <Button onClick={subscribenewsletter} style={{color: "white"}} className='login__signInButton'> {loading ? <div className="load"></div> : buttontext}  </Button>
                    </div>
                <br />
              </div>
  )
}


