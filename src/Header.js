import React, { useState, useEffect } from 'react';
import './Header.css';
import logo from './logo.png';
import SavedSearchIcon from '@mui/icons-material/SavedSearch';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import {Link, useHistory, useLocation} from "react-router-dom";
import { useStateValue } from "./StateProvider";
import { getAuth, signOut, onAuthStateChanged, sendEmailVerification, deleteUser} from 'firebase/auth';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Button } from '@mui/material';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.min.css";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import './icon.css';
import "./i18n";
import Cookies from 'js-cookie';
import { useTranslation } from "react-i18next";
import { getDatabase, ref, child, get } from "firebase/database";
import { context } from "./App.js";
import background from "./image-background/redback.jpg"



function Header() {
    
    const auth = getAuth();
    const user = auth.currentUser;
    const [{basket},dispatch] = useStateValue();
    const [isSignedin, setisSignedin] = useState(true)
    let history = useHistory();
    const [anchorEl, setAnchorEl] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const open = Boolean(anchorEl);
    const [showResults, setShowResults] = useState(false);
    const allcart = [];
    let location = useLocation();
    const { t, i18n } = useTranslation();
    const [classheader,setClassheader] = useState('header');
    const [classmenu,setClassmenu] = useState('menuham');
    const {language, setLanguage} = React.useContext(context);

    console.log(language)

    function classMenu () {
      if (classheader === 'header') {
        setClassheader('header open')
        setClassmenu('menuham active')
      }
      else {
        setClassheader('header')
        setClassmenu('menuham')
      }
    }
    
    
    //Setto i cookies con la lingua impostata dall'utente e con l'useeffect gli e la imposto automaticamente in modo che dal suo pc si possa ritrovare la lingua gia impostata in precedenza
    function cookieslan (lan) {
      Cookies.set('lan', lan);  
    }

    //inizializza il sito con la lingua salvata nell'ultimo cookies in modo da far trovare l'utente con la lingua impostata precedentemente
    useEffect(() => {
      if(Cookies.get('lan') !== "")
      i18n.changeLanguage(Cookies.get('lan'))
    //va a settare la lingua nel USECONTEXT in modo da switchare correttamente anche tutti gli altri elementi nella lingua rilevata dai cookies
      setLanguage(Cookies.get('lan'))
    }, []);


    //per sapere dove indica la location del dom
    console.log(location.pathname)

    //per fare ricerca di un oggetto nella barra in alto 
    const parentToChild = () => {
        const search = {
            pathname: `/lermellino/search/${searchTerm}`,
          }
        history.push(search)
      }

    const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
    setAnchorEl(null);
    };


    useEffect(() => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
            setisSignedin(true)
            const uid = user.uid;
          // ...
        } else {
            setisSignedin(false)
        }
      });
      if (user != null) {
        setShowResults(false)
          if (user.email === 'giberti.21638@iisvolta.it') //ho impostato la mia email come admin per vedere la dashboard ed accettare i prodotti
          {
          setShowResults(true)
          }
          const dbRef = ref(getDatabase());
          get(child(dbRef, `users/` + user.uid)).then((snapshot) => {
            if (snapshot.exists()) {
              console.log(snapshot.val());
              for(var i in snapshot.val())
              allcart.push([i, snapshot.val() [i]]);
            } else {
              console.log(user.uid);
            }
          }).catch((error) => {
            console.error(error);
          }).finally(() => { 
          if (basket?.length === 0) {  
          if(allcart.length > 0)
          addtoBasket();
          }
          });
        }
      },[user])


