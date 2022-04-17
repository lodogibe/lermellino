import React, { useEffect, useState } from "react";
import "./OwnShop.css"; 
import barcode from "./barcode.png"
import {Link} from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { getAuth} from 'firebase/auth';
import { collection, getDocs, getFirestore, query, where} from "firebase/firestore";
import VisibilityIcon from '@mui/icons-material/Visibility';
import background from './image-background/image1.jpg';
import { useTranslation } from "react-i18next";
import { context } from "./App.js";


export default function OwnOrders() {


    const db = getFirestore();
    const [idorder, setIdorder] = useState("");
    const auth = getAuth();
    const user = auth.currentUser;
    const [idowner,setIdowner] = useState('');
    const [textrent,setTextrent] = useState("");
    const [textsold,setTextsold] = useState("");
    const { t } = useTranslation();
    const language = React.useContext(context);
    const [infoprod,setInfoprod] = useState([])
  
  
    //utilizza l'useContext per cambiare la lingua
    useEffect(() => {
      if(language.language ==='en') {
        setTextrent("RENT");
        setTextsold("PURCHASE");
      }
      else {
        setTextrent("NOLEGGIO");
        setTextsold("ACQUISTO");
      }
    },[language]);



const getdata = () => {
    //vado a recuperare gli ordini del cliente dal database
            fetchMyAPI()
            async function fetchMyAPI() {
                const q = query(collection(db, "orders"),where("clientID", "==", idowner));
                const querySnapshot =  await getDocs(q);
                const saveFirebaseTodos = []; 
                querySnapshot.forEach((doc) => {
                saveFirebaseTodos.push(({id: doc.id, ...doc.data()}));
                console.log(doc.id, " => ", doc.data());
                })  
                //in un primo momento tiro giù l'intero ordine, qui sotto invece suddivido tutti i prodotti in modo che compaiano sul client come unità singole, ma con specificato l'ordine padre di appartenza
                if(saveFirebaseTodos.length > 0) {
                console.log(saveFirebaseTodos) 
                setIdorder(saveFirebaseTodos[0].id);
                setInfoprod(saveFirebaseTodos[0].infoproducts)
                }
            }
        } 

    

    useEffect(() => {
        if (user !== null) {
            const uid = user.uid;
            setIdowner(uid);
        }
            if (idowner !== '')
            getdata();
    }, [user, idowner])

   


    return (
        <div>
            <div className="headlist">
            <div className="headtext" style={{textAlign: "start"}}>
            <span className="intro intro--num"> <img src={barcode} width={50}/> </span>
            <span className="intro">{t("Lista dei tuoi ordini")}</span>
            </div>
            </div>
            <div className="home__container">
            <div className="footerdistance" style={{minHeight:"1170px"}}>
            <img className="home__photo" src={background} alt="" />
            <div className="home__row" style={{marginTop:"-55%"}}  >
            {infoprod.map((value, key) => 
                 <div className="productlist" key={key} >
                    <div className="product" style={{boxShadow:"none",transform: "none"}}>
                        <div className="product__info" style={{textAlign:"start"}}>
                        <h4>{value.tipo ==='Acquisto' ? textsold : textrent} </h4>
                    <h2>{value.titolo}</h2>
                    <div className="product__description">
                        <h2>{value.prewiev}</h2>
                    </div>
                    <div className="product__rating" >                   
                    {t("Spesa")}: {value.prezzo} € </div>

                    {value.tipo === 'Acquisto' &&
                    <div className="product__rating" style={{color:"transparent"}}>                   
                    {t("Caparra versata")}: {value.caparra} € </div> }

                    {value.tipo === 'Acquisto' &&
                    <p className="product__price" style={{color:"transparent"}}> </p> }

                    {value.tipo === 'Acquisto' &&
                    <div className="datesinfo" style={{color:"transparent"}}>
                    {t("Data inizio noleggio")}: {value.datainizio} </div>}  {value.tipo === 'Acquisto' &&
                    <div className="datesinfo" style={{color:"transparent"}}> {t("Data fine noleggio")}: {value.datafine} </div>  }

                    {value.tipo === 'Noleggio' &&
                    <div className="product__rating" >                   
                    {t("Caparra versata")}: {value.caparra} € </div>}
                    
                    {value.tipo === 'Noleggio' &&
                    <p className="product__price"> </p> }

                    {value.tipo === 'Noleggio' &&
                    <div className="datesinfo" >
                    {t("Data inizio noleggio")}: {value.datainizio} </div>}  

                    {value.tipo === 'Noleggio' &&
                    <div className="datesinfo" > {t("Data fine noleggio")}: {value.datafine} </div>  }  
                    


                </div>   
            <img src={value.foto} alt="" />
            <div className="hovereye">
            <Link to={`/lermellino/pageproduct/${value.id}`} style={{height:"40px"}}> <VisibilityIcon style={{color:"black",border:"1px solid black",borderRadius:"9px",width:"50%",height:"38px"}} />
           </Link>
           </div>
           <div className="ordine">
           {t("Ordine")}:  {idorder} <br />
           {t("Effettuato il")}: {value.data}
           </div>
        </div>            
         </div>
            )}
            </div> 
            </div>
        </div>
        </div>
    )
}
