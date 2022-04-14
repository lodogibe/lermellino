import React from 'react';
import {Link, useHistory, useLocation} from "react-router-dom";
import 'font-awesome/css/font-awesome.min.css';

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
              <li><a className="facebook" href=""><i className="fa fa-facebook"></i></a></li>
              <li><a className="instagram" href=""><i className="fa fa-instagram"></i></a></li>  
            </ul>
          </div>
        </div>
      </div>
    </div>
    </div>
    )
}

export default Footer