//sezione aggiornamento carrello tramite realtime database se utente ha elementi in carrello, ottenuti dal passaggio nell useEffect sopra
    const addtoBasket = () => {

      for(var i = 0; i < allcart.length; i++){

          dispatch({
            type: 'ADD_TO_BASKET',
            item: {
                id: allcart[i][0],
                preview: allcart[i][1].preview,
                title: allcart[i][1].title,
                image: allcart[i][1].image,
                price: allcart[i][1].price,
                startDate: allcart[i][1].startDate,
                endDate: allcart[i][1].endDate,
                totalday: allcart[i][1].totalday,
                city: allcart[i][1].city,
                tipo: allcart[i][1].tipo, 
                CreatedOn: allcart[i][1].CreatedOn,
                idbuyer: allcart[i][1].idbuyer,
                caparra: allcart[i][1].caparra,
            }
        })
      console.log(allcart[i]);
    }
  }

    
    const verificaemail = () => {
        handleClose();
        sendEmailVerification(auth.currentUser)
        .then(() => {
        toast.success("Un email di verifica è stata mandata all'indirizzo " + user.email, { 
        position: "top-left",
        autoClose: true,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
    }); }


    const eliminaaccount = () => {
        deleteUser(user).then(() => {
            toast.success("Account eliminato correttamente" , { 
                position: "top-left",
                autoClose: true,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                });
          }).catch((error) => {
            toast.error("Account non eliminato, riprova più tardi o scrivici alla sezione contatti",  {
                position: "top-left",
                autoClose: true,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined, })
            // ...
          });     
    }

    const logout = () => {
        signOut(auth).then(() => {

          dispatch({
            type: 'CLEAR_BASKET'});

            history.push("/lermellino/")
          }).catch((error) => {
            // An error happened.
          });
    }

    const dashboard = () => {
          history.push("/lermellino/dashboard")
        }
  


   const submit = () => {

    handleClose();
        confirmAlert({
          title: 'Sei sicuro di voler eliminare il tuo account?',
          message: 'Per qualsiasi informazione scrivi alla sezione contatti.',
          buttons: [
            {
              label: 'Yes',
              onClick: () => eliminaaccount(),
            },
            {
              label: 'No',
            }
          ]
        });
      };



    //per salvare le info di carrello nel localstorage ad ogni cambiamento del carrello
    useEffect(() => {
      localStorage.setItem("localCart", JSON.stringify(basket));
      console.log('carrello salvato in localstorage:',JSON.parse(localStorage.getItem("localCart")))
    }, [basket]);


      //dai funzione con il tasto invio
      useEffect(() => {
        const listener = event => {
          if (event.code === "Enter" || event.code === "NumpadEnter") {
            console.log("Enter key was pressed. Run your function.");
            event.preventDefault();

            if (searchTerm)
            parentToChild();
          }
        };
        document.addEventListener("keydown", listener);
        return () => {
          document.removeEventListener("keydown", listener);
        };
      });

        
//Header senza login
    if (isSignedin === false) {
    return (
        <div className={classheader}  style={{display: location.pathname === "/lermellino/paysection" || location.pathname === "/lermellino/signin" || location.pathname === "/lermellino/login" ? "none" : "" }}>
        <div style={{display:"flex",justifyContent: "center"}}>
        <Link to="/lermellino/">
            <img className="header_logo"
            src={logo} alt="logo"  width="160" height="118" />
        </Link>
        <div className="listmenu">
        <Link to="/lermellino/aboutus">
        {/*il pathname a condizione dello stile è per identificare la section dell'user*/}
        <div className='listitem'  style={{color: location.pathname === "/lermellino/aboutus" ? 'rgb(198, 133, 37)' : '' }}> {t("Chi siamo")} </div>
        </Link>
        <Link to="/lermellino/rules">
        <div className='listitem' style={{color: location.pathname === "/lermellino/rules" ? 'rgb(198, 133, 37)' : '' }}> {t("Regolamento")} </div>
        </Link>
        <Link to="/lermellino/contacts">
        <div className='listitem' style={{color: location.pathname === "/lermellino/contacts" ? 'rgb(198, 133, 37)' : '' }}> {t("Contatti")} </div>
        </Link>
        <span className="flag-icon flag-icon-it" onClick={() => {i18n.changeLanguage("it");cookieslan("it");setLanguage("it")}}> </span>
        <span className="flag-icon flag-icon-gb" onClick={() => {i18n.changeLanguage("en");cookieslan("en");setLanguage("en")}}></span>
        </div>
        </div>
        
            <div className="header__search">
            <div className={classmenu} onClick={() => classMenu()}>
               <li></li>
               <li></li>
               <li></li>
           </div>
         {/*input style={{width:"100%",height:"31px",borderRadius: "5px"}} Senza material UI */} <input style={{width:"100%",height:"31px",borderRadius: "5px"}}  
              placeholder={t("Cerca")}
              name="search"
              type="text"
              autoComplete="off"
              onChange={(event) => {setSearchTerm(event.target.value)} } 
              
             /> 
                <SavedSearchIcon style={{border:"1px solid #E05D5D",borderRadius:"6px",height:"25px",marginTop:"1px"}}  onClick={() => parentToChild()}
                className="header__searchIcon" />
            </div>
            {/* { location.pathname !== "/paysection" || location.pathname !== "/signin" || location.pathname !== "/login" &&
            <ToastContainer />
            }*/ }
            <div className="hidelist">
            <div className="header__nav">
                    <div className='header__option'>
                        <span className='header__optionLineOne'> {t("Benvenuto fratello/sorella")} </span>
                        <Link to='/lermellino/signin' >
                        <span className='header__optionLineTwo'> {t("Registrati!")} </span>
                        </Link>
                    </div>
            <div className='header__option'>
                    <span className='header__optionLineOne'> {t("Sei gia registrato/a?")}  </span>
                <Link to='/lermellino/login' >
                    <span className='header__optionLineTwo'> Log in </span>
                </Link>
                </div>
              </div>
          </div>
        </div>
        )
    }

//Header con login
    else {

        return (
            <div className={classheader} style={{display: location.pathname === "/lermellino/paysection" || location.pathname === "/lermellino/signin" || location.pathname === "/lermellino/login" || location.pathname === "/lermellino/addproducts" ? "none" : "" }}  > {/* style={{display: location.pathname === "/lermellino/paysection" ? "none" : "" }}   condizione nello style diretto */} 
            <div style={{display:"flex",justifyContent: "center"}}>
            <Link to="/lermellino/">
            <img className="header_logo"
            src={logo} alt="logo"  width="160" height="118" />
              </Link>
              <div className="listmenu">
              <Link to="/lermellino/aboutus">
                {/*il pathname a condizione dello stile è per identificare la section dell'user*/}
              <div className='listitem' style={{color: location.pathname === "/lermellino/aboutus" ? 'rgb(198, 133, 37)' : '' }}> {t("Chi siamo")} </div>
              </Link>
              <Link to="/lermellino/rules">
              <div className='listitem' style={{color: location.pathname === "/lermellino/rules" ? 'rgb(198, 133, 37)' : '' }}> {t("Regolamento")} </div>
              </Link>
              <Link to="/lermellino/contacts">
              <div className='listitem' style={{color: location.pathname === "/lermellino/contacts" ? 'rgb(198, 133, 37)' : '' }}> {t("Contatti")} </div>
              </Link>
              <span className="flag-icon flag-icon-it" onClick={() => {i18n.changeLanguage("it");cookieslan("it");setLanguage("it")}}> </span>
              <span className="flag-icon flag-icon-gb" onClick={() => {i18n.changeLanguage("en");cookieslan("en");setLanguage("en")}}> </span>
              </div>
              </div>
            <div className="header__search">
            <div className={classmenu} onClick={() => classMenu()}>
               <li></li>
               <li></li>
               <li></li>
           </div>
                  <input style={{width:"100%",height:"31px",borderRadius: "5px"}} 
                  autoComplete="off"
                  placeholder={t("Cerca")}
                  name="search"
                  type="text"
                  onChange={(event) => {setSearchTerm(event.target.value)} } /> 
                <SavedSearchIcon style={{border:"1px solid #E05D5D",borderRadius:"6px",height:"25px",marginTop:"1px"}}  onClick={() => parentToChild()}
                className="header__searchIcon" />
            </div>
            {/* { location.pathname !== "/paysection" || location.pathname !== "/signin" || location.pathname !== "/login" &&
            <ToastContainer />
            }*/ }
                <div className="header__nav">
                  <div className='header__option'>
                    <span className='header__optionLineOne'> {t("Ciao")} {user && user.displayName} </span>
                    <div className="logoutsetting">
                    <Button onClick={logout} style={{color: "white",height: "21px"}} className='login__signOutButton'> Log out </Button> 
                    <div className={"icon-btn light-theme " + (anchorEl ? 'set' : '')} onClick={handleClick}>
                    <i className="icon fas fa-cog" ></i>
                    </div>
                    </div>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                        'aria-labelledby': 'basic-button',
                        }}
                    >
                        <MenuItem onClick={verificaemail}>{t("Re-autentica email")}</MenuItem>
                        <MenuItem onClick={submit}>{t("Elimina account")}</MenuItem>
                        { showResults ? <MenuItem onClick={dashboard}> Dashboard </MenuItem> : null }
                    </Menu>
                  </div>

                <div className="header__nav two">
                    <div className='header__option'>
                        <Link to='/lermellino/ownorders' >
                        <span className='header__optionLineTwo'> {t("I tuoi")} </span>
                        <br/>
                        <span className='header__optionLineTwo'> {t("acquisti")} </span>
                        </Link>
                    </div>
                  </div>
            <div className="header__nav two">
            <div className='header__option'>
                <Link to='/lermellino/ownshop' >
                    <span className='header__optionLineTwo'> {t("Vendi o")} </span>
                    <br/>
                    <span className='header__optionLineTwo'> {t("noleggia")}  </span>
                </Link>
                </div>
                </div>

                 <Link to="/lermellino/checkout"  style={{ textDecoration: 'none', alignSelf: 'center'}}>
                    <div className='header__optionBasket'>
                    <span className="header__optionLineTwo header__basketCount">{basket?.length}</span>
                    <AddShoppingCartIcon />
                    </div>
                </Link>
              </div>
          </div>
        )
    }
}





export default Header