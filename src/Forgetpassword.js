import React , { useState } from 'react';
import './Forgetpassword.css';
import logo from './logo.png';
import {Link, useHistory} from "react-router-dom";
import {getAuth, sendPasswordResetEmail} from 'firebase/auth';
import { Button } from '@mui/material';
import TextField from '@mui/material/TextField';

function Forgetpassword() {
    const [showText, setShowText] = useState(false);
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    let history = useHistory();
    
    
    const Text = () => <div style={{color:'green'}}>Email inviata, ora verrai reindirizzato al login! </div>
    ;
    
    
    const resetpassword = e => {
        setLoading(true);
        const auth = getAuth();

    
        sendPasswordResetEmail(auth,email)
        .then(() => { 
            setShowText(true);
            
            setTimeout(() =>
            history.push("/login"),3000)
    
        }).catch((e) => alert(e.message))
        .finally(() => setLoading(false))
    
    } 
    
    return (
        <div className="demo_resetpassword">
        <div className='resetpassword' style={{marginTop: "5%"}}>
             <Link to="/">
            <img className="login_logo"
            src={logo} alt="logo"  width="160" height="118" />
            </Link>      
       

        <div className="resetpassword__container">
        <span className="intro" style={{color: "#E05D5D", fontSize:"40px", transform: "rotate(-1deg)"}}>Recupera password</span>

            
            <h5>E-mail</h5>
                <input style={{width:'100%',borderRadius: "inherit"}}
                      id="outlined-textareaname"
                      maxLength="30"
                      value={email} onChange={e => setEmail(e.target.value)}
                    />


                <Button onClick={resetpassword} style={{color: "white",lineHeight:"17px",height:"auto",width:"auto"}} className='login__signInButton'>  {loading ? '... invio in corso ...' : 'Invia modulo'}  </Button>

                <div>
                        {showText ? <Text /> : null}
                </div>
                <p>
                    Una volta premuto invio riceverai via email tutte le indicazioni necessarie per il recupero password del tuo account.
                </p>
            </div>
            </div>
        </div>
    )
}

export default Forgetpassword
