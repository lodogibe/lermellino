import React from 'react';
import './Rules.css';
import { useTranslation } from "react-i18next";

export default function Rules() {

  const { t } = useTranslation();

  return <div className='rules' style={{minHeight:"100%"}}>     
            <img className="home__photo" style={{position:"relative"}} src="https://global-uploads.webflow.com/5d7cb2fda3db082fa2313a36/6083433d71f01d2f3be6987e_second%20hand%20shop.jpeg" alt="" />   
            <div className="footerdistance" style={{minHeight:"1000px"}}>       
              <div className="home__row" style={{display:"block", marginTop:"-55.6%"}}>          
                <div className='text-on-image first'>
                  <p className="vintage vintage__top"></p>
                  <p className="vintage vintage__bot" style={{fontSize: "calc(9vh + 20px)"}}>{t("Regolamento")}</p>
                </div>
                <div className="rules__section">
                  <div className="first__text">
                  <div className="box" style={{width:"100%",margin:"0", maxWidth:"fit-content"}}>
                <hr style={{marginRight:"110px",border:"1px solid white"}}/>
                  <div className="textbox">
                  <p>
                    - {t("La missione dell'Ermellino è quella di creare un ambiente comodo e sicuro per poter dare la possibilitò di vendere o noleggiare un proprio prodotto senza avere a che fare direttamente con il cliente.")}
                    
                    <br />
                    <br />

                    - {t("Per poter mettere un tuo articolo all'interno della nostra lista dovrai procedere tu stesso ad inserire l'articolo con relative foto nella sezione aggiungi articolo che troverai nella sezione 'Vendi o noleggia'.")}

                    <br />
                    <br />
                    
                    - {t("Una volta inserito l'articolo, verrà inseritò in una lista di attesa dal quale potrà essere accettato solamente dal momento che l'articolo verrà consegnato al magazzino selezionato in fase di inserimento, se le foto e il valore saranno considerati corretti, l'articolo verrà approvato e sarà quindi acquistabile o noleggiabile.")} 
                    
                    <br />
                    <br />
                    
                   - {t("L'acquisto e il noleggio degli articoli presenti in questa DEMO possono essere fatti solamente attraverso un profilo sandbox di paypal in quanto l'applicazione è a solo scopo dimostrativo e i prodotti non sono quindi reali.")}
                  </p>
                  </div>
                  </div>
                                 
                  </div>  <hr style={{marginTop:"20px"}} />   <div className='separe' style={{marginTop:"40px", backgroundColor:"#1a1a1ab3", height:"20px",marginBottom:"40px"}}></div>
                  <hr />   
                  <ul style={{backgroundColor: "rgb(234 237 237 / 20%)",padding:"25px",fontWeight:"600"}}>
                    <li>
                  
                      

                     
                  
                      <i></i>
                      <h2>{t("Linee Guida")}</h2>
                      <b>I. {t("Commenti sotto i Post")}<br /> </b>
                  {t("E' possibile commentare i gli articoli semplicemente creando un account, qualsiasi commento ritenuto offensivo o non idoneo potrà essere eliminato dal nostro Staff.")}
                  <br />
                        
                  <br />
                  <b>II. {t("Regole sul pagamento")} <br /> </b>
                  {t("Il pagamento può essere testato solamente con PayPal in modalità sandbox in quanto è un sito portofolio NON IN PRODUZIONE")}.
                  <br />
                        
                  <br />
                  <b>III. {t("Altra regola Random")}<br /> </b>
                    {t("Non è consentito alcun tipo di ...")}  <br />
                        
                  <br />
                  <b>IV. {t("Altra regola Random")} <br /> </b>
                  {t("Non è consentito alcun tipo di ...")}    <br />
                    
                    </li>

                  </ul>
                  </div>
                  </div>
              </div>
          </div>
         
}
