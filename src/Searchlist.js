import React, { useEffect, useState, useLayoutEffect } from "react";
import Product from "./Product";
import { Button } from '@mui/material';
import { useParams } from "react-router-dom";
import barcode from "./barcode.png"
import 'react-toastify/dist/ReactToastify.css';
import { collection, getDocs, getFirestore,query, orderBy, where, limit, startAfter} from "firebase/firestore";
import { useTranslation } from "react-i18next";
import Loader from "./Loader";
import background from "./image-background/image4.jpg";
import { context } from "./App.js";


export default function Searchlist() {

    let { slug } = useParams();
    const db = getFirestore();
    const {products, setProduct} = React.useContext(context);
    const {lastProd, setLastProd} = React.useContext(context);
    const [loadProd, setLoadProd] = useState(false);
    const [showError, setShowError] = useState(false);
    const [numProdShow, setNumProdShowed] = useState(4)
    const [filteredProducts, setFilteredProduct] = useState([]);
    const { t } = useTranslation();
    const [showloader, setShowloader] = useState(true);

    /*INFINITE SCROLLING con FILTRO DI RICERCA, FILTRA E TIRA GIU RECORD DAL DB IN MODO DA MANTENERE SEMPRE UN TOT DI ELEMENTI IN VISTA.
    OVVIAMENTE FINO A QUANDO NON FINISCONO I RECORD NEL DB, SE A QUEL PUNTO NON CI SONO ELEMENTI 
    CHE SODDISFANO I PARAMETRI DI RICERCA INSERITII NEL DB VERRA MOSTRATO UN MESSAGGIO INDICANDO CHE NON CI SONO ELEMENTI DISPONIBILI .*/


    useEffect(() => {
        window.scrollTo(0, 0)
        if (products.length < 1) {
            fetchMyAPI()
            async function fetchMyAPI() {
                const q = query(collection(db, "products"),where("State","==","DISPONIBILE"),orderBy("CreatedOn","asc"),limit(4));
                const querySnapshot =  await getDocs(q);
                const saveFirebaseTodos = []; 
                querySnapshot.forEach((doc) => {
                saveFirebaseTodos.push(({id: doc.id, ...doc.data()}));
                setLastProd(doc.data().CreatedOn)
            });
            if(saveFirebaseTodos.length < 3) {
                setLastProd("")
            }
            setProduct(saveFirebaseTodos) 
            console.log(saveFirebaseTodos)
            }      
        }

    }, [])

    useEffect(() => {
        /* In questo useEffect vado a filtrare la ricerca andando a verificare che il numero dei prodotti filtrati sia di almeno 4 unità
        per non avere l'interfaccia troppo vuota, in caso contrario andrò a fare ulteriori chiamate all'API per ottenere altri prodotti che potrebbero
        avere le caratteristiche adatte. Fino a quando i prodotti nel database saranno terminati */

        const promise1 = new Promise((resolve) => {

            let filteredProd = products.filter((value) => {
                if (slug === "") {return value}
                else if ((value.Preview.toString().toLowerCase().includes(slug.toLowerCase())) || (value.Type.toString().toLowerCase().includes(slug.toLowerCase())) || (value.City.toString().toLowerCase().includes(slug.toLowerCase()))) {
                    return value
                }
            }); 
            setFilteredProduct(filteredProd)
            resolve(filteredProd);
        });

        promise1.then((value) => {
            if (value.length < numProdShow && lastProd !== '') {
                showOtherprods(); 
            }
            else {
                setLoadProd(false)
                setShowloader(false)
            }
        })
    }, [products, slug])


    const showOtherprods = () => {
        //funzione che viene chiamata per ottenere altri prodotti
        setLoadProd(true)
        fetchMyAPI()
        async function fetchMyAPI() {
            const q = query(collection(db, "products"),where("State","==","DISPONIBILE"),orderBy("CreatedOn","asc"),startAfter(lastProd),limit(4));
            const querySnapshot =  await getDocs(q);
            const saveFirebaseTodos = [];
            querySnapshot.forEach((doc) => {
            saveFirebaseTodos.push(({id: doc.id, ...doc.data()}));
            /*console.log(doc.id, " => ", doc.data());*/
            setLastProd(doc.data().CreatedOn)
        });
            if(saveFirebaseTodos.length < 4) {
                setLastProd("")
            }
            
            setProduct(products.concat(saveFirebaseTodos)) //vado ad aggiornare l'array
            /*controllo che il numero di articoli scaricati rimanenti sia pari o inferiore al limite importo nella query,
            in modo da sapere di essere arrivato alla fine e che quindi bisogna nascondere il button di "mostra altro"*/
            console.log(saveFirebaseTodos.length)
        }
    }


    useLayoutEffect(() => {
        // mi manda il messaggio di errore 
        if (filteredProducts.length < 1 && products.length > 0)
        setShowError(true)
        else
        setShowError(false)
    }, [filteredProducts])

    return (
        <div>
            { showloader && <Loader /> }
            <div className="headlist">
            <div className="headtext" style={{textAlign: "start"}}>
            <span className="intro intro--num"> <img src={barcode} width={50}/> </span>
            <span className="intro">{t("Risultati ricerca")}: {slug}</span>  
            </div>
            </div>
            <img className="home__photo" src={background} alt="" />
            <div className="footerdistance" style={{minHeight:"1300px"}}>   
            <div className="home__row" style={{marginTop:"-55%"}} >
                {filteredProducts.map((value, key) =>
                <Product 
                    key={key}
                    id={value.id}
                    idowner={value.IDowner}
                    tipo={value.Type}
                    title={value.Name} 
                    titleEN={value.NameEN}
                    preview={value.Preview}
                    previewEN={value.PreviewEN}
                    price={value.Price} 
                    priceday={value.Priceday}
                    city={value.City} 
                    image={value.Img} 
                />
                )}
                {showError && <h1 style={{position:"absolute"}}> Nessun elemento trovato </h1> }
            </div>
            {lastProd !== "" && loadProd === false &&
                <Button variant="contained" style= {{backgroundColor: "white",color: "black"}}  onClick={() => {showOtherprods(); setNumProdShowed(numProdShow + 4)}}  > {t("Mostra tutti i prodotti")} &nbsp; <i className="fa fa-angle-down" style={{fontSize:"20px"}}></i> </Button> || loadProd === true && <div className="lds-ring"><div></div><div></div><div></div><div></div></div> }
            </div>
        </div>
    )
}
