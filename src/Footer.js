import React from 'react';
import {useLocation} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF } from "@fortawesome/free-brands-svg-icons";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";

function Footer() {

    let year = new Date().getFullYear();

    let location = useLocation();

    return (
        <div>
            <div className='site-footer'  style={{display: location.pathname === "/paysection" || location.pathname === "/signin" || location.pathname === "/login" ? "none" : "", marginTop: "50px" }}>         
        <hr style={{padding: "0"}} />
      <div className="container">
        <div className="row">
          <div className="col-md-8 col-sm-6 col-xs-12">
            <p className="copyright-text">Copyright &copy; {year} All Rights Reserved by 
              ERMELLINO S.P.A. 
            </p>
          </div>

          <div className="col-md-4 col-sm-6 col-xs-12">
            <ul className="social-icons">
              <li><a className="facebook" href=""><FontAwesomeIcon icon={faFacebookF} /></a></li>
              <li><a className="instagram" href=""><FontAwesomeIcon icon={faInstagram} /></a></li> 
            </ul>
          </div>
        </div>
      </div>
    </div>
    </div>
    )
}

export default Footer
