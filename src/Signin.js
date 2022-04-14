import React, { useState, useEffect } from 'react';
import './Signin.css';
import logo from './logo.png';
import {Link, useHistory} from "react-router-dom";
import { Button } from '@mui/material';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.min.css";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import {getAuth, sendEmailVerification, createUserWithEmailAndPassword, updateProfile, FacebookAuthProvider, signInWithPopup,  GoogleAuthProvider, signOut} from 'firebase/auth';
import { useTranslation } from "react-i18next";
import { context } from "./App.js";


function Signin() {
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [loading, setLoading] = useState(false);
let history = useHistory();
const provider = new GoogleAuthProvider();
const providerf = new FacebookAuthProvider();
const auth = getAuth();
const { t } = useTranslation();
const [buttontext,setbuttontext] = useState("");
const language = React.useContext(context);

console.log(language.language)

//utilizza l'useContext per cambiare la lingua
useEffect(() => {
  if(language.language === 'en') {
    setbuttontext("Sign In");
  }
  else {
    setbuttontext("Registrati");
  }
},[language]);
 
//Setting per mostrare nascondere la password con l'icon
const [values, setValues] = useState({
    password: "",
    showPassword: false,
  });
  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };


//variabile di riassegnazione per far apparire il messaggio di benvenuto
const location = {
    pathname: '/',
    state: { fromLogin: 'signin' }
  }


const facebook = e => {

    const auth = getAuth();
    signInWithPopup(auth, providerf)
      .then((result) => {
        // The signed-in user info.
        const user = result.user;

        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        const credential = FacebookAuthProvider.credentialFromResult(result);
        const accessToken = credential.accessToken;
        history.push(location)
        // ...
      })
      .catch((error) => {
        

        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;

        toast.error("Email associata al tuo account facebook già presente in lista", {
            position: "top-left",
            autoClose: true,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            });
        // The AuthCredential type that was used.
        const credential = FacebookAuthProvider.credentialFromError(error);
        // ...
      });
}


const google = e => {
  
    signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      history.push(location)
      // ...
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The AuthCredential type that was used.
      toast.error("Email associata al tuo account google già presente in lista", {
        position: "top-left",
        autoClose: true,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        });
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    }) }



    //registra
const register = e => {

    if (name !== "" && name.length > 5 ) {

    setLoading(true);
    createUserWithEmailAndPassword(auth, email, password)
    .then(() => { 
        updateProfile(auth.currentUser, {
            displayName: name
          }).then(() => {
            sendEmailVerification(auth.currentUser)
            toast.success("Un email di verifica è stata mandata all'indirizzo " + email, {
                position: "top-left",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                });
            signOut(auth)
            setTimeout(() =>
            history.push("/login"),5000)
        })
    }).catch((e) => 
    
    { switch (e.message) {
        case 'Firebase: Error (auth/email-already-in-use).' :
            toast.error("Email già presente nella nostra lista",  {
                position: "top-left",
                autoClose: true,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined, })

            break;
        case 'Firebase: Error (auth/invalid-email).' :
            toast.error("Email inserita non valida",  {
                position: "top-left",
                autoClose: true,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined, })
            break;
        case 'Firebase: Password should be at least 6 characters (auth/weak-password).' :
                toast.warn('La password deve contenere almeno 6 caratteri', {
                    position: "top-left",
                    autoClose: true,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    });
                break;   
        default:
            alert(e.message)
    }}) 
    
    
    .finally(() => setLoading(false))
    }

    else {
        toast.warn('Metti un nome contenente almeno 4 lettere', {
            position: "top-left",
            autoClose: true,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            });
        }
}

    return (
      <div className="demo-signin">
      <div className="signin-content">
        <div className='signin'>
            <Link to="/">
            <img className="signin_logo"
            src={logo} alt="logo"  width="160" height="118" />
            </Link>      
            
        
        <div className="signin__container">
        <div className="headtext" style={{width:"100%"}}>
        <span className="intro" style={{color: "#E05D5D", fontSize:"40px"}}>{t("Registrati")}</span>
            </div>

            <h5>{t("Nome")}</h5>
            <input style={{width:'100%',borderRadius: "inherit",backgroundColor: "#fff",borderRadius: "5px"}}
                    autoComplete="yes"
                      id="outlined-textareaname"
                      name='Name'
                      inputprops={{
                        maxLength: 16,
                      }}
                      value={name} onChange={e => setName(e.target.value)}
                    />
                {/*<input type='text'  name='name' value={name} onChange={e => setName(e.target.value)} />*/}

                <h5>E-mail</h5>
                <input style={{width:'100%',borderRadius: "inherit",backgroundColor: "#fff"}}
                      id="outlined-textareaname 2"
                      maxLength="30"
                      value={email} onChange={e => setEmail(e.target.value)}
                    />
                 {/*<input type='text'  name='email' value={email} onChange={e => setEmail(e.target.value)} />*/}
 
                <h5>Password</h5>
               <div className="password"> 
                <input  style={{width:'100%',backgroundColor:"white",borderRadius: "5px"}}
                        value={password} onChange={e => setPassword(e.target.value)}    
                        type={values.showPassword ? "text" : "password"}
  
                />
                <div className="visibilty">
                 {values.showPassword ? <Visibility  onClick={handleClickShowPassword}
                 onMouseDown={handleMouseDownPassword}/> : <VisibilityOff  onClick={handleClickShowPassword}
                 onMouseDown={handleMouseDownPassword} /> }
                 </div>
            </div>
                <Button  style={{color: "#1877f2", marginBottom: "9px",borderRadius: "7px",marginTop: "25px", border: "2px solid", backgroundColor: "#fff"}} onClick={register}  type="submit"  className='signin__registerButton'> {loading ?  <div className="load"></div> : buttontext} </Button>

                <p>
                    {t("Una volta eseguita la registrazione sarai d'accordo con le condizioni di Uso & Vendita del L'ERMELLINO. La preghiamo quindi di andare a verificare le nostre informative riguardo la Privacy e l'utilizzo di Cookies.")}
                </p>
                
                <Button onClick={google}   style={{backgroundColor: "white", color: "red", marginBottom: "9px",marginBottom: "9px",borderRadius: "7px", width: "175px" , alignSelf: "center"}} variant="contained" size="medium"> Google login </Button>
                
                <Button  onClick={facebook} style={{backgroundColor: "#1877f2", color: "#fff", marginBottom: "9px",marginBottom: "9px",borderRadius: "7px", lineHeight: "inerith", width: "175px" , alignSelf: "center"}} variant="contained" size="medium"> Facebook login </Button>

                <div className="registrazione"> <p> {t("Hai gia un account?")} </p>
                <Link to="/login">
                    {t("fai il login")}!
                </Link>
                </div>
                </div>
        </div>
        </div>
        </div>
    )
};

export default Signin;
