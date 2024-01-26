import componentes from "../templetes/exportfile.js";
import {getFirestore, getDocs, collection} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";
const connFirestore = getFirestore(componentes.app);

let tablaDatos = ``;

const querySnapshot = await getDocs(collection(connFirestore, "lista-restaurantes/prueba-1/la_carta/"));
querySnapshot.forEach((doc) => { 
    let {id,nombrePlato,valoracion,numeroDeCompras} = {
        id:doc.id,
        nombrePlato:doc.data().datosPlato.nombre_del_plato,
        valoracion:doc.data().datosPlato.valoracion,
        numeroDeCompras:doc.data().datosPlato.total_pedidos
   }

  console.log(doc.id, " => ", doc.data().datosPlato.nombre_del_plato);

  tablaDatos+= `
    <tr>
        <th scope="row">${id}</th>
        <td>C${nombrePlato}</td>
        <td>${valoracion}</td>
        <td>${numeroDeCompras}</td>
    </tr> 
  `;
});

console.log(tablaDatos);

// document.addEventListener('DomContentLoaded', ()=>{
//     datosEstadisticos.innerHTML=`${tablaDatos}`
// })

export {tablaDatos}

