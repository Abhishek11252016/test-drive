import React, { useState } from "react";
import ReactDom from "react-dom";
import { createRoot } from "react-dom/client";
import "./style.css";
import App from "./components/App/App.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2'



 
  
  ZOHO.embeddedApp.init().then(function (testFunc) {
  
    ZOHO.CRM.UI.Resize({
      height: "100%",
      width: "100%",
    }).then(function (data) { });
  }).catch(function(error) {
    console.error("Error initializing Zoho App:", error);
  });;

const domNode = document.getElementById("app");
const root = createRoot(domNode);

root.render(<App />);