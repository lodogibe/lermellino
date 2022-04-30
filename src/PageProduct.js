import React, { useEffect, useState, useLayoutEffect } from "react";
import "./PageProduct.css"; 
import { Button } from '@mui/material';
import { useParams, useLocation} from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { getAuth} from 'firebase/auth';
import { doc, getFirestore, getDoc,  query, orderBy, where, collection, getDocs} from "firebase/firestore";
import { useStateValue } from './StateProvider';
import ImageGallery from 'react-image-gallery';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRange } from 'react-date-range';
import moment from 'moment';
import CommentForm from "./CommentForm";
import Comment from "./Comment";
import { getDatabase, ref, set, get , child } from "firebase/database";
import barcode from "./barcode.png"
import { toast } from 'react-toastify';
import { context } from "./App.js";
import { useTranslation } from "react-i18next";
import Loader from "./Loader";


function PageProduct() {

    var today = new Date();
    const images = [];  
    const [gallery,setGallery] =  useState([])
    const [img,setImages] = useState([])
    const [totaldays,setTotaldays] = useState([])
    const [show,setShow] = useState(false);
    const [startDate,setStartDate] = useState(new Date(today.setDate(today.getDate() + 1)));
    const [endDate,setEndDate] = useState(new Date(today.setDate(today.getDate())));
    const db = getFirestore();
    const [products, setProduct] = useState([]);
    const dbr = getDatabase();
    const auth = getAuth();
    const user = auth.currentUser;
    const [iduser,setId] = useState('');
    const [email,setEmail] = useState('');
    const [totalcost, setTotalcost] = useState(0);
    const [caparra, setCaparra] = useState(0);
    const [comments, setComments] = useState([]);
    const [subDays,setSubDay] = useState([]);
    let { id } = useParams();
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const location = useLocation();
    const [textrent,setTextrent] = useState("");
    const [textbuy,setTextbuy] = useState("");
    const [textdeposit, setTextdeposit] = useState("");
    const language = React.useContext(context);
    const { t, i18n } = useTranslation();
    const [showloader, setShowloader] = useState(false);
  
    //utilizza l'useContext per cambiare la lingua
    useEffect(() => {
      if(language.language === 'en') {
        setTextbuy("Purchase");
        setTextrent("Rent");
        setTextdeposit("*per days selected")
      }
      else {
        setTextbuy("Acquista");
        setTextrent("Noleggia");
        setTextdeposit("*per le giornate selezionate")
      }
    },[language]);
    
    
    const startdate = new Intl.DateTimeFormat('eu-EU', { year: 'numeric', month: '2-digit', day: '2-digit'}).format(startDate)
    const enddate = new Intl.DateTimeFormat('eu-EU', { year: 'numeric', month: '2-digit', day: '2-digit'}).format(endDate)

    useEffect(() => {
        if (user !== null) {
          const uid = user.uid;
          setId(uid);
          const email = user.email;
          setEmail(email)
        }
        }, [user])

    //gestione settaggio data inizio e data fine    
    const handleselected = (ranges) => {
        setStartDate(ranges.selection.startDate);
        setEndDate(ranges.selection.endDate);
    };

    const selectionRange = {
        startDate: startDate,
        endDate: endDate,
        key: 'selection',
      }


    useLayoutEffect(() => { 
        //fase di assegnazioni dei valori che può cambiare nei prodotti a noleggio, ma per comodità messa anche assegnazione valore totale articolo in vendita
    if (products.Type === 'VENDO') {
        setTotalcost(products.Price)
        setCaparra(0)
    }
    else {
        setTotalcost(products.Priceday)
        setCaparra(products.Price - products.Priceday)
        }
    }, [products])


      useLayoutEffect(() => {            
        //useEffect necessario a recuperare tt le date tra i due intervalli di tempo inseriti dall'utente, applicata per comodità nelle fasi di ricerca ed esclusione date
        var getDaysBetweenDates = function(start, end) {
        var now = start.clone(), dates = [];
        var total = 0
        var caparrone = 0
      
        while (now.isSameOrBefore(end)) {
                dates.push(now.format('YYYY/MM/DD'));
                now.add(1, 'days');
                total = total + products.Priceday;
                caparrone = products.Price - total;
                console.log(total)
                setTotalcost(total)
                setCaparra(caparrone)
            }
            return dates;
        };
      
      var start = moment(startDate);
      var end = moment(endDate);
      
      var dateList = getDaysBetweenDates(start, end);
      setTotaldays(dateList);
      console.log(dateList);}, [startDate, endDate])



    //Recupero le info del prodotto
    useEffect(() => {
        async function fetchMyAPI() {
            const docRef = doc(db, "products", id);
            const docSnap = await getDoc(docRef);
            setProduct(docSnap.data())
            return docSnap.data()
            } 

            fetchMyAPI().then((value) => { 
                //dopo aver recuperato nella maniera completa le info dal database comincio la fase di assegnazione dei valori al calendario e il caousel delle immagini

                //if per far si che solo quando si è nella schermata di un prodotto a noleggio vengano aggiornate nel format corretto le date da disabilitare perchè gia prenotate
                if(value.Type === 'NOLEGGIO') {
                    //variabile in let che verrai poi pushata con le date nel format leggibile dal date-range-picker e disattivare i giorni in cui il prodotto è prenotato
                    let datesArray = [];
                    console.log(value.datesbooked)

                    //per evitare che vada in errore quando non è ancora stata noleggiata una data
                    if(value.datesbooked != null) {
                    datesArray =  value.datesbooked.map(dateString => new Date(dateString))   
                    }

                    setSubDay(datesArray) 
                    }

                //aggiornamento nel format corretto delle immagini
                for (let i = 0; i < value.Img.length; i++) {
                    images.push({
                        original: value.Img[i],
                        thumbnail: value.Img[i],
                      });
                      if (i === (value.Img.length - 1))
                      {
                      setImages(images)
                      }
                    }
                })
        }, [])


    useLayoutEffect(() => { setGallery(img); setShow(true); }, [img])


    const [{basket},dispatch] = useStateValue();
    var basketlenght = basket?.length;
    const checkcart = [];
    const lastcart = [];
    var checkprodincart = '';
    var sentence = 'good';

    //TUTTA SERIE DI CONTROLLI PER VERIFICARE SE IL PRODOTTO NON é IN UN ALTRO CARRELLO O é STATO ACQUISTATO/NOLEGGIATO MENTRE IL CLIENTE ERA GIA NELLA PAGINA DEL PRODOTTO

    const addtoBasket = () => {  

    setShowloader(true)
    const timestamp = Date.now();

    console.log(basketlenght);

    for (var i = 0; i < basketlenght; i++) //controllo se l'id di questo prodotto è gia presente nel mio carrello    
    { checkprodincart = (basket[i].id).includes(id)  }
  
        if (user && basketlenght < 5 && checkprodincart == false) {

            // qui gli faccio rifare un controllo di sicurezza al database principale per vedere se nel mentre che lui guardava il prodotto qualcuno non ha acquisto questo prodotto
            fetchMyAPI()
            async function fetchMyAPI() {
            const docRef = doc(db, "products", id);
            const docSnap = await getDoc(docRef);
            const saveFirebaseTodos = []; 

            if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            saveFirebaseTodos.push(docSnap.data());
            console.log(saveFirebaseTodos[0].Type);
            if(saveFirebaseTodos[0].State === 'DISPONIBILE') 
            {
                if(saveFirebaseTodos[0].Type === 'NOLEGGIO') 
                { 
                    var found = "";
                    if(saveFirebaseTodos[0].datesbooked != undefined) {
                    found = saveFirebaseTodos[0].datesbooked.some(r => totaldays.includes(r))
                    console.log(found)
                    }
                    else {
                    found = false;
                    console.log(found)
                    }
                    if(found === false)
                    checkothercarts(); //non sono state trovate date già prenotato nel mentre, quindi procedo a controllare i carrelli provvisori
                    else
                    {   //state trovate date già prenotato nel mentre, quindi faccio refreshare la pagina all'user per valutare le date disponibili
                        setShowloader(false)
                        toast.warning("Siamo spiacenti, ma il prodotto è stato già prenotato per alcune delle date selezionate, ricarica la pagina e verifica le date ancora disponibili" , { 
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
                else 
                checkothercarts(); //in quanto è disponibile ed è un acquisto definitivo, ora c'è solo da controllare gli altri carrelli
            }
            
            else { 
                setShowloader(false)
                toast.warning("Siamo spiacenti, ma il prodotto non è più disponibile" , { 
                    position: "top-left",
                    autoClose: true,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    });
                
                //alert('siamo spiacenti, ma il prodotto non è più disponibile') 
            }

            } else { 
                setShowloader(false)
                toast.warning("Siamo spiacenti, ma il prodotto non è più disponibile" , { 
                    position: "top-left",
                    autoClose: true,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    });
                //alert('siamo spiacenti, ma il prodotto non è più disponibile')
            console.log("No such document!");
            }
        }

        //puo eseguire questa funzione in quanto ha superato gli altri requisiti qui sopra
        const checkothercarts = () => { 

          const dbRef = ref(getDatabase());
            get(child(dbRef, `users/`)).then((snapshot) => {
            if (snapshot.exists()) {
                console.log(snapshot.val());
                for(var i in snapshot.val())
                checkcart.push([i, snapshot.val() [i]]);
                

            } else {
                console.log("No data available, quindi via libera che dopo rimetto su good per non fare un altro CASE nello switch"); 
                sentence="vialibera";
            }
            }).then(() => 
            {   console.log(timestamp);

                for (var j = 0; j < checkcart.length; j++) {

                    for(var i in checkcart[j][1])
                    lastcart.push([i, checkcart[0][1] [i]]);
                    console.log(lastcart)

                }
            }).then(() => { 

            if( sentence !== 'vialibera') {

            for (var g = 0; g < lastcart.length; g++) {  

                console.log(lastcart[g][1])

                if(lastcart[g][0] === id) 
                {
                    console.log(lastcart[g][1].CreatedOn)
                    var timecheck = timestamp - lastcart[g][1].CreatedOn;
                    console.log(sentence,timestamp,timecheck)

                    if ( timecheck < 240000 ) //240000 sono i millisecondi corrispondenti ai 4 minuti di tempo per completare l'acquisto di chi ha il prodotto nel carrello
                    { 
                        console.log(lastcart[g][1].tipo)
                        if (lastcart[g][1].tipo === "NOLEGGIO" ) { 

                        const found = lastcart[g][1].totalday.some(r=> totaldays.includes(r))

                        console.log(found)

                        if(found === true)
                        sentence = 'articolo con date in comune in altro carrello'

                        }
                        else {sentence ='articolo in vendita in un altro carrello'}
                    }
                    else { sentence="good" }
                }  

            }} else { sentence="good" }})

            .catch((error) => {
            console.error(error);

            }).finally(() => { 
            
            console.log(sentence)

            switch (sentence) {

            case 'good' :

            setShowloader(false);
                 
                    set(ref(dbr, 'users/' + iduser + '/' + id), {
                        id: id,
                        preview: products.Preview,
                        title: products.Name,
                        titleEN: products.NameEN,
                        image: products.Img,
                        price: totalcost,
                        startDate: startdate,
                        endDate: enddate,
                        totalday: totaldays,
                        city: products.City,
                        tipo: products.Type, 
                        CreatedOn: timestamp,
                        idbuyer: iduser,
                        caparra: caparra,
                    });
                
                //manda l'articolo all data layer (il punto raccolta dati)
                dispatch({
                    type: 'ADD_TO_BASKET',
                    item: {
                        id: id,
                        preview: products.Preview,
                        title: products.Name,
                        titleEN: products.NameEN,
                        image: products.Img,
                        price: totalcost,
                        caparra: caparra,
                        startDate: startdate,
                        endDate: enddate,
                        totalday: totaldays,
                        city: products.City,
                        tipo: products.Type,
                        CreatedOn: timestamp, 
                        idbuyer: iduser,
                    }
                }) 

                break;

                case 'articolo in vendita in un altro carrello':
                    setShowloader(false)
                    toast.warning("Siamo spiacenti, articolo in vendita in un altro carrello, riprova tra qualche minuto" , { 
                        position: "top-left",
                        autoClose: true,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        });
                  

                break;

                case 'articolo con date in comune in altro carrello':
                    setShowloader(false)
                    toast.warning("Siamo spiacenti, articolo con date in comune in un altro carrello, riprova tra qualche minuto o cambia le date" , { 
                        position: "top-left",
                        autoClose: true,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        });
                   
 
                break;

                }
            }); 
            }
        } 

        else 
        { 
          if (!user) {
            setShowloader(false)
            toast.error("Devi prima effettuare il login per poter prenotare un prodotto nel carrello" , { 
                position: "top-left",
                autoClose: true,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                });
    
          } else if (basketlenght > 3) {
            setShowloader(false)
            toast.error("Hai gia troppi articoli bloccati nel tuo carrello, bloccando i prodotti il massimo prenotabile per volta è di soli 3 articoli" , { 
                position: "top-left",
                autoClose: true,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                });
            
          }
          else { 
            setShowloader(false)
            toast.error("Questo articolo è già presente nel carrello, se è un noleggio e lo vuoi noleggiare un altra volta dovrai fare un altro carrello" , { 
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
    }

useLayoutEffect(() => { getComments() },  [location])
        
        async function getComments() {
            const q = query(collection(db, "comments"),where("Idpost","==", id),orderBy("CreatedOn","asc"));
            const querySnapshot =  await getDocs(q);
            const saveFirebaseTodos = []; 
            querySnapshot.forEach((doc) => {
            saveFirebaseTodos.push(({id: doc.id, ...doc.data()}));
        });
        console.log(saveFirebaseTodos.length) 
        setComments(saveFirebaseTodos)
    };   



    return (
        <div className="pageprod">
        { showloader && <Loader /> } {/* loader di inizializzazione */}
        <div className="headlist"> 
        
        <div className="headtext" style={{textAlign: "start"}}>
            <span className="intro intro--num"> <img src={barcode} width={50}/> </span>
            <span className="intro">{products.Type === "NOLEGGIO" ? textrent  : textbuy }</span>
            </div>
        
        </div>

        <div className="allblock">
            <div className="pageproduct">
                <div className="pageproduct__info">
                    <div className="pageproduct__description">
                        <h2>{language.language === 'en' ? products.NameEN : products.Name}</h2>
                        {show === true &&
                        <ImageGallery items={gallery} /> }
                    </div>
                </div>  

                <div className="vl"></div>
                
           <div className="pageproduct__right">
           <br />
                    <h3>{language.language === 'en' ? products.PreviewEN : products.Preview}</h3>
                    <div className="page__description">
                    <p>{language.language === 'en' ? products.DescriptionEN : products.Description}</p>
                    </div>
 
                    <div className="pageproduct__aggiungi">
                    {products.Type === "NOLEGGIO" && show === true &&
                    <div>
                    <DateRange
                    minDate={tomorrow}
                    ranges={[selectionRange]}
                    onChange={handleselected}
                    disabledDates={subDays}
                    /> </div> }


                    <div className="pageproduct__rating">
                    {products.City} 

                    <h3> € {totalcost} {products.Type === "NOLEGGIO" ? textdeposit  : "" } </h3>
                    {products.Type === "NOLEGGIO" && <div className="pageproduct__aggiungi"> {t("Deposito caparra")}: {caparra} €  <div className="infocaparra">*{t("differenza tra costo noleggio e valore totale del prodotto, per ulteriori info controlla il nostro regolamento")} </div>  </div>  }
           <Button className="buttons" style={{backgroundColor:"#00A19D", border: "1px solid black",height:"39.9px"}} onClick={addtoBasket}>{t("Aggiungi al carrello")}</Button>
           </div>
            </div>
        </div>
        </div>
        <div className="comments">
        <CommentForm 
        name = {user && user.displayName}
        idpost = {id}
        type = 'comment'
        email = {email}
        iduser = {iduser}
        /> 
        <div className="comments-container">
        {comments.map((value,key) => (
          <Comment
          key = {key}
            id = {value.id}
            idprodowner = {products.IDowner}
            comment = {value.Text}
            idowner = {value.IDuser}
            nameowner = {value.Name} 
            date = {value.CreatedOn.seconds}
            name = {user && user.displayName}
            idpost = {id}
            email = {email}
            iduser = {iduser}
            whatis = 'comments'
            iddad = {value.id}
          /> ))}
          </div>
        </div> 
        </div>
        </div>

    )
}

export default PageProduct
