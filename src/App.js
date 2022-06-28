import React, {useState, useEffect, Suspense} from "react";
import { ToastContainer} from 'react-toastify';
import { BrowserRouter , Switch, Route} from "react-router-dom"; 
import './App.css';
import Header from "./Header";
import Home from "./Home";
import AddProducts from "./AddProducts";
import Searchlist from "./Searchlist";
import OwnShop from "./OwnShop";
import OwnOrders from "./OwnOrders";
import Dashboard from "./Dashboard";
import PageProducts from "./PageProduct";
import Paysection from "./Paysection";
import Aboutus from "./Aboutus";
import Rules from "./Rules";
import Checkout from "./Checkout";
import Login from "./Login";
import Signin from "./Signin";
import Forgetpassword from "./Forgetpassword";
import Contacts from "./Contacts";
import Footer from "./Footer";
import Loader from "./Loader";
import DeleteSub from "./DeleteSub";

import { initializeApp } from "firebase/app";
import { getAuth,onAuthStateChanged } from "@firebase/auth";



/* Esempio di pagina caricata a richiesta per non sovraccaricare
const PageProducts = React.lazy(() => {
  return new Promise(resolve => {
    setTimeout(() => resolve(import("./PageProduct")), 1000);
  });
});
*/



console.log('carrello salvato in localstorage:',JSON.parse(localStorage.getItem("localCart")))

//TENGO I DATI DI ACCESSO AL MIO FIREBASE NASCOSTI

const firebaseConfig = {

  databaseURL: "https://lermellino-1d498-default-rtdb.europe-west1.firebasedatabase.app",
  apiKey: process.env.REACT_APP_API_KEYS,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  projectId: process.env.REACT_APP_PROJECTID,
  storageBucket: "gs://lermellino-1d498.appspot.com",
  messagingSenderId: process.env.REACT_MESSAGINGSENDERID,
  appId: process.env.REACT_APPID,
  measurementId: process.env.REACT_MEASUREMENTID

};

// Initialize Firebase
initializeApp(firebaseConfig);
export const context = React.createContext(null);



function App() {

const [showpop,setShowpop] = useState(false); //setto il pop-up 
const [showloader, setShowloader] = useState(true);
const [user, setUser] = useState(null);
const [language, setLanguage] = useState(null);

useEffect(() => {
const auth = getAuth();
onAuthStateChanged(auth, user => {
  setUser(user)
})
}, [])

  return (
    <BrowserRouter>
    <Suspense fallback={<Loader />}>
    <context.Provider value={{ showpop, setShowpop, language, setLanguage}} >
      <div className="App">
      <ToastContainer />
        <Switch>
        <Route path="/lermellino/aboutus">
          <Header />

    
            <Aboutus> 
            </Aboutus>
          

            <Footer />
            </Route>
            <Route path="/lermellino/rules">
          <Header />

    
            <Rules> 
            </Rules>
          

            <Footer />
            </Route>
            <Route path="/lermellino/contacts">
          <Header />

            <Contacts> 
            </Contacts>
 

            <Footer />
            </Route>
        <Route path="/lermellino/signin">
          <Header />

    
            <Signin> 
            </Signin>
          

            </Route>

          <Route path="/lermellino/login">
            <Header />
          
      
            <Login> 
            </Login>
            

            </Route>
          <Route path="/lermellino/resetpassword">

      
            <Forgetpassword> 
            </Forgetpassword>
            

            </Route>
        <Route path="/lermellino/checkout">
              <Header />

        
            <Checkout />
            

            <Footer />
          </Route>
          <Route path="/lermellino/ownshop">
            <Header />

      
            <OwnShop> 
            </OwnShop>
          

            <Footer />
            </Route>
            <Route path="/lermellino/ownorders">
          <Header />

          
            <OwnOrders> 
            </OwnOrders>
            

            <Footer />
            </Route>
          <Route path="/lermellino/addproducts">
          <Header />

          
            <AddProducts> 
            </AddProducts>
            

            </Route>
            <Route path="/lermellino/dashboard">
            <Header />

          
            <Dashboard> 
            </Dashboard>
          

            <Footer />
            </Route>
            <Route path="/lermellino/search/:slug">
          <Header />

          
            <Searchlist> 
            </Searchlist>
            

            <Footer />
            </Route>
            <Route path="/lermellino/pageproduct/:id">
            <Header />
            
            
            <PageProducts> 
            </PageProducts>
           

            <Footer />
            </Route>
            <Route path="/lermellino/paysection">
            <Header />

            
            <Paysection> 
            </Paysection>
            

            </Route>

            <Route path="/lermellino/deletesub/:email">
              <DeleteSub></DeleteSub>
            </Route>
            
            <Route path="/lermellino/">
            <Header />        
            <Home />       
            <Footer />
          </Route>

            
            
        </Switch>
      </div>
      </context.Provider>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
