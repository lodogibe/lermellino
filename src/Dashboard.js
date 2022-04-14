import "./Dashboard.css"
import React, { useEffect, useState } from "react";
import "./OwnShop.css"; 
import { Button } from '@mui/material';
import barcode from "./barcode.png"
import 'react-toastify/dist/ReactToastify.css';
import { useStateValue } from './StateProvider';
import { collection, getDocs, getFirestore, query, orderBy, where, updateDoc, doc} from "firebase/firestore";
import VisibilityIcon from '@mui/icons-material/Visibility';
import {Link} from "react-router-dom";

export default function Dashboard() {


    const db = getFirestore();
    const [products, setProduct] = useState([]);
    const [{dash}, dispatch] = useStateValue();


const acceptprod = (id,index) => {
    products.splice(index, 1)
        acceptproduct()
        async function acceptproduct () {
        const productReftwo = doc(db, "products", id);
        await updateDoc(productReftwo, {
            State: 'DISPONIBILE',
          });
          dispatch({
            type: 'REMOVE_FROM_DASH',
            id: id,
        })
        setProduct(products)
        console.log(products)
    }
}

    const declineprod = (id,index) => {
        products.splice(index, 1)
        console.log(products)
        declineproduct()
        async function declineproduct () {
        const productRefone = doc(db, "products", id);
        await updateDoc(productRefone, {
            State: 'RIFIUTATO',
          });

          dispatch({
            type: 'REMOVE_FROM_DASH',
            id: id,
        })
        setProduct(products)
        console.log(products)
    }
    }

    useEffect(() => {
            fetchMyAPI()
            async function fetchMyAPI() {
                const q = query(collection(db, "products"),where("State","==","ATTESA"),orderBy("CreatedOn","asc"));
                const querySnapshot =  await getDocs(q);
                const saveFirebaseTodos = []; 
                querySnapshot.forEach((doc) => {
                saveFirebaseTodos.push(({id: doc.id, ...doc.data()}));
            });
            setProduct(saveFirebaseTodos) 
            }
        }, [])


    return (
        <div>
           <div className="headlist" >
            <div className="headtext" style={{textAlign: "start"}}>
            <span className="intro intro--num"> <img src={barcode} width={50}/> </span>
            <span className="intro">Dashboard accettazione</span>
            </div>
            </div>
            <div className="home__container">

            <div className="list__row">
                {products.map((value,index) =>
                 <div className="productlist" key={value.id}>
                        <div className="product" style={{boxShadow:"none",transform: "none"}}>
                        <div className="product__info" >
                    <h4>{value.Type}</h4>
                    <div className="product__description">
                        <h2>{value.Name}</h2>
                        <p>{value.preview}</p>
                    </div>
                    <p className="product__price"> </p>
                    {value.Type === 'VENDO' &&
                        <h5> € {value.Price} </h5> }
                    {value.Type === 'NOLEGGIO' &&
                        <h5> € {value.Priceday} per giornata </h5> }     
                    
                    <div className="product__rating">
                        {value.City}
                    </div>
                </div>   
            <img src={value.Img[0]} alt="" />
            <Link to={`/pageproduct/${value.id}`} style={{height:"40px"}}> <VisibilityIcon style={{color:"black",border:"1px solid black",borderRadius:"9px",width:"50%",height:"38px"}} />
           </Link>
        </div>  
           

             <div className="product__infolist left"> 
             <Button id="ok" onClick={() => acceptprod(value.id,index)} style={{color:'green',fontSize:'x-large',fontWeight:'900'}}> ACCETTA </Button> 
             <Button id="not" onClick={() => declineprod(value.id,index)} style={{color:'red',fontSize:'x-large',fontWeight:'900'}}> RIFIUTA </Button> 
             </div>                        
         </div>
            )}
        
            </div>
            </div>
        </div>
    )
}
