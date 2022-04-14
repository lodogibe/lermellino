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
  apiKey: process.env.REACT_APP_API_KEYS,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  projectId: process.env.REACT_APP_PROJECTID,
  databaseURL: process.env.REACT_DATABASEURL,
  storageBucket: process.env.REACT_STORAGEBUCKET,
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
    <context.Provider value={{ showpop, setShowpop, showloader, setShowloader, language, setLanguage}} >
      <div className="App">
      <ToastContainer />
        <Switch>
        <Route path="/aboutus">
          <Header />

    
            <Aboutus> 
            </Aboutus>
          

            <Footer />
            </Route>
            <Route path="/rules">
          <Header />

    
            <Rules> 
            </Rules>
          

            <Footer />
            </Route>
            <Route path="/contacts">
          <Header />

            <Contacts> 
            </Contacts>
 

            <Footer />
            </Route>
        <Route path="/signin">
          <Header />

    
            <Signin> 
            </Signin>
          

            </Route>

          <Route path="/login">
            <Header />
          
      
            <Login> 
            </Login>
            

            </Route>
          <Route path="/resetpassword">

      
            <Forgetpassword> 
            </Forgetpassword>
            

            </Route>
        <Route path="/checkout">
              <Header />

        
            <Checkout />
            

            <Footer />
          </Route>
          <Route path="/ownshop">
            <Header />

      
            <OwnShop> 
            </OwnShop>
          

            <Footer />
            </Route>
            <Route path="/ownorders">
          <Header />

          
            <OwnOrders> 
            </OwnOrders>
            

            <Footer />
            </Route>
          <Route path="/addproducts">
          <Header />

          
            <AddProducts> 
            </AddProducts>
            

            </Route>
            <Route path="/dashboard">
            <Header />

          
            <Dashboard> 
            </Dashboard>
          

            <Footer />
            </Route>
            <Route path="/search/:slug">
          <Header />

          
            <Searchlist> 
            </Searchlist>
            

            <Footer />
            </Route>
            <Route path="/pageproduct/:id">
            <Header />
            
            
            <PageProducts> 
            </PageProducts>
           

            <Footer />
            </Route>
            <Route path="/paysection">
            <Header />

            
            <Paysection> 
            </Paysection>
            

            </Route>

            <Route path="/deletesub/:email">
              <DeleteSub></DeleteSub>
            </Route>
            
            <Route path="/">
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
