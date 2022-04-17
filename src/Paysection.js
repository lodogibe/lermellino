import React, { useState, useEffect  } from 'react';
import './Paysection.css';
import logo from './logo.png';
import {Link, useHistory} from "react-router-dom";
import { getAuth } from 'firebase/auth';
import { Button } from '@mui/material';
import { useStateValue } from "./StateProvider";
import { getBasketTotal } from './reducer';
import { getCaparraTotal } from './reducer';
import CurrencyFormat from "react-currency-format";
import CheckoutProduct from "./CheckoutProduct";
import "react-toastify/dist/ReactToastify.min.css";
import Radio from '@mui/material/Radio';
import TextField from '@mui/material/TextField';
import PayPal from "./PayPal";
import {loadStripe} from '@stripe/stripe-js';
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';




export default function Paysection() {

    const [{basket}, dispatch] = useStateValue();

    //setto per default il metodo paypal, cosi per scelta
    const [method, setMethod] = useState('paypal');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [totale, setTotale] = useState(0);
    const [showpaypal, setShowpaypal] = useState(false);
    const [showpaymentmethod, setShowpaymentmethod] = useState(false);
    const auth = getAuth();
    const user = auth.currentUser;
    let history = useHistory();
    const props = [];
    // eventuale variabile per calcolare la percentuale del totale che spetterebbe all'ermellino:
    let ermellinotax = totale * 2 / 100;

  
    console.log(ermellinotax)
    //creo tutti i props da mandare all resoconto paypal
    basket.map((item) => ( props.push(item), console.log(props)))
    
    //Checkout di stripe
    const CheckoutForm = () => {
      const stripe = useStripe();
      const elements = useElements();
    
      const handleSubmit = async (event) => {
        event.preventDefault();
    
        if (elements === null) {
          return;
        }
    
        const {error, paymentMethod} = await stripe.createPaymentMethod({
          type: 'card',
          card: elements.getElement(CardElement),
        });
      };
    
      return (
        <form onSubmit={handleSubmit}>
          <CardElement />
          <Button  type="submit" disabled={!stripe || !elements} style={{backgroundColor:"#E05D5D",color:"white",width:"-webkit-fill-available",marginTop:"10px"}}>
           PAGA ORA </Button>
        </form>
      );
    };
    
    const stripePromise = loadStripe('pk_test_6pRNASCoBOKtIshFeQd4XMUh');

    //gestisce scelta metodo pagamento
    const handleChange = (event) => {
      setMethod(event.target.value);
    };

    //per avere il totale sempre aggiornato in variabile da mandare al metodo di pagamento
    let total_amount = getBasketTotal(basket);

    //useEffect per assicurarsi il render del paypal con un valore maggiore di 0 e il riaggiornamento nel caso un articolo viene rimosso (o per timer o scelta utente)
    useEffect(() => {
      setShowpaypal(false)
      setTotale(total_amount)
      console.log("Totale pagare ora: " + totale + " €")
      if(name !== '' && surname !== '') {
        setShowpaymentmethod(true)
      }
      else
      setShowpaymentmethod(false)
      const timer = setTimeout(() => {
        setShowpaypal(true) 
      }, 1000);
     
      if (basket.length < 1)
      history.push(location)
    }, [total_amount,name,surname])

  
  //meccanismo di rispedizione alla home page quando il carrello va a 0
  const location = {
       pathname: '/lermellino/',
      state: { fromCart: true }
    }

    return (      
        <div className="signin ciek">
            <Link to="/lermellino/">
            <img className="signin_logo"
            src={logo} alt="logo"  width="160" height="118" />
            </Link>      
            
           
        <div className="signin__container check">
        <div className="iphone">
  <header className="header_pay">
  <span className="intro" style={{color: "#E05D5D", fontSize:"40px"}}>Checkout</span>
  </header>

  <div className="form" > 
    <div>
      <h2>Dettagli cliente</h2>
        <h5>Nome e cognome di chi effettuerà il ritiro nelle sede/i dei prodotti</h5>          
          <div className="name__surname" > 
          <div className="nome__ritiro">
           <p> Nome </p>
            <TextField style={{height:"23px", width:"100%"}}
                  className="preview"
                  id="outlined-textarea"
                  inputProps={{
                    maxLength: 10,
                  }}
                  type="input"
                  value={name}
                  onChange={(e) => setName(e.target.value)} 
                />
                </div>
                <div className="cognome__ritiro">
            <p> Cognome </p>
              <TextField style={{ width:"100%"}}
                  className="preview"
                  id="outlined-textarea"
                  inputProps={{
                    maxLength: 10,
                  }}
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                />
              </div>       
      </div>
      <hr />
      <h5 style={{textAlign:"start"}}>Info utente registrato che sta effettuando l'operazione</h5> 
      <div style={{textAlign:"start",lineHeight: "9px"}}>
      <p>Nome: {user && user.displayName}</p>
      <p>Email: {user && user.email}</p>
      <p>ID: {user && user.uid}</p>
      </div>
    <h2>Lista acquisti</h2>
      <div className="lista__uscita">
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
     
      <h2>Dettagli pagamento</h2>
      <fieldset style={{width:"-webkit-fill-available",textAlign:"justify"}}>
      <legend >Metodo di pagamento</legend> 
      <div className="paypal">
      <Radio
        checked={method === 'paypal'}
        onChange={handleChange}
        value="paypal"
        name="radio-buttons"
        inputProps={{ 'aria-label': 'A' }}
      />
        <img className="paypal" style={{width:"78%"}} src="https://www.paypalobjects.com/webstatic/mktg/logo/AM_mc_vs_dc_ae.jpg" alt="PayPal-acceptance-mark-picture" />
      </div>
      <div className="paypal stripe">
      <Radio
        checked={method === 'stripe'}
        onChange={handleChange}
        value="stripe"
        name="radio-buttons"
        inputProps={{ 'aria-label': 'B' }}
      />
       <img className="paypal"  style={{width:"78%"}} src="https://www.pngkey.com/png/detail/206-2068262_how-macro-really-works-checkout-pay-with-credit.png" alt="PayPal-acceptance-mark-picture" />
 
      </div>
    </fieldset>
      <table>
        <tbody>
          <tr>
            <td>Da pagare ora</td>
            <td align="right">   <CurrencyFormat
                renderText={(value) => (
                    <>
                    <p style={{lineHeight: "0px"}}>
                    <strong> {value}.00  </strong> 
                    </p>
                    </>
                )}
                decimalScale={2}
                value={getBasketTotal(basket)}
                displayType={"text"}
                thousandSeparator={true}
                prefix={"€ "}
            /></td>
          </tr>
          <tr>
            <td>Caparra al momento del ritiro (*per noleggi)</td>
            <td align="right"><CurrencyFormat
                renderText={(value) => (
                    <>
                    <p style={{lineHeight: "0px"}}>
                    <strong>   {value}.00  </strong> 
                    </p>
                    </>
                )}
                decimalScale={2}
                value={getCaparraTotal(basket)}
                displayType={"text"}
                thousandSeparator={true}
                prefix={"€ "}/></td>
          </tr>
        </tbody>
        </table>
        <hr />
        {showpaymentmethod === false &&
        <div className="warning">Inserisci Nome e Cognome di chi verrà a ritirare il prodotto</div> }
          { method === 'paypal' && showpaypal === true && showpaymentmethod === true &&
          <PayPal 
          name={name}
          surname={surname}
          caparra={getCaparraTotal(basket)}
          idbuyer={user && user.uid}
          email={user && user.email}
          props={props}
          total={totale}
          />
          }
          { method === 'stripe' && showpaymentmethod === true &&
            <Elements stripe={stripePromise}>
              <CheckoutForm />
            </Elements>
          }
    </div>   
    <div>
    </div>
  </div>
</div>
 </div>
</div>
    )
};


