//------- descargando datos del servidor ----------
//FIREBASE - importar archivo de exportacion principal
import componentes from "../templetes/exportfile.js";
import {getFirestore, collection, getDocs} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

//conectando a app de firebase, para firestore y 
const db = getFirestore(componentes.app);

//fireStorage - almacenamiendo de archivos
import {getStorage, ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-storage.js";
const storage = getStorage(componentes.app);

//------------- variables predeterminadas ----------

let datosNuevosPlatos = [];
let restaurantes = [];
let datosCargados = '';
let existeRestaurante = false;

//------ codigo principal --------
restDisponibles(); //cargar lista de restaurantes registrados
async function restDisponibles(){    
    restaurantes =[]//reset array de restaurantes registrados
    try {//capturar id de nombres
         const nomRestaurantes = await getDocs(collection(db, "lista-restaurantes",));
         nomRestaurantes.forEach((doc) => {
                restaurantes.push(doc.id)//agregar nombre al areglo 
            });
    } 
    catch (error) { console.log(error);}
    // console.log(restaurantes);

    //buscamos las cartas disponibles en los restaurantes
    cargarDatosRetsuarante();
}

//capturar nuevos platos de cada categoria en toso los restaurantes
async  function cargarDatosRetsuarante(){
    try {//cargamos la carta de los restaurantes encontrados
        const cartasRestaurantes = await getDocs(collection(db, `lista-restaurantes/${restaurantes[1]}`, "la_carta"));

        cartasRestaurantes.forEach((doc) => {
            //agregamos los platos nuevos de la carta
            if(doc.data().nuevo_plato){
                datosNuevosPlatos.push(doc.data());
            }           
        });

    } catch (error) {
        
    }
    // console.log(datosNuevosPlatos);------------------------------------------
    //imagenesPlato();
}
/*
async function imagenesPlato(){
    let ruta;
    for(var i=0; i<=datosNuevosPlatos.length;i++){

        ruta = datosNuevosPlatos[i].datosPlato.nombre_del_plato;

        getDownloadURL(ref(storage, `imagenes/prueba-1/${ruta}`))
        .then((url) => {
                // const img = document.getElementById('descarga-imagen');
                // img.setAttribute('src', url);
               console.log(url)

               const platosNuevos = document.querySelector('.plato-nuevo');

               datosCargados +=`
               <div class=" tarjeta componente-tarjeta"><img src="${url}">
                    <div class="describcion-tarjeta"><p>${ruta}</p></div>
                </div>
               `
               platosNuevos.innerHTML=datosCargados
               console.log(datosCargados);
          })
          .catch((error) => {
            console.log(error);
          });
    }

}
*/
// ----------  seccion nuevos platos agregados -------
const nuevosPlatos = document.querySelector('.slider-ultimos-agregados');

let platoNuevo= `
    <a href="./descipcion-comida.html">

        <div class="menu-modo-movil plato-nuevo">
            <!-- componente --> 
            MOVIL
        </div>

        <div class="menu-modo-pc">
            <div class="justify-content-center plato-nuevo"> 
                <!-- componente -->   
                PC           
            </div>

        </div><!-- fin. Contenido PC -->
    </a>
`

nuevosPlatos.innerHTML = `
  
    ${platoNuevo}
`




// RESULTADOS DE BUSQUEDA
// reseteamos la variable que tendra el inderHtml
let enlaceResultadoBusqueda = ` <p>Resultados encontrados</p><br>`;


if(location.pathname!='/login.html'){
    
    if(location.pathname!='/resultados-busqueda.html'){

        if(location.pathname!='/administracion.html'){

            //Accedemos al boton de buscar para determinar comportamiento del clic
            const btnBuscarRestaurante = document.querySelector('.btn-buscar-restaurante');
            const btnBuscarRestauranteMovil = document.querySelector('.btn-buscar-restaurante2');
            
            btnBuscarRestaurante.addEventListener('click', (e)=>{
                e.preventDefault();
                verResultadosBusqueda()
            });

            btnBuscarRestauranteMovil.addEventListener('click', (e)=>{
                e.preventDefault();
                verResultadosBusquedaMovil()
            });

            
        }
        
    }   
}


function verResultadosBusqueda(){
     //accedemos al valor escrito en el input
     var buscarRestaurante = document.querySelector('.buscar-restaurante');
     //accemos al elemento padre, en donde iremos inyectando los resultados encontrados
     var resultadosBusqueda = document.querySelector('.resultados-busqueda');
    
     for(var i=0;i<restaurantes.length;i++){

         if(restaurantes[i].includes(buscarRestaurante.value)){

            existeRestaurante=true;

            //  console.log('existe');
             enlaceResultadoBusqueda += `
                 <a href="/menu-restaurante.html?restaurante=${restaurantes[i]}">
                      ${restaurantes[i]}
                 </a><br>
             `
         }
         
     }
     
     if(!existeRestaurante){
        resultadosBusqueda.innerHTML = `
            <p>No se ha encontrado el restauran buscado</p>
        `;
     }
     else{
        resultadosBusqueda.innerHTML = enlaceResultadoBusqueda;
     }
     
}

function verResultadosBusquedaMovil(){
    //accedemos al valor escrito en el input
    var buscarRestauranteMovil = document.querySelector('.buscar-restaurante-movil');
    //accemos al elemento padre, en donde iremos inyectando los resultados encontrados
    var resultadosBusquedaMovil = document.querySelector('.resultados-busqueda-movil');
   
    for(var i=0;i<restaurantes.length;i++){
        if(restaurantes[i].includes(buscarRestauranteMovil.value.toLowerCase())){
            existeRestaurante=true;

            enlaceResultadoBusqueda += `
                <a style="color:brown;" href="/menu-restaurante.html?restaurante=${restaurantes[i]}">
                     ${restaurantes[i]}
                </a><br>
            `
        }
        
    }

      if(!existeRestaurante){
        resultadosBusquedaMovil.innerHTML = `
            <p>No se ha encontrado el restauran buscado</p>
        `;
     }
     else{
        resultadosBusquedaMovil.innerHTML = enlaceResultadoBusqueda;
     }
     
}
