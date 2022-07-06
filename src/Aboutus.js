import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css'; //importo AOs per gli effetti di fade-in degli elementi
import Foto from './old-staff-removebg-preview.png';
import Pappagallo from './pappagallo.jpg';
import Pavone from './pavone.jpg';
import Struzzo from './struzzo.jpg';
import { useTranslation } from "react-i18next";
import background from './image-background/image7.jpg';

export default function Aboutus() {

  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0)
    AOS.init({
      duration : 2000
    });
  }, []);


  return <div className='aboutus' style={{minHeight:"100%"}}>   
          <img className="home__photo" style={{position:"relative"}} src={background} alt="" />   
          <div className="footerdistance" style={{minHeight:"1000px"}}>       
            <div className="home__row" style={{display:"block", marginTop:"-55%"}}>    
              <div className='text-on-image section'>
                <p className="vintage vintage__top"></p>
                <p className="vintage vintage__bot" style={{fontSize: "calc(9vh + 20px)"}}>{t("Chi siamo")}</p>
              </div>
              <div className="box">
                <hr style={{marginRight:"110px",border:"1px solid white"}}/>
                  <div className="textbox">
                    {t("L'Ermellino è un progetto E-COMMERCE di articoli di seconda mano con ritiro in sede, sviluppato a scopo di Portofolio da Lodovico Giberti.")}
                    <br />
                    {t("Le varie sedi, che in questo prototipo sono presenti solo a Milano e Roma, svolgono un compito di magazzino e tutela sia per il venditore che per l'acquirente.")}
                  </div>
              </div>
              <img src={Foto} alt="cop" width="100%" style={{marginTop:"50px",maxWidth:"550px"}}/>
              <hr style={{marginTop:"20px"}} />
              <div className="textbeforcard">
              {t("Scopri le carte, scopri le nostre priorità...")}
              </div>
              <hr />
              <div className="container2" data-aos="fade-in">
                <div className="cardarrow" >
                  <svg id="more-arrows">
                    <polygon className="arrow-top" points="37.6,27.9 1.8,1.3 3.3,0 37.6,25.3 71.9,0 73.7,1.3 "/>
                    <polygon className="arrow-middle" points="37.6,45.8 0.8,18.7 4.4,16.4 37.6,41.2 71.2,16.4 74.5,18.7 "/>
                    <polygon className="arrow-bottom" points="37.6,64 0,36.1 5.1,32.8 37.6,56.8 70.4,32.8 75.5,36.1 "/>
                  </svg>
              
        <div className="card2">
          
            <span></span>
            <div className="prBox"> <img src={Struzzo} alt="latte" /> </div>
            <div className="content2">
                <div>
                    <h2>{t("SICUREZZA")}</h2>
                    <p>{t("I nostri magazzini sono dotati dei sistemi di sicurezza più all'avanguardia del mercato.")}</p>
                </div>
            </div>
        </div>
</div>

<div className="cardarrow">
                  <svg id="more-arrows">
                    <polygon className="arrow-top" points="37.6,27.9 1.8,1.3 3.3,0 37.6,25.3 71.9,0 73.7,1.3 "/>
                    <polygon className="arrow-middle" points="37.6,45.8 0.8,18.7 4.4,16.4 37.6,41.2 71.2,16.4 74.5,18.7 "/>
                    <polygon className="arrow-bottom" points="37.6,64 0,36.1 5.1,32.8 37.6,56.8 70.4,32.8 75.5,36.1 "/>
                  </svg>
              
        <div className="card2">
          
            <span></span>
            <div className="prBox"> <img src={Pappagallo} alt="latte"  /> </div>
            <div className="content2">
                <div>
                <h2>{t("AFFIDABILITA")}</h2>
                    <p>{t("Il trattamento e la gestione della vostra merce sarà sempre fatto nel massimo rispetto delle regole e del buon senso.")} </p>
                </div>
            </div>
        </div>
</div>

<div className="cardarrow">
                  <svg id="more-arrows">
                    <polygon className="arrow-top" points="37.6,27.9 1.8,1.3 3.3,0 37.6,25.3 71.9,0 73.7,1.3 "/>
                    <polygon className="arrow-middle" points="37.6,45.8 0.8,18.7 4.4,16.4 37.6,41.2 71.2,16.4 74.5,18.7 "/>
                    <polygon className="arrow-bottom" points="37.6,64 0,36.1 5.1,32.8 37.6,56.8 70.4,32.8 75.5,36.1 "/>
                  </svg>
              
        <div className="card2">
          
            <span></span>
            <div className="prBox"> <img src={Pavone} alt="latte" /> </div>
            <div className="content2">
                <div>
                <h2>{t("PRECISIONE")}</h2>
                    <p>{t("Ci affidiamo alle migliori tecnologie software per la gestione di tutti i dati e le informazioni riguardanti ogni singolo prodotto che vendiamo o noleggiamo.")}</p>
                </div>
            </div>
        </div>
</div>

<div className="box" style={{textAlign:"end"}}>
                <hr style={{marginLeft:"110px",border:"1px solid white"}}/>
                  <div className="textbox" style={{marginRight:"0px",marginLeft:"110px"}}>
                  {t("Il progetto consiste nel creare un luogo dove chiunque puo vendere o noleggiare un suo oggetto.")}
                    <br />
                  {t("L'inserimento di un prodotto o l'acquisto / noleggio vengono sempre fatti attraverso la piattaforma, il ritiro però avviene in sede sotto la nostra supervisione.")} </div>
              </div>
            </div>
          </div>
        </div>
      </div>;
}
