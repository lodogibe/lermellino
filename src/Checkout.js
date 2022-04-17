import React, {useState, useEffect} from 'react';
import './Checkout.css';
import { useStateValue } from './StateProvider';
import Subtotal from "./Subtotal";
import CheckoutProduct from "./CheckoutProduct";
import barcode from "./barcode.png";
import { context } from "./App.js";
import { useTranslation } from "react-i18next";
import background from './image-background/image8.jpg';
import {
    CSSTransition,
    TransitionGroup,
  } from 'react-transition-group';


function Checkout() {
    const [{basket}, dispatch] = useStateValue();
    const { t } = useTranslation();
    const language = React.useContext(context);
    const [items, setItems] = useState([
        { id: 2, text: 'Buy eggs' },
        { id: 3, text: 'Pay bills' },
        { id: 4, text: 'Invite friends over' },
        { id: 5, text: 'Fix the TV' },
      ]);


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
            <img className="home__photo" src={background} alt="" />
            <div className="home__row" style={{marginTop:"-55%"}} >


            <TransitionGroup className="toda-lista">
                {basket.map((item,index) => (     
                  
                <CSSTransition
                  key={item}
                  timeout={200}
                  classNames="item"
                >

                <div key={item}>
                <CheckoutProduct 
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
                </CheckoutProduct>
                </div>

                </CSSTransition> ))
                }
            </TransitionGroup>

            {/*<div className="list">
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
            </div>*/}
            </div>
            </div>
            </div>
        </div>
    );
}

export default Checkout;
