import React, {useState, useEffect} from 'react';
import './Checkout.css';
import { useStateValue } from './StateProvider';
import Subtotal from "./Subtotal";
import CheckoutProduct from "./CheckoutProduct";
import barcode from "./barcode.png";
import { context } from "./App.js";
import { useTranslation } from "react-i18next";


function Checkout() {
    const [{basket}, dispatch] = useStateValue();
    const { t } = useTranslation();
    const language = React.useContext(context);


    return (
        <div>

            <div className="headlist">
         
            <div className="checkout__left">
            <div className="headtext" style={{textAlign:"start"}}> <span className="intro intro--num"> <img src={barcode} width={50}/> </span>
            <span className="intro"> {t("Il tuo carrello")} </span> </div>
            </div>
            <div className="checkout__right" > 
            <Subtotal />
            </div>
            </div>
            <div className="home__container">
            <div className="footerdistance" style={{minHeight:"1170px"}}>
            <img className="home__photo" src="https://img-prod.ilfoglio.it/2021/11/29/091843519-2b237430-a66a-4398-acd9-40d9efbc1b6e.jpg" alt="" />
            <div className="home__row" style={{marginTop:"-52%"}} >

            
            <div className="list">
            {basket.map((item,index) => ( <CheckoutProduct 
            key={item.id}
            id={item.id}
            title={item.title}
            image={item.image}
            price={item.price}
            city={item.city}
            tipo={item.tipo}
            totalday={item.totalday}
            pricerent={item.pricerent}
            caparra={item.caparra}
            startDate={item.startDate}
            endDate={item.endDate}
            preview={item.preview}
            idbuyer={item.idbuyer}
            createdon={item.CreatedOn}>
            </CheckoutProduct> ))}
            </div>
            </div>
            </div>
            </div>
        </div>
    );
}

export default Checkout;
