//importar archivo de exportacion principal
import componentes from "../templetes/exportfile.js";
import {getFirestore,getDocs, collection} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

const connFirestore = getFirestore(componentes.app);

const querySnapshot = await getDocs(collection(connFirestore, "lista-restaurantes/pizzaplace/la_carta"));

const categorias = [];
var i = 0;
var texto = ``;

querySnapshot.forEach((doc) => {

      const datosDescargados =  doc.data();
      categorias.push(datosDescargados.categoria)

      var texto1 = `
      <input value="nazza" name="value-radio" id="nazza" type="radio">
      <label for="nazza">${categorias[i]}</label>`    

      texto+=texto1;

      var insertarMenuSlider = document.querySelector('.menu-slider');
      insertarMenuSlider.innerHTML=texto;

      i++;
    }
  );



