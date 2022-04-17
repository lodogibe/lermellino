import React, { useState, useEffect} from 'react';
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getStorage, ref, getDownloadURL, uploadBytesResumable} from "firebase/storage";
import logo from './logo.png';
import { useStateValue } from './StateProvider';
import {Link, useHistory} from "react-router-dom";
import './AddProducts.css';
import { Button } from '@mui/material';
import { getAuth } from 'firebase/auth';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import DeleteIcon from '@mui/icons-material/Delete';
import "react-toastify/dist/ReactToastify.min.css";
import imageCompression from "browser-image-compression";
import { toast } from 'react-toastify';
import Loader from "./Loader";
import { useTranslation } from "react-i18next";
import logopic from "./piclogo.jpg"



function AddProducts () {

    const [{photo}, dispatch] = useStateValue();
    const db = getFirestore();
    const storage = getStorage();
    let history = useHistory();
    const auth = getAuth();
    const user = auth.currentUser;
    const { t, i18n } = useTranslation();
    

    useEffect(() => {
    if (user != null) {
      const uid = user.uid;
      setId(uid);
      const email = user.email;
      setEmail(email)
    }
    }, [user])

    const [productName, setProductName] = useState('');
    const [preview, setPreview] = useState('');
    const [description, setDesc] = useState('');
    const [productPrice, setProductPrice] = useState(0);
    const [productPriceday, setProductPriceday] = useState(0);
    const [images, setImages] = useState([]);
    const [urls, setUrls] = useState([]);
    const [progress, setProgress] = useState(0);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [id,setId] = useState('');
    const [emailowner,setEmail] = useState('');
    const [type,setType] = useState('');
    const [city,setCity] = useState('');
    const [allfiles, setAll] = useState([]);
    const [showloader, setShowloader] = useState(false);

    /* const types = ['image/png', 'image/jpeg']; */  // per filtrare immagini png e jpeg


  
    //-----------------------------------------------------------------------------//
    //inizia l'effetto a catena per tradurre le parti di testo in inglese
    const [previewEN, setPreviewEN] = useState('');
    const [descriptionEN, setDescEN] = useState('');
    const [productNameEN, setProductNameEN] = useState('');
    const TransState = {
      text: "",
    };

    //traduco descrizione --------------
    const sendTransdescription = async () => {
      TransState.text = description
      console.log({ TransState});
      await fetch("https://hosteapitestlodux.herokuapp.com/tran", {
        method: "POST",
        headers : { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
          },
        body: JSON.stringify({ TransState}),
      })
      .then((response) => response.json())
      .then((data) => setDescEN(data.status)).then(() => handleUploadok())} 
 
    //traduco preview -------------- handleUploadok()
    const sendTranspreview = async () => {
      TransState.text = preview
      console.log({ TransState});
       await fetch("https://hosteapitestlodux.herokuapp.com/tran", {
        method: "POST",
        headers : { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
          },
        body: JSON.stringify({ TransState}),
      })
      .then((response) => response.json())
      .then((data) => setPreviewEN(data.status)).then(() => sendTransdescription())} 
    
    //traduco titolo --------------
    const sendTranstitle = async () => {
      TransState.text = productName
      console.log({ TransState});
      await fetch("https://hosteapitestlodux.herokuapp.com/tran", {
        method: "POST",
        headers : { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
          },
        body: JSON.stringify({ TransState}),
      })
      .then((response) => response.json())
      .then((data) => setProductNameEN(data.status)).then(() => sendTranspreview())}
    //-----------------------------------------------------------------------------//


    // This function will be triggered when the file field change
    async function handleChange (e) {
      
    if (e.target.files.length <= 5 && selectedFiles.length <= 5 && images.length <= 4) {
      if (e.target.files) {
        const filesArray = Array.from(e.target.files).map((file) =>
          URL.createObjectURL(file)
        );

       
        setSelectedFiles((prevImages) => prevImages.concat(filesArray));
        Array.from(e.target.files).map(
          (file) => URL.revokeObjectURL(file) // avoid memory leak
             );
      }
      
     
      for (let i = 0; i < e.target.files.length; i++) {
        
        const newImage = e.target.files[i];

        //per comprimere le immagini
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight:1920,
          useWebWorker: true
        }        
        try {
          const compressedFile = await imageCompression(newImage, options);
          console.log('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
          console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB
          allfiles.push(compressedFile)
          await uploadToServer(allfiles); // write your own logic
        } catch (error) {
          console.log(error);
        }
      }

      function gosetAll(all) { setAll(all) }
   
      async function uploadToServer(allfilex) {
        await gosetAll(allfilex);
        await setImages(allfiles);
        console.log(allfiles)
        if(images.length === e.target.files.length)
        {
          console.log('fatto')
        }
      }   
    }

    else
    {toast.warn("Stai selezionando troppe foto, il limite è di 5!", {
      position: "top-left",
      autoClose: true,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });}
};


    // This function will be triggered when the "Remove This Image" button is clicked
    const removeSelectedImage = (index) => {
      console.log(images)
      images.splice(index,1)
      selectedFiles.splice(index, 1)
      dispatch({
        type: 'REMOVE_FROM_BOOK',
        id: index,
    })
    setImages(images)
    };



    // add photo
    const handleUpload = () => {

    setShowloader(true)

    if (selectedFiles !== '' && productPrice !== 0 && productName !== '' && preview !== '' && description !== '' && type !== '' && city !== '') {   
              
      if (type === 'NOLEGGIO' && productPriceday !== 0) 
      {
        //traduco i testi per fare la versione in inglese
        sendTranstitle();
      }
      else if (type === 'VENDO') 
      {
        //traduco i testi per fare la versione in inglese
        sendTranstitle();
      }

      else {toast.warn("Hai scelto l'opzione noleggio, imposta un prezzo a giornata", {
        position: "top-left",
        autoClose: true,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });}
      }

      else {
        setShowloader(false);
        {toast.warn("Compila tutti i campi", {
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

  const handleUploadok = () => { const metadata = {contentType: 'image/jpeg'};
  images.map((image) => {
  // Upload file and metadata to the object 'images/mountains.jpg'
  const storageRef = ref(ref(storage, 'images/' + image.name));
  const uploadTask = uploadBytesResumable(storageRef, image, metadata);
      uploadTask.on('state_changed', 
      (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
      case 'paused':
        console.log('Upload is paused');
        break;
      case 'running':
        console.log('Upload is running');
        break;
      }
      setProgress(progress);
    }, 
  (error) => {
    // Handle unsuccessful uploads
  }, 
  async () => {
    await 
      getDownloadURL(ref(storage, 'images/' + image.name))
        .then((urls) => {
          setUrls((prevState) => [...prevState, urls])
        });
    });
  }) 
}


useEffect(() => {
  if (selectedFiles.length === urls.length && urls.length !== 0) {
    addProduct();
  }
 }, [urls]);
 

    
const handleType = (event) => {
  setType(event.target.value);
};

const handleCity = (event) => {
  setCity(event.target.value);
};

// add product
 
    const addProduct = () => {


      try {
        const docRef = addDoc(collection(db, "products"), {
                Name: productName,
                Price: Number(productPrice),
                Priceday: Number(productPriceday),
                Img: urls,
                City: city,
                Type: type,
                CreatedOn: new Date(Date.now()),
                State: 'ATTESA', 
                IDowner: id,  
                Emailowner: emailowner,    
                Description: description,
                Preview: preview,   
                NameEN: productNameEN,
                DescriptionEN: descriptionEN,
                PreviewEN: previewEN, 
            }).then(() => {
              setShowloader(false)
                history.push('/lermellino/ownshop')
            })} catch (e) {
              setShowloader(false)
                console.error("Error adding document: ", e);
              }
          }
          
          const hiddenFileInput = React.useRef(null);

          const handleClick = event => {
            hiddenFileInput.current.click();
          };
          

    return (


        <div className='container addproducts'>
          { showloader && <Loader /> }
          {/* Queste due classi DEMO sono state aggiunte per fare l'effetto immagine background opaca, che applicherò in tutte le sezioni senza header*/}
          <div className="demo-wrap">
          <div className="demo-content">
            <div className='login'>
            <Link to="/lermellino/">
            <img className="login_logo"
            src={logo} alt="logo"  width="160" height="118" />
            </Link>     
           
        <div className="login__container"  style={{width:"auto"}}>
            <div className="allblock">
            <div className="headtext" style={{width:"100%"}}>
            <span className="intro" style={{color: "#E05D5D", fontSize:"40px"}}>{t("Aggiungi articolo")}</span>
            </div>
            <div className="addbrodi">
            <div className="leftprod">
            <div className="city">
                  <h5>{t("Vendi o noleggi?")} </h5> 
                    <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">{t("Vendo / Noleggio")}</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={type}
                      label="Acquista / Noleggia"
                      onChange={ handleType }
                      required
                    >
                      <MenuItem value={'VENDO'}>{t("Vendi")}</MenuItem>
                      <MenuItem value={'NOLEGGIO'}>{t("Noleggia")}</MenuItem>
                    </Select>
                  </FormControl>
             </div>
             <hr />
            <div className="city">
              <h5> {t("Città")}: </h5> 
            <FormControl fullWidth style={{backgroundColor:"white", width:"175px"}}>
            <InputLabel  id="demo-simple-select-label">MI / RM</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={city}
              label="Acquista / Noleggia"
              onChange={ handleCity }
              required
            >
              <MenuItem value={'Milano'}>Milano</MenuItem>
              <MenuItem value={'Roma'}>Roma</MenuItem>
            </Select>
          </FormControl>
          </div>
          <hr />
                <div className="product-name"> <h5> {t("Nome prodotto")}: </h5>
                <TextField
                      id="outlined-textareaname"
                      autoComplete='no'
                      inputProps={{
                        maxLength: 16,
                      }}
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                    />
                    </div>
                    <hr />
                    <div className="product-name"> <h5> {t("Breve descrizione")}: </h5>
                <TextField
                      className="preview"
                      id="outlined-textarea"
                      inputProps={{
                        maxLength: 34,
                      }}
                      value={preview}
                      onChange={(e) => setPreview(e.target.value)}
                    />
                    </div>
                    <hr />
                <div className="product-name" > <h5> {t("Descrizione completa")}: </h5>
                    <TextField  
                      className="description"
                      id="outlined-multiline-static"
                      inputProps={{
                        maxLength: 250,
                      }}
                      rows={4}
                      value={description}
                      onChange={(e) => setDesc(e.target.value)}
                    />
                    </div>
                    <br />
                  </div>
                  
                  <div className="rightprod">
                  <div className="prezzo">
                <div className="label"> <h5> {t("Inserisci il prezzo")}: </h5> 
                
                  <OutlinedInput
                    id="outlined-adornment-amount"
                    type="number"
                    inputProps={{
                      maxLength: 0,
                    }}
                    onChange={(e) => setProductPrice(e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,9))} value={productPrice}
                    startAdornment={<InputAdornment position="start">€</InputAdornment>}
                  />,00 €
                  <p> *({t("se noleggi il prodotto inserisci il suo valore assoluto per stabilirne la caparra")}) </p>
                   </div> 
                   <hr />
                  <div className="label noleggio"> <h5> {t("Inserisci il prezzo per giornata")}: </h5> 
                
                  <OutlinedInput
                    id="outlined-adornment-amount-day"
                    type="number"
                    onChange={(e) => setProductPriceday(e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,9))} value={productPriceday}
                    startAdornment={<InputAdornment position="start">€</InputAdornment>}
                  />,00 €
                  <p> *({t("compila questo campo solo se stai noleggiando il prodotto")}) </p>
                   </div>
                   </div> 
                   <hr />
                <div className="imagepre">
                <Button onClick={handleClick} className="button__photo" style={{border:"1px solid #337ab7", width: "145px",marginBottom:"5px",marginTop:"10px",backgroundColor:"white"}}> {t("Carica foto")} </Button>
                <div className="separatore">
                <img src={logopic}   style={{width:"145px"}} />
                <input type="file" multiple onChange={handleChange} ref={hiddenFileInput} style={{display: 'none'}} />
                <p> *({t("devi caricare almeno una foto, fino ad un massimo di 5")}) </p>
                </div>
                </div>

                  <br />
                </div>
                
                </div>
               
                <TransitionGroup className="toda-lista">
                {selectedFiles.map((url, index) => (     
                  
                  <CSSTransition
                  key={url}
                  timeout={200}
                  classNames="item"
                  >

                  <div key={url} className="photopreview">
                  <Button style={{height:"20px"}} variant="outlined" startIcon={<DeleteIcon />} onClick={() => removeSelectedImage(index)}> {t("Rimuovi")}  </Button>
                  <br />
                  <img 
                    style={{width:"120px",objectFit: "contain", height: "170px",backgroundColor: "black"}}
                    src={url}
                    alt="firebase-image"
                  />

                  </div> 

                  </CSSTransition> ))
                }
                
                </TransitionGroup>
        
                <div className="loader">
                 <progress value={progress} max="100" />
                 </div>
                 <hr style={{width:"90%"}} />
                 <div className="add">
                <Button variant="contained" onClick={handleUpload} type="submit" className='btn btn-success btn-md mybtn'>{t("INVIA RICHIESTA AGGIUNTA PRODOTTO ALL'ERMELLINO")}</Button>     
                </div>
                </div>
                </div>
                </div>
                </div>
                </div>
        </div>   
    )
}


export default AddProducts;


