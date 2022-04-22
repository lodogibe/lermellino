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
    const [allorders,setAllorders] = useState([])
  
  
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
                    let count = 0; //mantiene il conto di tutti i prodotti che poi vengono associati a quel determinato IDordine
                    for (let i = 0; i < saveFirebaseTodos.length ; i++) {
                        console.log(saveFirebaseTodos[i].infoproducts.length)

                        for (let j = 0; j < saveFirebaseTodos[i].infoproducts.length; j++) {
                            console.log(saveFirebaseTodos[i].infoproducts[j])
                            console.log(saveFirebaseTodos[i].id)
                            allorders[count] = {
                                "id" : saveFirebaseTodos[i].id,
                                "info" : saveFirebaseTodos[i].infoproducts[j]}
                            count++;
                        }
                    }

                for (let i = 0; i < allorders.length ; i++) {
               console.log(allorders[i].id,allorders[i].info.id)
                }
               // console.log(saveFirebaseTodos.map((value,key) => value.infoproducts[0].foto)) 
                setInfoprod(saveFirebaseTodos)
                console.log(allorders.map((value) => value.id)) 
                }
            }
        } 

    // console.log(infoprod,idorder)

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

             {allorders.map((value, key) => 
                 <div className="productlist" key={key} >
                    <div className="product" style={{boxShadow:"none",transform: "none"}}>
                        <div className="product__info" style={{textAlign:"start"}}>
                        <h4>{value.info.tipo ==='Acquisto' ? textsold : textrent} </h4>
                    <h2>{value.info.titolo}</h2>
                    <div className="product__description">
                        <h2>{value.info.prewiev}</h2>
                    </div>
                    <div className="product__rating" >                   
                    {t("Spesa")}: {value.info.prezzo} € </div>

                    {value.info.tipo === 'Acquisto' &&
                    <div className="product__rating" style={{color:"transparent"}}>                   
                    * {value.info.caparra} </div> }

                    {value.info.tipo === 'Acquisto' &&
                    <p className="product__price" style={{color:"transparent"}}> </p> }

                    {value.info.tipo === 'Acquisto' &&
                    <div className="datesinfo" style={{color:"transparent"}}>
                    * {value.datainizio} </div>}  {value.info.tipo === 'Acquisto' &&
                    <div className="datesinfo" style={{color:"transparent"}}> * {value.info.datafine} </div>  }

                    {value.info.tipo === 'Noleggio' &&
                    <div className="product__rating" >                   
                    {t("Caparra versata")}: {value.info.caparra} € </div>}
                    
                    {value.info.tipo === 'Noleggio' &&
                    <p className="product__price"> </p> }

                    {value.info.tipo === 'Noleggio' &&
                    <div className="datesinfo" >
                    {t("Data inizio noleggio")}: {value.info.datainizio} </div>}  

                    {value.info.tipo === 'Noleggio' &&
                    <div className="datesinfo" > {t("Data fine noleggio")}: {value.info.datafine} </div>  }  
                    


                </div>   
            <img src={value.info.foto} alt="" />
            <div className="hovereye">
            <Link to={`/lermellino/pageproduct/${value.info.id}`} style={{height:"40px"}}> <VisibilityIcon style={{color:"black",border:"1px solid black",borderRadius:"9px",width:"50%",height:"38px"}} />
           </Link>
           </div>
           <div className="ordine">
           {t("Ordine")}:  {value.id} <br />
           {t("Effettuato il")}: {value.info.data}
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
