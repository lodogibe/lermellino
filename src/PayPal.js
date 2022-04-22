import React, { useRef, useEffect, useState } from "react";
import { doc, updateDoc, arrayUnion, getFirestore, addDoc, collection} from "firebase/firestore";
import { useHistory } from "react-router-dom"; 
import Loader from "./Loader";




/*per utilizzare paypal va inserito l'src script nell'index.html della cartella public! */
export default function Paypal({name,surname,props,total,email, idbuyer, caparra}) {

  
  //Faccio questo passaggio per nascondere l'accesso alla mia API grazie all'ENV
  console.log(name,surname,props,total,idbuyer)
  require('dotenv').config()

  console.log(process.env.REACT_APP_API_KEY)
  
  let history = useHistory();
  const amount = total;
  console.log(amount)
  const paypal = useRef();
  const db = getFirestore();
  let infoprod = [];
  let info = '';
  let html = '';
  let allinfo = [];
  let allinfoS = [];
  const [showloader, setShowloader] = useState(false);
  
  const location = {
    pathname: '/lermellino/',
    state: { fromCheckout: true }
  }

//faccio il resoconto di ogni singolo ordine in una sola stringa per poter archiviare e mandare il resoconto via email in html
  useEffect(() => {
    html = "<h2> Resoconto del suo ordine eseguito il: " + s + " </h2> <br> <h3> Spesa totale: <h2> " + total + " € <h2> </h3> <br> <h3> Caparra totale: <h2> " + caparra + " € <h2> </h3> <br> <h3> Persona delegata al ritiro (presentarsi con documento di identita valido: " + name + " " + surname + " </h3>  <br> <h2> Lista delle sue operazioni: </h2>  <br> "           
    for(var i = 0; i < props.length; i++) 
    {
      if(props[i].tipo === 'NOLEGGIO')
      {
      info = "<br> Id prodotto: " + props[i].id + " <br> Nome articolo: " + props[i].title + " <br> Tipo : Noleggio <br> Data inizio noleggio: " + props[i].startDate + " - Data fine noleggio: " + props[i].endDate + " <br> Caparra: " + props[i].caparra;
      allinfo = {id: props[i].id, titolo: props[i].title, tipo: "Noleggio", caparra: props[i].caparra, datainizio: props[i].startDate, datafine: props[i].endDate, prezzo: props[i].price, foto: props[i].image[0], data: s}
      infoprod.push(info) //pusho le info in questo modo per avere la lista in vettori 
      allinfoS.push(allinfo);
      html = html + " <br> " + info; //creo l'html e lo mando a capo ogni volta
      console.log(html)
      console.log(allinfoS)
      }
      else {
      info = "<br> Id prodotto: " + props[i].id + " <br> Nome articolo: " + props[i].title + " <br> Nome articolo: " +  props[i].price + " <br> Tipo : Acquisto " ;
      allinfo = {id: props[i].id, titolo: props[i].title, tipo: "Acquisto", prezzo: props[i].price, foto: props[i].image[0], data: s }
      infoprod.push(info)
      allinfoS.push(allinfo);
      html = html + " <br> " + info;
      console.log(html)
      console.log(allinfoS)
      }
    }
  }, []);


  //formatta l'ora nella maniera che più aggrada, questo caso nel format Italiano tipo , esempio 12 Maggio 2022 
  function join(t, a, s) {
    function format(m) {
      let f = new Intl.DateTimeFormat('it', m);
      return f.format(t);
      }
    return a.map(format).join(s);
    }
 
 let a = [{day: 'numeric'}, {month: 'long'}, {year: 'numeric'}];
 let s = join(new Date, a, ' ');
 console.log(s);

 
  const [mailerState, setMailerState] = useState({
    sender: "L'ERMELLINO",
    email: email,
    subject: "",
    message: "Resoconto del suo ordine eseguito il: " + s,
    html: "",
  });

  useEffect(() => {
    
    window.paypal.Buttons({
        createOrder: (data, actions, err, total) => {
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [
              {
                description: "Acquisto dall'ermellino",
                amount: {
                  currency_code: "EUR",
                  value: amount,
                },
              },
            ],
          });
        },
        onApprove: async (data, actions) => {
        setShowloader(true);
        const productRef = doc(db, "products", props[0].id);
        const order = await actions.order.capture();          
        //A PAGAMENTO ANDATO CON SUCCESSO RIMUOVO IL PRODOTTO DALLA DISPONIBILITA, O SE è UN NOLEGGIO AGGIUNGO LE DATE IN CUI NON SARA DISPONIBILE AL DATABASE PRINCIPALE
        if(props[0].tipo === "NOLEGGIO") 
        {
          await updateDoc(productRef, {
            datesbooked: arrayUnion(...props[0].totalday) //MESSO CON I PUNTINI PER AGGIUNGERE UN ARRAY 
          });
        }
        else{
          await updateDoc(productRef, {
            State: "VENDUTO" 
          });
        }    
        
        try {
          //METTO L'ORDINE NEL DATABASE
          const docRef = addDoc(collection(db, "orders"), {
            clientID:idbuyer,
            emailclient:email,      
            infoproducts:allinfoS,
            CreatedOn: Date.now(),
              }).then(function(docRef) {
                //setto l'id dell'ordine che poi spedisco per email al cliente
                console.log(docRef.id)
                mailerState.subject = "Ricevuta ordine: " + docRef.id;
                mailerState.html = html + "<br> <br> <br> <br> <p> Copyright &copy; All Rights Reserved by ERMELLINO S.P.A. </p>";
              }).then(() => { 
              submitEmail();
              })
              } catch (e) {
                  console.error("Error adding document: ", e);
                } 
  
                const submitEmail = async () => {
             
                  console.log({ mailerState });
                  const response = await fetch("https://hosteapitestlodux.herokuapp.com/"+process.env.REACT_APP_API_KEY, {
                  method: "POST",
                  headers : { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                  },
                  body: JSON.stringify({ mailerState }),
                })
                  .then((res) => res.json())
                  .then(async (res) => {
                    const resData = await res;
                    console.log(resData);
                    if (resData.status === "success") {
                      
                    } else if (resData.status === "fail") {
                      alert("Message failed to send");
                    }
                  })
                  .then(() => {
                      setShowloader(false);
                      history.push(location)
                  });
                }

        console.log(order,name,surname,props,amount,props[0].totalday);
        },
        onError: (err) => {
          console.log(err);
        },
      })
      .render(paypal.current);
  }, []);


  return (
    <div>
      <div ref={paypal}>
      { showloader && <Loader /> }
      </div>
    </div>
  );
}