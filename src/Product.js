import React, { useState, useEffect } from 'react';
import "./Product.css";
import { Button } from '@mui/material';
import {useHistory} from "react-router-dom";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useTranslation } from "react-i18next";
import { context } from "./App.js";

function Product({id,tipo,title,preview,image,price,priceday,city,previewEN,titleEN}) {

    let history = useHistory();
    const type = tipo;
    const getprodotto = () => {history.push(`/pageproduct/${id}`)}
    const [convertedText, setConvertedText] = useState('');
    const [titleconvertedText, setTitleConvertedText] = useState('');
    const { t } = useTranslation();
    const language = React.useContext(context);


  //utilizza l'useContext per cambiare la lingua
  useEffect(() => {
    if(language.language === 'en') {
      setTitleConvertedText(titleEN);
      setConvertedText(previewEN);
      console.log(language.language)
      }
      else {
      setTitleConvertedText(title);
      setConvertedText(preview);
      console.log(language.language)
      }
  },[language]);



  if (type === "VENDO") {
    return (
        <div className="product">
                <div className="product__info">
                    <div className="product__description">
                        <h2>{titleconvertedText}</h2>
                        <p>{convertedText}</p>
                    </div>
                    <div className="product__price">
                        <h5>€ {price} </h5>
                    </div>
                    <div className="product__rating">
                        {city}
                    </div>
                </div>   

        <img src={image[0]}  className="imghome" />        
        <div className="buttonbot">   
        <Button onClick={getprodotto} className="buttons" style={{width: "100%",backgroundColor:"#00A19D", border: "1px solid black",height:"45px"}}>        
        <VisibilityIcon style={{color:"white",borderRadius:"9px",width:"15%",height:"53px",marginRight: "13px"}} />
        {t("ACQUISTA IL PRODOTTO")} </Button> 
        </div>
        </div>
    );
  }
  return (
    <div className="product">
        <div className="product__info">
            <div className="product__description">
                        <h2>{titleconvertedText}</h2>
                        <p>{convertedText}</p>
                    </div>
                    <div className="product__price">
                        <h5>€ {priceday} {t("*per giornata")}   </h5>  
                    </div>
                    <div className="product__rating">
                        {city}
                    </div>
                </div> 

        <img src={image[0]} alt="" className="imghome"  /> 
        <div className="buttonbot">
        <Button onClick={getprodotto} className="buttons" style={{width: "100%",backgroundColor:"#c68525", border: "1px solid black",height:"45px"}}>        
        <VisibilityIcon style={{color:"white",borderRadius:"9px",width:"15%",height:"53px",marginRight: "13px"}} />
        {t("NOLEGGIA IL PRODOTTO")}  </Button> 
        </div>
        </div>
);
}

export default Product
