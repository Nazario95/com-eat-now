import componentes from "../templetes/exportfile.js";
import { mostrarAlerta, usuario } from "./session.js";//usuario - Toda la informacion del usuario
import { porcesarPago} from "./procesar-pagos.js";
import {getFirestore, query, collection, getDocs, getDoc, doc} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

//accedemos a las imagenes
import {getStorage, ref, getDownloadURL} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-storage.js";
const storage = getStorage(componentes.app);

//RUTA PRINCIPAL
const rutaPricipal = localStorage.getItem('rutaPrincipal');

//importamos la configuracion de mi app firebase
const db = getFirestore(componentes.app);
//capturamos los elementos del formulario
const buscador = document.querySelector('.buscador'); 
   
//------------- variables predeterminadas ----------
let restaurantes = [];
let existeRestaurante = false;
let componente='';
const carrito = []
const urlData = []

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

}

// RESULTADOS DE BUSQUEDA
// reseteamos la variable que tendra el inderHtml
let enlaceResultadoBusqueda = ``;

var omitirBtnBuscarRestaurante = [`${rutaPricipal}login.html`, `${rutaPricipal}resultados-busqueda.html`,`${rutaPricipal}administracion.html`, `${rutaPricipal}historial-pedidos.html`]

if(!omitirBtnBuscarRestaurante.includes(location.pathname)){ 
            //Accedemos al boton de buscar para determinar comportamiento del clic
            const btnBuscarRestaurante = document.querySelector('.btn-buscar-restaurante');
            const btnBuscarRestauranteMovil = document.querySelector('.btn-buscar-restaurante2');
            
            btnBuscarRestaurante.addEventListener('click', (e)=>{
                e.preventDefault();
                existeRestaurante=false;
                enlaceResultadoBusqueda = ` <p>Resultados encontrados</p><br>`;
                verResultadosBusqueda()
            });

            btnBuscarRestauranteMovil.addEventListener('click', (e)=>{
                e.preventDefault();
                existeRestaurante=false
                enlaceResultadoBusqueda = ` <p>Resultados encontrados</p><br>`;
                verResultadosBusquedaMovil()
            });
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
                 <a href="./menu-restaurante.html?restaurante=${restaurantes[i]}">
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
// ------------------- CODIGO PARA BUSQUEDA DE COMIDA -------------
    //caputurar boton buscar
    const btnBuscarComida = document.getElementById('buscar-comida')
    // console.log(btnBuscarComida);
        //capturamos evento click
    if(btnBuscarComida!=null){
        btnBuscarComida.addEventListener('click',(e)=>{
            e.preventDefault()
            //caputamos valor del input
            const inputComida = document.querySelector('.input-comida')
    
            location.href=`./resultados-busqueda.html?plato=${inputComida.value}`
    
        })
    }    

    // console.log(location.pathname);
    if(location.pathname===`${rutaPricipal}resultados-busqueda.html`){
        let buscarComida;
        //accedemos al par clave valor de la url
        let valorUrl = window.location.search;
        
         //leemos el numero de par clave valor de la url
        const parrametrosUrl = new URLSearchParams(valorUrl); 

        // console.log(parrametrosUrl);
        //si no exites ningun valor en el parrametro, regresamos al index.html
        if(parrametrosUrl.size === 0){
            location.href='./';
        }

        //accemos a las clave:valor de los parramtros
        for (const [llave, valor] of parrametrosUrl) {
            //almacenamos el valor enviado para buscar
            buscarComida = valor //debemos solucionar la busqueda con letras minisculas;
            // console.log(buscarComida);

            const tuBusqueda = document.querySelector('.tu-busqueda');
            tuBusqueda.innerHTML = buscarComida.toUpperCase()
        }
      
        buscadorComida(buscarComida);
    }

    //funciona que muestra los resulta la pagina de "resultados-busqueda"
    function buscadorComida(buscarComida){   

        //1. PRIMERO CRAMOS UNA FUNCION ASYNCRONA: cuya funcion sera la de capturar todos los nombres de los restaurantes disponibles en firebase
        const capturarRestaurantes= async() => {

            //1. CAPTURAMOS TODOS LOS RESTAURANTES
            const querySnapshot = await getDocs(collection(db, "/lista-restaurantes"));

            // console.log(`caputar de restaurantes...ok`);

            querySnapshot.forEach((doc) => {              
                // console.log(`extrayendo datos de ${doc.id}...ok`);

                //en cada iteracion del bucle llamamos otra funcion asyncrona enviado como argumento el nombre del restaurante
                listaComida(doc.id, buscarComida)                
            });
        }
        
        //0.INICIO: eso inicia la funcion asyncrona, se pone abajo para que la funcion se declare primer antes de llamarla.
        capturarRestaurantes();   
        

            const listaComida = async (restaurante)=>{
                //dato: argumento que recibimos de cuando llamamos la funcion ariba, es el nombre del restaurante.

                const q = query(collection(db, `/lista-restaurantes/${restaurante}/sub-${restaurante}/cartas/sub-cartas/`));

                //2.CATURAR DATOS DE CADA RESTAURANTE - capturamos todos los archivos de la coleccion indicada ariba
                const querySnapshot = await getDocs(q);

                // console.log(`caturando lista de platos de ${dato} ...ok`);

                querySnapshot.forEach((doc) => {  
                    let describicionComida= doc.data().que_lleva;
                    let precio= doc.data().precio;
                    let nombreComida = doc.data().nombre_del_plato;
                    let nombreImgPlato = doc.data().nombreImg;
                    let categoria = doc.data().categoria;
                    let guarnicion = doc.data().guarnicion;
                    let idPlato = doc.id

                    // let imagen = doc.data().datosPlato.nombreImg -> pendiente para la proxima actualizacion

                    const datosComponente ={
                        nombreComida:nombreComida,
                        nombreImgPlato:nombreImgPlato,
                        precio:precio,
                        describicionComida:describicionComida,
                        categoria:categoria,
                        guarnicion:guarnicion,
                        restaurante: restaurante,
                        idPlato:idPlato
                    }

                //    ver objeto de los componenetes
                    //console.log(datosComponente);

                    //3.CAPTURAR URL de las imagenes
                    capturarUrlImg(datosComponente,buscarComida);

                    // console.log(`caturados ${comidaEncontrada}...ok`);
                });
            }            

            const capturarUrlImg = async (datosComponente)=>{
                //distruction de datos
               
                const {nombreComida, nombreImgPlato, precio, describicionComida, categoria, guarnicion, restaurante, idPlato} = datosComponente

                const contenedorComponente = document.querySelector('.resultados-de-busqueda');                

                //cargar la lista de imagenes
                const pathImg = await getDownloadURL(ref(storage, `${nombreImgPlato}`)) 

                // console.log(datosComponente)

                // console.log(buscarComida) //valor comidad que se esta buscando
                // console.log(nombreComida)
                // console.log(describicionComida)
                // console.log(categoria)
                // console.log(guarnicion)

                // console.log(pathImg)

                if(nombreComida.includes(buscarComida)){
                    inyectarResulutados()                    
                }
                else if(describicionComida.includes(buscarComida)){
                    inyectarResulutados()                    
                }
                else if(categoria.includes(buscarComida)){
                    inyectarResulutados()                    
                }
                else if(guarnicion.includes(buscarComida)){
                    inyectarResulutados()                    
                }
                function inyectarResulutados(){
                    componente +=`
                    <div class="shadow-sm p-3 mb-5  bg-body  hover-description">
                        <img class="img-fluid" src="${pathImg}" alt=""> 

                        <div>
                            <span>${nombreComida.toUpperCase()}</span><br>
                            <span><span class="link">Ingredientes</span>: ${describicionComida}</span><br>
                             <span class="precio">A tan solo ${precio}FCFA</span><br>
                            <a href="./describcion-comida-1.html?id=${idPlato}&&res=${restaurante}" class="comprar">
                                <span class="comprar link">PRUEBALO YA</span>
                            </a> 
                        </div>
                                            
                    </div>   
                   ` 
                } 
                contenedorComponente.innerHTML=componente                  
            }
    }
    
    // <div class="col-6 col-md-4 shadow-sm p-3 mb-5 bg-body rounded">
    //     <img class="img-fluid" src="./src/img/comprar-comida/1.jpg" alt="">
    //     <div class="boton">
    //         <a type="button" class="btn" href="./procesar-pago.html"><h2 class="enlace">Pidelo Ya</h2></a>
    //     </div>
    // </div>

//  ------------ SECCION: "describcion-comida.html" MOSTRAR RESULTADOS DE LA COMIDA SELECIONADA

if(location.pathname === `${rutaPricipal}describcion-comida-1.html`){
    //console.log('/describcion-comida-1.htm')
    //almacenaremos los valores de la url
    const datosPlato= []

     //accedemos al par clave valor de la url
     let valorUrl = location.search;
        
     //leemos el numero de par clave valor de la url
    const parrametrosUrl = new URLSearchParams(valorUrl); 

    // console.log(parrametrosUrl);
    //si no exites ningun valor en el parrametro, regresamos al index.html
    if(parrametrosUrl.size === 0){
        location.href='./';
    }

    //accemos a las clave:valor de los parramtros
    for (const [llave, valor] of parrametrosUrl) {
        //almacenamos el valor enviado para buscar       
        //console.log(llave ,'=>',valor);        
        datosPlato.push(valor)        
    }
    //console.log(datosPlato)
    obtenerDatosPlato(datosPlato)
}

function obtenerDatosPlato(datosPlato){
    //console.log(datosPlato)
    const capturarDatosPlato = async () => {
        //capturando datos del plato
         const querySnapshot = await getDoc(doc(db, `/lista-restaurantes/${datosPlato[1]}/sub-${datosPlato[1]}/cartas/sub-cartas/`, `${datosPlato[0]}`));

        //  console.log(querySnapshot.data());
         const {nombre_del_plato, que_lleva, precio, nombreImg} = querySnapshot.data()

         //capturar imgagen de la imagen
         const pathImg = await getDownloadURL(ref(storage, `${nombreImg}`)) 
         //console.log(pathImg)        
        
         let contenedorImg = document.querySelector('.imagen-plato');
         
         let informacionPlato =  document.querySelector('.informacion-plato');

         let bgImgpreview = document.querySelector('.img-carrito')

         //COMPONENETES A INYECTAR
         //0. componenete imagenes vista previa
        let vistapreviaImg = `
            <div class="carrito carrito-1">
                <img src="${pathImg}" alt="" style="
                    width: 80px;
                    height: 80px;
                ">
            </div>
            <div class="carrito carrito-2">
                <img src="${pathImg}" alt="" style="
                    width: 80px;
                    height: 80px;
                ">
            </div>
            <div class="carrito carrito-3">
                <img src="${pathImg}" alt="" style="
                    width: 80px;
                    height: 80px;
                ">
            </div>
            <div class="carrito carrito-4">
                <img src="${pathImg}" alt="" style="
                    width: 80px;
                    height: 80px;
                ">
            </div>
        
        `
         //1.componenere img
         let componeneteImg = `
            <img src="${pathImg}" alt="">
        `
        //2.componenete informacion del plato
        let componenteDatos = `
            <tr>
                <td class="td-info">Nombre del plato:</td>
                <td><h3 class="precio">${nombre_del_plato}</h3></td>
            </tr>
            <tr>
                <td class="td-info">Lleva:</td>
                <td><h3 class="precio">${que_lleva}</h3></td>
            </tr>
            <tr>
                <td class="td-info">plato del restaurante:</td>
                <td><h3 class="precio">${datosPlato[1]}</h3></td>
            </tr>
            <tr>
                <td class="td-info">PRECIO</td>
                <td><h3 class="precio">${precio}</h3></td>
            </tr>  
        `
        //3.componenete botones
    
        //inyectando componentes en el html
        bgImgpreview.innerHTML = vistapreviaImg
        contenedorImg.innerHTML = componeneteImg
        informacionPlato.innerHTML = componenteDatos
        // btnPagar.innerHTML = componenteBtnpagar   
        
        //escuchando evendo de btn comprar
        const encarParplato = document.getElementById('encargar-plato')
        encarParplato.addEventListener("click",(e)=>{
            e.preventDefault()  
            
            if(usuario){
                //array donde almacenaremos nombreCliente, nombre restaurante y id plato
                let datosCompra = []

                //location.href='procesar-pago.html?rest=&&plato=&&client='

                //conectarnos a la url
                let valorUrl = window.location.search;

                //capturar parrametors id plato y nombre restaurante en la url
                const parrametrosUrl = new URLSearchParams(valorUrl);

                //agregamos los datos de la url dentro del array
                for (const [llave, valor] of parrametrosUrl) {                  
                    datosCompra.push(valor)
                    // datosCompra[0] = id plato
                    // datosCompra[1] = nombre restaurante
                    //console.log(datosCompra);                    
                }
                datosCompra.push(usuario.email)
                // datosCompra[2] = nombre de usuario
                // console.log(datosCompra); 
                porcesarPago(datosCompra)
                //porcesarPago(datosCompra)
            }  
            
            else{
                console.log(usuario, 'No hay usario activo') 
                mostrarAlerta('warning', 'Porfavor, inicia sesion primero')               
            }
        })
    }
    capturarDatosPlato();
}


//FUNCIONALIDAD DE BOTON DE CARRITO --------------------------------------------

let btnAddCarrito = document.querySelector('.add-carrito') 
if(btnAddCarrito!=null){
    btnAddCarrito.addEventListener('click', ()=>{
        // var elemetosCarrito =''
        // console.log('Carrito') 
        if(JSON.parse(localStorage.getItem('carrito') != null)){
            // console.log('existe carrito')
            mostrarAlerta('success', 'elemento añadido correctamente')         
            verificarDatosCarrito()
        }
        else{
            console.log('no existe carrito') 
        }  
    })
}


//funcion para verificari si existe carrito en cache
function crearCarritoCache(){    
    //existe - No crear
    if(JSON.parse(localStorage.getItem('carrito') != null)){        
        // console.log('Existe Carrido Creado')         
    }
    //No existe -  crear
    else{        
        // console.log('No Existe, Creando')
        localStorage.setItem('carrito', JSON.stringify(carrito)); 
    }
}

function verificarDatosCarrito(){    
    // console.log(carrito);
    var check = false;
    if(carrito.length==0){
        generarDatosCarrito()
        return
    }

    for(var i=0;i<carrito.length;i++){
        // console.log(carrito) 
        if(carrito[i].metaIdPlato == urlData[0]){
            // console.log('ya existe')      
            carrito[i].cantidad++;      
            // console.log(carrito[i].metaIdPlato)
            
            // console.log(carrito);
            
            check = true;
        }  
                    
    }  
    
    if(check){
        actualizarCarrito();
        // console.log('existe')        
    }

    if(!check){
        // // localStorage.setItem('carrito', JSON.stringify(carrito))
    //    console.log('no existe')     
        generarDatosCarrito()
        // console.log(carrito[i].metaIdPlato);
    } 
}

function generarDatosCarrito(){
     let datoCarrito = async()=>{
         let datos =  await getDoc(doc(db,`/lista-restaurantes/${urlData[1]}/sub-${urlData[1]}/cartas/sub-cartas/`,urlData[0]))
         // console.log(datos.data())
         let guardarDatosCarrtio = {   
             cantidad:1,         
             nombreDelPlato:datos.data().nombre_del_plato,
             precio:datos.data().precio,
             metaImgNombrePlato:datos.data().nombreImg,            
             metaRestaurante:urlData[1],
             metaIdPlato:urlData[0]
         }
         
         carrito.push(guardarDatosCarrtio)
         // console.log(carrito)
         actualizarCarrito()
     }
     datoCarrito()
    // 
}

//funcion que pone datos en el carrito
function actualizarCarrito(){

    // console.log(carrito)
    localStorage.setItem('carrito', JSON.stringify(carrito))
    inyectarDatosCarrito()
}


//funcion que lee los datos del carrito y los muestra en el navegado
function inyectarDatosCarrito(){
    
    if(carrito.length != 0){
        var elemetosCarrito = '';
        var cantidad = 0

        for(var i=0; i<carrito.length; i++){
            cantidad++
            // console.log('Recorriendo el carrito')
            // carrito.push(carritoCache[i]); 
            // console.log(carrito[i]);
            // console.log(carrito[i].metaIdPlato);

            elemetosCarrito +=`
                <div class="d-flex justify-content-center carrito-nombre">
                    <p class="my-0 px-2">${carrito[i].cantidad} X ${carrito[i].nombreDelPlato} </p>
                    <img class='btn-borrar' id='${carrito[i].metaIdPlato}' type="button" src="./src/svg/trash3-fill.svg">
                </div>
              `             
            document.querySelector('.elmentos-carrito').innerHTML = elemetosCarrito;
            document.querySelector('.cantidad-carrito-movil').textContent = cantidad
            document.querySelector('.cantidad-carrito').textContent = cantidad
        }       
        
    }
    else{
        // console.log('El carrito esta vacio')
        document.querySelector('.elmentos-carrito').innerHTML = `
        <p class="my-0 px-2">No hay nada en el carrito </p>
        `;
        document.querySelector('.cantidad-carrito-movil').textContent = 0
        document.querySelector('.cantidad-carrito').textContent = 0
    }
    // console.log('Completado')
    

}

function capturarCarritoCache(){
    // console.log('Hola')
    crearCarritoCache();
    var carritoCache = JSON.parse(localStorage.getItem('carrito'))

    if(carritoCache.length != 0){
        for(var i=0; i<carritoCache.length;i++){
            carrito.push(carritoCache[i]);
        }        
        inyectarDatosCarrito() 
    }
    else{
        inyectarDatosCarrito()
    }
}

function leerUrlData(){
    let valorUrl = window.location.search;

     //leemos el numero de par clave valor de la url
     const parrametrosUrl = new URLSearchParams(valorUrl);

     if(parrametrosUrl.size === 0){
        location.href='./';
    }

    for (const [llave, valor] of parrametrosUrl) {
        //almacenamos el valor enviado para buscar       
        // console.log(valor);
        urlData.push(valor)
    }
}
let omitirPaginas = [rutaPricipal, `${rutaPricipal}index.html`, `${rutaPricipal}historial-pedidos.html`]

if(!omitirPaginas.includes(location.pathname)){
    // console.log(location.pathname) 
    leerUrlData()
}
capturarCarritoCache();

let brnBorrarElemetoCarrito = document.querySelectorAll(`.btn-borrar`)

// console.log(brnBorrarElemetoCarrito);
brnBorrarElemetoCarrito.forEach(btnBorrar =>{
    btnBorrar.addEventListener('click', ()=>{
   
        var botonPulsado = btnBorrar.attributes.id.value;
        // console.log(botonPulsado)
        borrarElemtoEnCache(botonPulsado)
    });
})



// console.log(brnBorrarElemetoCarrito)
function borrarElemtoEnCache(idValue){
    // console.log(idValue)
    // console.log(carrito[0].metaIdPlato)
    var posicion = 0
    carrito.forEach(elemento => {        
        if(idValue === elemento.metaIdPlato){
            // console.log(posicion)
            // console.log(idValue,'=>',elemento.metaIdPlato)
            // console.log('antes',carrito)
            carrito.splice(posicion,1)
            // console.log('despues', carrito)
            actualizarCarrito()
            // setTimeout(() => {
            //    
            // }, 6000);
        }        
        posicion++
    })
}
document.querySelector('.facturar-carrito').addEventListener('click',()=>{    
    location.href = `./procesar-pago.html?accion=facturar`
})

