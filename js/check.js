//FIREBASE - importar archivo de exportacion principal
import componentes from "../templetes/exportfile.js";
import {getFirestore,doc, getDoc} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";
const db = getFirestore(componentes.app);

import {usuarioActivo} from './session.js'
//VERIFICAR SECCION DE PAG ADMIN ACTUAL
//capturar parrametros de la url.
const valorUrl = window.location.search;
const parrametrosUrl = new URLSearchParams(valorUrl);  

//accemos a las clave:valor de los parramtros
for (const [llave, valor] of parrametrosUrl) {
    
    if(llave=='ir-a' && valor == 'panel'){
        
        accessAdminPanel()
    }
}

function accessAdminPanel(){
    setTimeout(() => {
        
        const datosUsuarioActivo = async()=>{
            const archivoUsuarioActivo =  await getDoc(doc(db,"public-db/YYKv1vbDdUWhvcEezFyx/users", usuarioActivo[0]))

            if(archivoUsuarioActivo.data().negocio === 'Sin Registro'){
                document.getElementById('respuesta').textContent = `El usuario ${archivoUsuarioActivo.data().nombre} no tiene ningun negocio registrado`;
                document.getElementById('mensaje').textContent = 'Vaya a la configuracion de cuenta y registre su negocio'
                setTimeout(() => {
                    alert(`Aceso denegado a ${archivoUsuarioActivo.data().nombre}`)
                    redireccionar()
                }, 3000);

                function redireccionar(){
                    location.href =  './cuenta.html'
                }
            }

            else{
                console.log(archivoUsuarioActivo.data().nombre, ': acceso permitido')
                location.href =  './administracion.html'
            }
        } 
        datosUsuarioActivo()
    }, 3000);
}
    
