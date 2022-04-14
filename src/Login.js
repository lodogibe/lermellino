import React, { useState, useEffect  } from 'react';
import './Login.css';
import logo from './logo.png';
import {Link, useHistory} from "react-router-dom";
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth';
import { Button } from '@mui/material';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.min.css";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { useTranslation } from "react-i18next";
import { context } from "./App.js";

function Login() {

const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [loading, setLoading] = useState(false);
let history = useHistory();
const auth = getAuth();
const { t } = useTranslation();
const [buttontext,setbuttontext] = useState("");
const language = React.useContext(context);

console.log(language.language)

//utilizza l'useContext per cambiare la lingua
useEffect(() => {
  if(language.language === 'en') {
    setbuttontext("Login");
    console.log(language.language)
  }
  else {
    setbuttontext("Accedi");
    console.log(language.language)
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
    state: { fromLogin: true }
  }

const logIn = () => {
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
    .then(() => { history.push(location)
    }).catch((e) => { switch (e.message) {
        case 'Firebase: Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. (auth/too-many-requests).' :                         
            toast.error("Troppi tentativi di accesso sono stati tentati con questa email. Reimposta la tua password, o riprova più tardi. ",  {
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

        case 'Firebase: Error (auth/user-not-found).' :
                toast.warn("Utente non trovato",  {
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
} 


    return (
        <div className="demo-login">
        <div className="login-content">
        <div className='login'>

            <Link to="/">
            <img className="login_logo"
            src={logo} alt="logo"  width="160" height="118" />
            </Link>      
       
           

        <div className="login__container">
        <div className="headtext" style={{width:"100%"}}>
        <span className="intro" style={{color: "#E05D5D", fontSize:"40px"}}>{t("Accedi")}</span>
            </div>

            
            <h5>E-mail</h5>
                <input style={{width:'100%',borderRadius: "inherit"}}
                      id="outlined-textareaname"
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
            
                <div className="resetpass">
                    <Link to="./resetpassword">
                   {t("Password dimenticata?")}
                    </Link>
                </div>
                <Button onClick={logIn} style={{color: "white"}} className='login__signInButton'>  {loading ?  <div className="load"></div> : buttontext } </Button>
                <p>
                    {t("Una volta eseguito il Login sarai d'accordo con le condizioni di Uso & Vendita del L'ERMELLINO. La preghiamo quindi di andare a verificare le nostre informative riguardo la Privacy e l'utilizzo di Cookies.")}
                </p>
           

                <div className="registrazione"> <p> {t("Non ti sei ancora registrato/a")} ? </p>
                <Link to="./signin">
                <Button style={{color: "#1877f2", marginBottom: "9px",borderRadius: "7px", border: "2px solid", backgroundColor: "#fff"}} type="submit"  className='signin__registerButton'> {t("Registrati")} </Button>
                </Link>
                </div> 
        </div>
        </div>
        </div>
        </div>
    )
};

export default Login;
