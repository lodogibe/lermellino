import React from 'react';
import "./Subtotal.css";
import CurrencyFormat from "react-currency-format";
import { useStateValue } from "./StateProvider";
import { getBasketTotal } from './reducer';
import {useHistory} from "react-router-dom";
import { Button } from '@mui/material';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.min.css";
import { useTranslation } from "react-i18next";


function Subtotal() {
    const [{basket}, dispatch] = useStateValue();
    let history = useHistory();
    const { t } = useTranslation();

    const gotopay = () => {
        
        if(basket.length > 0)
        history.push('/lermellino/paysection')

        else 
        {
            toast.error("Carrello vuoto" , { 
                position: "top-left",
                autoClose: true,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                });
        }
    }


    return (
        <div className="subtotal" >
            <CurrencyFormat
                renderText={(value) => (
                    <>
                    <p style={{lineHeight: "15px"}}>
                    {t("Totale")} ({basket.length} {t("elemento/i")}):
                    <strong>    {value}  </strong> 
                    </p>
                    </>
                )}
                decimalScale={2}
                value={getBasketTotal(basket)}
                displayType={"text"}
                thousandSeparator={true}
                prefix={"€ "}
            />

            <Button variant="contained" onClick={gotopay} > {t("Procedi all'acquisto")} </Button>
        </div>
    )
}
 
export default Subtotal
