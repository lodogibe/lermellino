import React, { useState, useEffect } from "react";
import background from './image-background/image2.jpg';
import './Contacts.css';
import { Button } from '@mui/material';
import Newsletter from "./Newsletter";
import { useTranslation } from "react-i18next";
import { context } from "./App.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF } from "@fortawesome/free-brands-svg-icons";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaPhone } from "react-icons/fa";
import { FaEnvelope } from "react-icons/fa";

export default function Contacts() {

  const [loading, setLoading] = useState(false);
  const [checkemail, setCheckemail] = useState('');
  const [classstyle, setClassstyle] = useState('default');
  const { t } = useTranslation();
  const [mailerState, setMailerState] = useState({
    sender: "L'ERMELLINO",
    name: "",
    email: "",
    subject: "Informazione",
    message: "Resoconto del suo ordine eseguito il: giorno test" ,
    html: "<h1> Test da TEST.js ERMELLINO </h1>",
  });
  const [buttontext,setbuttontext] = useState("");
  const language = React.useContext(context);


  //utilizza l'useContext per cambiare la lingua
  useEffect(() => {
    if(language.language ==='en') {
      setbuttontext("Send message!");
      console.log(language.language)
    }
    else {
      setbuttontext("Invia messaggio!");
      console.log(language.language)
    }
  },[language]);




  function handleStateChange(e) {
    setMailerState((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  }


  //sezione dedicata alla richiesta informazione tramite il FORM

  const [fraseinfo, setFraseinfo] = useState('test');

  //verifico che l'email inserita sia valida tramite questo metodo di verifica
  useEffect(() => {
    let regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!regEmail.test(mailerState.email)){
    setCheckemail(false);
    }
    else 
    setCheckemail(true);
}, [mailerState.email]);

/*
TRANSLATION A MIA API SU HEROKU
*/

const TransState = {
  text: "",
};

const sendTrans = async (e) => {
  e.preventDefault();
  TransState.text = "Ciao amici miei"
  console.log({ TransState});
  const response = await fetch("https://hosteapitestlodux.herokuapp.com/tran", {
    method: "POST",
    headers : { 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
      },
    body: JSON.stringify({ TransState}),
  })
  .then((response) => response.json())
  .then((data) => console.log(data)) ;}

//va a richiamare l'email all'API mandandoli i dati necessari
const sendEmail = async (e) => {
  setLoading(true)
  if (checkemail) {
  e.preventDefault();
  console.log({ mailerState});
  mailerState.html = "<h1> Richiesta informazione da parte di: " + mailerState.name + " </h1> che richiede la seguente informazione  <br> " + mailerState.message + "  <br> <br> <p> Copyright &copy; All Rights Reserved by ERMELLINO S.P.A. </p>";
  const response = await fetch("https://hosteapitestlodux.herokuapp.com/"+process.env.REACT_APP_API_KEY, {
    method: "POST",
    headers : { 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
      },
    body: JSON.stringify({ mailerState}),
  })
    .then((res) => res.json())
    .then(async (res) => {
      const resData = await res;
      console.log(resData);
      if (resData.status === "success") {
        if(language.language ==='en') {
          setFraseinfo("Message sent successfully!");
        }
        else {
          setFraseinfo("Messaggio mandato correttamente!");
        }
          setClassstyle("emailref"); /*tengo un colore unico per qualsiasi risultato, ma tengo un margine*/
          setMailerState({
            email: "",
            name: "",
            message: "",
          })
      } else if (resData.status === "fail") {
        if(language.language ==='en') {
          setFraseinfo("Message sent successfully!");
        }
        else {
          setFraseinfo("There was an error, please double check the data entered, or try again later");
        }
        setClassstyle("emailref");
      }
    })
    .then(() => {
      setLoading(false)
      setMailerState({
        email: "",
        name: "",
        message: "",
      });
    });
  }
  else {
    if(language.language ==='en') {
      setFraseinfo("Email not valid");              
    }
    else {
      setFraseinfo("Email non valida");
    }
  setClassstyle("error");
  setLoading(false)
  }
};


return <div className='contacts' style={{minHeight:"100%"}}>
          <img className="home__photo" src={background} alt="" />     
            <div className="footerdistance" style={{minHeight:"1000px"}}>   
              <div className="home__row" style={{display:"block", marginTop:"-55%", textAlign: "-webkit-center"}}>             
                <div className='text-on-image first'>
                  <p className="vintage vintage__top"> </p>
                  <p className="vintage vintage__bot" style={{fontSize: "calc(9vh + 20px)"}}>{t("Contatti")}</p>
                </div>

              
                  
<div className="contact-wrapper">


    <div className="direct-contact-container">

      <ul className="contact-list">
        <li className="list-item"><i> <FaMapMarkerAlt /> Sede legale: Via Angelo Duro, 3 - 20139 Milano </i></li>

        <li className="list-item"><i> <FaMapMarkerAlt /> Sede operativa: Via Spessa del Po, 8 - 20139 Milano </i></li>

        <li className="list-item"><i> <FaMapMarkerAlt /> Sede operativa: Via Gladiatore, 10 - 20139 Roma </i></li>
        
        <li className="list-item"><i> <FaPhone />  02 89763234</i></li>
        
        <li className="list-item"><i> <FaEnvelope /> lermellino@gmail.com</i></li>
        
      </ul>

      <hr />
      <div className="col-md-4 col-sm-6 col-xs-12" style={{textAlign:"center"}}>
          <ul className="social-icons">
            <li><a className="facebook" style={{backgroundColor:"black"}} href="#"><FontAwesomeIcon icon={faFacebookF} /></a></li>
            <li><a className="instagram" style={{backgroundColor:"black"}} href="#"><FontAwesomeIcon icon={faInstagram} /></a></li>  
          </ul>
        </div>
      <hr />

      <div className="copyright">&copy; All Rights Reserved by ERMELLINO S.P.A. </div>
        </div>
          <div className="vl"></div>
          <Newsletter />

          </div>
          
                {/* PARTE RICHIESTA INFO*/}
          <form>      
          <div className="headtext contact" style={{ position: "relative"}}>
            <span className="intro" style={{color: "#E05D5D", fontSize:"40px"}}> {t("Per ulteriori informazione compila il form qui sotto")} </span>
              </div>

                <div className="login-content" style={{marginTop: "1%",color: "#fff8e5"}}>
                  <div className='login'>
                    <div className="login__container" style={{backgroundColor: "#e05d5d", borderColor:"#fff8e5", textAlign: "justify"}}>
                      <h5>Nome</h5>
                        <div className="password"> 
                          <input style={{width:'100%',backgroundColor:"white",borderRadius: "5px"}}
                            placeholder="Name"
                            onChange={handleStateChange}
                            name="Name"
                            value={mailerState.nome}
                            maxLength="30"
                          />
                        </div>   
                      <h5>E-mail</h5>
                        <input style={{width:'100%',borderRadius: "inherit"}}
                          placeholder="Email"
                          onChange={handleStateChange}
                          value={mailerState.email}
                          name="email"
                          maxLength="30"
                        />
                      <h5>{t("Messaggio")}</h5>
                        <textarea
                          style={{ minHeight: "200px", width:'100%',borderRadius: "inherit"}}
                          placeholder={t("Scrivi il tuo messaggio...")}
                          onChange={handleStateChange}
                          name="message"
                          value={mailerState.messaggio}
                        />
                        <div className={classstyle} style={{textAlign:"start", fontSize:"20px", fontWeight:"900"}}> {fraseinfo} </div>
                      <Button onClick={sendEmail} style={{color: "white"}} id='emailbutton' className='login__signInButton'> {loading ? <div className="load"></div> : buttontext}  </Button>
                    </div>
                  </div>
                </div>
                </form>

              </div>
            </div> 
          </div>;
}
