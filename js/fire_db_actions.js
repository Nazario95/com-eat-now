// configuraicon de mi app de firebase ----------
import componentes from "../templetes/exportfile.js";

// CONEXION A FIRESTORE ---------------
import {getFirestore, collection, getDocs, setDoc, getDoc, doc}  from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";
const db = getFirestore(componentes.app);

//console.log(db); //probando la conexion a firestore

//FUNCION PARA LEER LOS DOCUMENTOS TEMPORALES DE CARRITOS
const caturarColecciones = await getDocs (collection(db, "public-db/YYKv1vbDdUWhvcEezFyx/datos-carritos"));
caturarColecciones.forEach((doc) => {
    
  
    
});


//FUNCION PARA LEER Y ALMACENAR TODAS LAS CATEGORIAS DISPONIBLES
const categoriasDisponibles = await getDoc(doc(db,"public-db/YYKv1vbDdUWhvcEezFyx/lista-cartas/", "vGiJKcEEu5GJ513eDqTi"))
// console.log(categoriasDisponibles.data());

export {categoriasDisponibles}



