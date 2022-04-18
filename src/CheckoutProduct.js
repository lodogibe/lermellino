import React , { useState, useEffect }  from 'react';
import './CheckoutProduct.css';
import { useStateValue } from './StateProvider';
import { Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import {Link} from "react-router-dom";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { getDatabase, ref, remove } from "firebase/database";
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.min.css";
import { useTranslation } from "react-i18next";
import { context } from "./App.js";

function CheckoutProduct({id,title,titleEN,image,price,city,tipo,startDate,endDate,totalday,idbuyer,createdon}) {

const [{basket}, dispatch] = useStateValue();
const timestamp = Date.now() - createdon;
const startcount = 237000 - timestamp;
const [counter, setCounter] = useState(Math.round(startcount / 1000));
const [TextNol, setTextNol] = useState('');
const [TextAcq, setTextAcq] = useState('');
const [titleconvertedText, setTitleConvertedText] = useState('');
const { t } = useTranslation();
const language = React.useContext(context);

console.log(titleEN)

//utilizza l'useContext per cambiare la lingua
useEffect(() => {
if(language.language === 'en') {
  setTitleConvertedText(titleEN);
  setTextNol("RENT");
  setTextAcq("PURCHASE");
  console.log(language.language)
  }
  else {
  setTitleConvertedText(title);
  setTextNol("NOLEGGIO");
  setTextAcq("ACQUISTO");
  console.log(language.language)
  }
},[language]);

const removefromBasket = () => {
    writeUserData();
        function writeUserData() {
            const db = getDatabase();
            remove(ref(db, 'users/' + idbuyer + '/' + id), {
            });
          }
    //rimuove elemento dal carrello
    dispatch({
        type: 'REMOVE_FROM_BASKET',
        id: id,
    }) 
}

//countdown
useEffect(() => {

   //console.log(" id: " + title + " startcount: " + startcount + " timestamp: " + timestamp + " counter: " + counter)
    if (counter < 1) 
    {
           toast.warning("L'articolo " + title + " è stato rimosso dal carrello per troppo tempo" , { 
            position: "top-left",
            autoClose: true,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            });
    removefromBasket(); 
    }

    else if (counter > 0) 
    {
        const timerId = setInterval(() => setCounter(counter - 1), 1000);
        return () => clearInterval(timerId);
    }
  }, [counter]);
    
 

return (
        <div className="product" style={{transform: "none",  position: "relative"}}>
        <div className="product__info" >
        <div className="countdown">
        <h4>{tipo === "VENDO" ? TextAcq : TextNol} </h4>
        <div className="contatore">
        Countdown: {counter} </div> </div>
            <div className="product__description">
                <h2>{titleconvertedText}</h2>
            </div>
            <br />
            {tipo === "VENDO" &&
            <div className="product__price">
                <h3>€ {price} </h3>
                <div className="details">
                  <br />
                  <br />
                  <br />
            </div>
            </div>
            }
            {tipo === "NOLEGGIO" &&
            <div className="product__price">
                <h3>€ {price} </h3>
                <div className="details" >
                  {totalday.length < 2 && <p style={{fontSize:"11px"}}> {t("Per la giornata del")} {totalday[0]} </p> } {totalday.length >= 2 && <p style={{fontSize:"11px"}} > {t("Per le giornate che vanno dal")} {startDate} {t("al")} {endDate} </p> }
            </div>
            </div>

            }
            <div className="product__rating">
                {city}
            </div>
        </div>   
    <img src={image} className="imghome" />     
    <div className="buttonbot">
    <Link to={`lermellino/pageproduct/${id}`} style={{marginRight:"5px",height:"36px"}}> <VisibilityIcon style={{color:"black",border:"1px solid white",borderRadius:"9px",width:"100%",height:"34.035px"}} />
    </Link>
    <Button variant="outlined" startIcon={<DeleteIcon />} onClick={removefromBasket} > {t("Rimuovi articolo")} </Button>
    </div>
    </div>
    );
}

export default CheckoutProduct;
