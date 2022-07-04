import React, { useEffect, useState, memo } from "react";
import "./Home.css";
import Product from "./Product";
import { useLocation} from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAuth } from 'firebase/auth';
import { collection, getDocs, getFirestore, query, orderBy, where, doc, getDoc, setDoc, limit, startAfter} from "firebase/firestore";
import { getDatabase, ref, remove } from "firebase/database";
import { Button } from '@mui/material';
import { useStateValue } from "./StateProvider";
import Cookies from 'js-cookie';
import { useTranslation } from "react-i18next";
import { context } from "./App.js";
import Loader from "./Loader";
import background from "./image-background/image4.jpg";


//importo il context dall'app in modo di avere lo state impostato sull'app in modo che se rientro nell'home non riesce il pop-up (in caso di rifiuto di cookies ovviamente)

function Home() {

    const location = useLocation();

    const [{basket},dispatch] = useStateValue();
    const auth = getAuth();
    const db = getFirestore();
    const {products, setProduct} = React.useContext(context);
    const {lastProd, setLastProd} = React.useContext(context);
    const [loadProd, setLoadProd] = useState(false);
    const { showpop, setShowpop } = React.useContext(context);
    const [ checkpop, setCheckpop ] = useState('')
    const [email, setEmail] = useState('');
    const [frase, setFrase] = useState('test');
    const [checkemail, setCheckemail] = useState('');
    const [classstyle, setClassstyle] = useState('default');
    const [showloader, setShowloader] = useState(true);
    const { t } = useTranslation();
    const mailerState = {
        sender: "L'ERMELLINO",
        email: "",
        subject: "ISCRIZIONE NEWSLETTER",
        message: "Resoconto del suo ordine eseguito il: giorno test " ,
        html: "<h1> Benvenuto nella newsletter dell'Ermellino! </h1> <br> Sarai sempre aggiornato sui nuovi arrivi ai nostri magazzini. <br> href='http://localhost:3000/test/'"
    };
    const [loading,setLoading] = useState(false);
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

    console.log(showpop);

    /* RE-CROP DELLE IMMAGINE TRAMITE "IMAGEKIT" CHE VA A PESCARE DALLO STORAGE FIREBASE
    var url = 'https://firebasestorage.googleapis.com/v0/b/ermellino-34a69.appspot.com/o/images%2Fkangdm.jpg?alt=media&token=6f0cad1e-626c-4ec8-8c7c-4e1eaae48e8d';
    var newURL = url.split('https://firebasestorage.googleapis.com');
    console.log('https://ik.imagekit.io/l3um0lstzxmw/tr:w-900,h-900' + newURL[1]);
    */

    useEffect(() => {
        fetchMyAPI()
        async function fetchMyAPI() {
            const q = query(collection(db, "products"),where("State","==","DISPONIBILE"),orderBy("CreatedOn","asc"),limit(6));
            const querySnapshot =  await getDocs(q);
            const saveFirebaseTodos = [];
            querySnapshot.forEach((doc) => {
            saveFirebaseTodos.push(({id: doc.id, ...doc.data()}));
            console.log(doc.id, " => ", doc.data());
            setLastProd(doc.data().CreatedOn)
        });
        if(saveFirebaseTodos.length < 6) {
            setLastProd("")
        }
        setProduct(saveFirebaseTodos)
        setShowloader(false)
        }

        setTimeout(() => {
            if (!showpop) {
                if (Cookies.get('name') === "value")
                    {
                    console.log('no pop')
                    setShowpop(true);
                    setCheckpop(false);
                    }
                else {
                    setShowpop(true)
                    setCheckpop(true);
                    Cookies.set('name', 'value', { expires: 7 })
                    console.log(Cookies.get('name'))
                    }
                }
            }, 3000);
    }, [])

    function deletecookies() {
        Cookies.remove('name')
        setCheckpop(false);
    }

    async function subscribenewsletter() {
        setLoading(true);
        if (checkemail) {
        const docRef = doc(db, "newsletter", email);
        const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setFrase("Email già presente nella nostra lista");
                setClassstyle("error");
                setLoading(false);
            }

            else {
                try {
                    const docRef = await setDoc(doc(db, "newsletter", email), {
                        }).then(() => {
                            mailerState.email = email;
                            mailerState.html = "<h1> Benvenuto nella newsletter dell'Ermellino! </h1> <br> Sarai sempre aggiornato sui nuovi arrivi ai nostri magazzini. <br> <a href='https://marcog145.sg-host.com/?email=" + email + "'>Disiscriviti</a> <br> <br> <p> Copyright &copy; All Rights Reserved by ERMELLINO S.P.A. </p>";
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
                                    if(language.language === 'en') {
                                        setFrase("Thank you for subscribing to our newsletter, a confirmation email has been sent to your address!");
                                      }
                                      else {
                                        setFrase("Grazie per esserti iscritto alla nostra newsletter, un email di conferma è stata mandata al tuo indirizzo!");
                                      }
                                        setClassstyle("success");
                                        setEmail('')
                                        setLoading(false);
                                    });
                                }
                        })} catch (e) {
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

    useEffect(() => {
        let regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(!regEmail.test(email)){
        setCheckemail(false);
        }
        else
        setCheckemail(true);
    }, [email]);


    useEffect(() => {
        if (auth.currentUser !== null) {
             /* MOSTRA MESSAGGIO DOPO HISTORY PUSH,
            tengo un location.state undefined per assicarmi che lui nn cerchi di dare un valore a "location.state.fromLogin" del secondo if */
            if (location.state !== undefined) {

                if (location.state.fromLogin === 'signin') {
                    //doppia casistica in base alla lingua inserita verificata dal Contextprovider
                    var frasewelcome = "";
                    if(language.language == 'en') {
                        frasewelcome = "Welcome abord";
                    }
                      else {
                        frasewelcome = "Benvenuto/a a bordo";
                    }
                    toast.success(frasewelcome + " " + auth.currentUser.displayName,  {
                    position: "top-left",
                    autoClose: true,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined, })
                   }
                //dopo aver effettuato correttamente il pagamento, pop di conferma invio email con tutto il resoconto necessario
                else if (location.state.fromCheckout === true) {
                    toast.success(" Ordine effettuato con successo!, controlla la tua email per vedere la conferma dell'ordine",  {
                     position: "top-left",
                     autoClose: true,
                     hideProgressBar: false,
                     closeOnClick: true,
                     pauseOnHover: true,
                     draggable: true,
                     progress: undefined, })
                     dispatch({
                        type: 'CLEAR_BASKET'});
                        const dbr = getDatabase();
                        remove(ref(dbr, 'users/' + auth.currentUser.uid))
                    }
                //carrello svuotato per timeout operazioni, o perchè l'utente elimina tutti i prodotti nel carrello durante la fase finale di pagamento, inaccessibile con 0 prodotti nel carrello
                else if (location.state.fromCart === true) {
                    toast.warning(" Carrello svuotato, ripetere procedura",  {
                        position: "top-left",
                        autoClose: false,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined, })
                    }
                else
                {
                    var frasewelcome = "";
                    if(language.language == 'en') {
                        frasewelcome = "Welcome abord";
                    }
                    else {
                    frasewelcome = "Benvenuto/a a bordo";
                    }
                    toast.success(frasewelcome + " " + auth.currentUser.displayName,{
                    position: "top-left",
                    autoClose: true,
                    autoClose: true,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined, })
                }
            }
        }
    }, []);

    const showOtherprods = () => {
        setLoadProd(true)
        fetchMyAPI()
        async function fetchMyAPI() {
            const q = query(collection(db, "products"),where("State","==","DISPONIBILE"),orderBy("CreatedOn","asc"),startAfter(lastProd),limit(6));
            const querySnapshot =  await getDocs(q);
            const saveFirebaseTodos = [];
            querySnapshot.forEach((doc) => {
            saveFirebaseTodos.push(({id: doc.id, ...doc.data()}));
            /*console.log(doc.id, " => ", doc.data());*/
            setLastProd(doc.data().CreatedOn)
        });
            setLoadProd(false)
            setProduct(products.concat(saveFirebaseTodos)) //vado ad aggiornare l'array
            /*controllo che il numero di articoli scaricati rimanenti sia pari o inferiore al limite importo nella query,
            in modo da sapere di essere arrivato alla fine e che quindi bisogna nascondere il button di "mostra altro"*/
            console.log(saveFirebaseTodos.length)
            if(saveFirebaseTodos.length < 6) {
                setLastProd("")
            }
        }
    }

    console.log(lastProd)

    return (
        <div className="home">
            { showloader && <Loader /> } {/* loader di inizializzazione */}
            <div className="home__container">
            { checkpop &&
                <div className="overlay" style={{backgroundColor:"#0000008c"}}>
                    <div className="popup">
                        <div className="login__container">
                        <div className="close"  onClick={() => setCheckpop(false)} > &times; </div>
                        <div className="headtext" style={{width:"100%"}}>
                            <span className="intro" style={{color: "#E05D5D", fontSize:"40px"}}>Newsletter</span>
                                </div>
                                    <br />
                                    <div className="newslettertext">
                                    <li style={{textAlign:"initial",listStyle:"none"}}>
                                        {t("Rimani sempre connesso e scopri tutte le novità dell'ERMELLINO, iscriviti alla nostra newsletter!")}</li>
                                    </div>
                                        <h5>{t("Inserisci il tuo indirizzo E-mail")}</h5>
                                            <input style={{width:'100%',borderRadius:"inherit"}}
                                                id="outlined-textareaname"
                                                maxLength="30"
                                                value={email} onChange={e => setEmail(e.target.value)}
                                            />
                                        <div style={{fontSize:"12px"}}>{t("Non condivideremo questa informazione con altri")}</div>
                                        <br />
                                                <div style={{textAlign:"end"}}>
                                                    <div className={classstyle} style={{textAlign:"start", fontSize:"20px", fontWeight:"900"}}> {frase} </div>
                                                    <Button onClick={subscribenewsletter} style={{color: "white"}} className='login__signInButton'> {loading ? '...' : buttontext}  </Button>
                                                </div>
                                            <div className="cookiebar">
                                            <p>{t("Questo sito utilizza cookie tecnici, analytics e di terze parti.")} <br /> {t("Proseguendo nella navigazione accetti l’utilizzo dei cookie.")}</p>
                                        <div className="cookiebar-buttons">
                                    <button  onClick={() => setCheckpop(false)} style={{width:"109px"}}> {t("ACCETTA")} </button> <button onClick={deletecookies} style={{width:"109px"}}> {t("RIFIUTA")} </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                }

                <div className="footerdistance" style={{minHeight:"1000px"}}>
                <img className="home__photo" src={background} alt="" />

                <div className="home__row">

                <div className='text-on-image'>
                <p className="vintage vintage__top">{t("Acquista o noleggia articoli usati con l'Ermellino ... ")} <br /> {t("... e vedrai che non te ne pentirai")}</p>
                <p className="vintage vintage__bot">{t("Acquista o noleggia articoli usati con l'Ermellino ... ")} <br /> {t("... e vedrai che non te ne pentirai")}</p>
                </div>

                {/*Qui invece dopo il click "mostra tutti i prodotti" faccio un render di tutti i prodotti, giusto per inserire funzionalità*/}
                {products.map((value, key) =>
                    <Product
                    key={key}
                    id={value.id}
                    idowner={value.IDowner}
                    tipo={value.Type}
                    title={value.Name}
                    preview={value.Preview}
                    titleEN={value.NameEN}
                    previewEN={value.PreviewEN}
                    price={value.Price}
                    priceday={value.Priceday}
                    city={value.City}
                    image={value.Img}/>
                )}
                </div>
                {lastProd !== "" && loadProd === false &&
                <Button variant="contained" style= {{backgroundColor: "white",color: "black"}}  onClick={() => showOtherprods()}  > {t("Mostra tutti i prodotti")} &nbsp; <i className="fa fa-angle-down" style={{fontSize:"20px"}}></i> </Button> || loadProd === true && <div className="lds-ring"><div></div><div></div><div></div><div></div></div> }
            </div>
        </div>
    </div>
    )
}

export default memo(Home)


