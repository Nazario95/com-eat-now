import { head, header, footer } from "./header-footer.js";
import { modalLogin, formLogin } from "./login.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
// import {datosSesionActiva} from "../js/sesion.js"

//ACCESS DB CONFIG
   
    // TODO: Add SDKs for Firebase products that you want to use
    // https://firebase.google.com/docs/web/setup#available-libraries
    const firebaseConfig = {
      apiKey: "AIzaSyAutEuSiDifQ_uEAl4mCemiwMMLEQx6G-8",
      authDomain: "eat-reservations-2c32c.firebaseapp.com",
      projectId: "eat-reservations-2c32c",
      storageBucket: "eat-reservations-2c32c.appspot.com",
      messagingSenderId: "804326213465",
      appId: "1:804326213465:web:9084ae455d8b3c6d872e48",
      measurementId: "G-EQY4VGV76X"
    };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  //const analytics = getAnalytics(app);

const componentes = {
    modalLogin, //ventana modal del login
    head, // encabezado de la pagina
    header, // contenido header de la pagina
    footer, //contenido footer de la pagina
    formLogin,  //menu no modal para telefonos o tabletas
    app, // Configuracioin Firebase
}
export default componentes;

