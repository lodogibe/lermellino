import React, { useEffect, useState, useLayoutEffect } from "react";
import "./OwnShop.css"; 
import { Button } from '@mui/material';
import {Link} from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { getAuth} from 'firebase/auth';
import barcode from "./barcode.png"
import { collection, getDocs, getFirestore, query, orderBy, where} from "firebase/firestore";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useTranslation } from "react-i18next";
import background from './image-background/image3.jpg';
import Loader from "./Loader";
import { context } from "./App.js";




export default function OwnShop() {


    const db = getFirestore();
    const [products, setProduct] = useState([]);
    const auth = getAuth();
    const user = auth.currentUser;
    const [idowner,setIdowner] = useState('');
    const [showloader, setShowloader] = useState(true);
    const { t } = useTranslation();
    const [Noletext,setNoletext] = useState("");
    const [Acquitext,setAcquitext] = useState("");
    const language = React.useContext(context);


    useLayoutEffect(() => {
        window.scrollTo(0, 0)
      }, [])
    

    //utilizza l'useContext per cambiare la lingua
    useEffect(() => {
    if(language.language === 'en') {
        setNoletext("RENT");
        setAcquitext("SALE");
        //setTitleConvertedText(titleEN);
    }
    else {
        setNoletext("NOLEGGIO");
        setAcquitext("VENDO");
        //setTitleConvertedText(title);
    }
    },[language]);



    const getdata = () => {
            fetchMyAPI()
            async function fetchMyAPI() {
                const q = query(collection(db, "products"),where("IDowner", "==", idowner),orderBy("CreatedOn","desc"));
                const querySnapshot =  await getDocs(q);
                const saveFirebaseTodos = []; 
                querySnapshot.forEach((doc) => {
                saveFirebaseTodos.push(({id: doc.id, ...doc.data()}));
    
            });
            setProduct(saveFirebaseTodos) 
            }
    } 

    

    useLayoutEffect(() => {
        if (user !== null) {
            setIdowner(user.uid);
        }
            if (idowner !== '')
            getdata();
    }, [user, idowner])
    



    return (
        <div>
            <div className="headlist">
            { showloader && <Loader /> }
            <div className="headtext" style={{textAlign: "start"}}>
            <span className="intro intro--num"> <img src={barcode} width={50}/> </span>
            <span className="intro">{t("Stato dei tuoi articoli")}</span>
            </div>
            <div className="buttonadd">
            <Link to="/lermellino/addproducts">
            <Button variant="contained"> {t("Aggiungi articolo")} </Button>
            </Link>
            </div>
            </div>
            <div className="home__container">
            <img className="home__photo" src={background} onLoad={() => setShowloader(false)} alt="" />
            <div className="footerdistance" style={{minHeight:"1000px"}}> 
            <div className="home__row" style={{marginTop:"-55%"}}  >
                {products.map((value, key) =>
                 <div className="productlist" key={key} >
                    <div className="product" style={{boxShadow:"none",transform: "none",margin:"1%"}}>
                        <div className="product__info" style={{textAlign:"start"}}>
                    <h4> {value.Type === "VENDO" ? Acquitext : Noletext} </h4>
                    <div className="product__description">
                        <h2>{language.language === "en" ? value.NameEN : value.Name}</h2>
                        <p>{value.preview}</p>
                    </div>
                    <p className="product__price"> </p>
                    {value.Type === 'VENDO' &&
                        <h5> € {value.Price} </h5> }
                    {value.Type === 'NOLEGGIO' &&
                        <h5> € {value.Priceday} {t("per giornata")} </h5> }     
                    
                    <div className="product__rating">
                        {value.City}
                    </div>
                </div>   
            <img src={value.Img[0]} alt="" />
            <div className="hovereye">
            <Link to={`/lermellino/pageproduct/${value.id}`} style={{height:"40px"}}> <VisibilityIcon style={{color:"black",border:"1px solid black",borderRadius:"9px",width:"50%",height:"38px"}} />
           </Link>
           </div>
        </div>  
                    <div className="product__infolist left"> {t("Stato")}:  
                        {value.State === 'ATTESA' && 
                        <div className='state' style={{color:"#ffb344"}}> {t("ATTESA")} </div> } 
                        {value.State === 'RIFIUTATO' &&
                        <div className='state' style={{color:"red"}}> {t("RIFIUTATO")} </div> } 
                        {value.State === 'DISPONIBILE' &&
                        <div className='state' style={{color:"green"}}> {t("DISPONIBILE")} </div> } 
                        {value.State === 'VENDUTO' &&
                        <div className='state' style={{color:"red"}}> {t("VENDUTO")} </div> } </div>       
                    </div>
                )}
                </div>
            </div>
        </div>
    </div>
    )
}
