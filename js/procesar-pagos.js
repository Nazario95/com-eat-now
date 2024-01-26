import {mostrarAlerta, usuario } from "./session.js";

// CONEXION A FIRESTORE ---------------
import componentes from "../templetes/exportfile.js";
import {getFirestore, collection, getDocs, setDoc, doc, getDoc}  from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";
const db = getFirestore(componentes.app);

//CONEXION A STORAGE PARA LAS IMG
import {getStorage, ref, getDownloadURL} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-storage.js";
const storage = getStorage(componentes.app);

// VARIABLES, OBJETOS Y ARRAYS
// arrray que almacena valores de la URL
let datosCompra = []

let datosFactura=''

function leerURL(){
    let valorUrl = window.location.search;

    //capturar parrametors id plato y nombre restaurante en la url
    const parrametrosUrl = new URLSearchParams(valorUrl)
    
    for (const [llave, valor] of parrametrosUrl) {                  
        datosCompra.push(valor) 
        // almacenamos nombre del cliente 
       
        // var cliente =  datosCompra[2] 
        // var plato =  datosCompra[1] 
        // var restaurante = datosCompra[0]   
        
        // if(datosCompra[0] == 'facturar'){
        //     facturarCarrito();
        // }
    };
    facturar()
}
leerURL();

function facturar(){
    
    if(datosCompra.includes('facturar')) {
        // console.log('carrito')
        facturarCarrito();
    }
    else{
        // console.log('individual')
        facturaIndividual();

    }
}


function facturarCarrito(){

    //ocultar elmentos de modo individual
    let elementosIndividual = document.querySelectorAll('.solo-individual')
    elementosIndividual.forEach(componente =>{
        //ocultamos los elemntos
        componente.classList.add('d-none')
    })

    //capturar datos de carrito en memoria local
    let carritoGuardado = JSON.parse(localStorage.getItem('carrito'))
    // console.log(carritoGuardado)
    var totalCompra = 0;
    for(var i=0;i<carritoGuardado.length;i++){
        let {nombreDelPlato, precio, cantidad} = carritoGuardado[i]
        var totalUnidad = 0
        totalUnidad = cantidad*precio;
        totalCompra+=totalUnidad
        datosFactura+=`
        <tr>
            <td class="rojo fw-bold">${nombreDelPlato}</td>
            <td>${precio}XAF</td>
            <td class='rojo fs-5'>X${cantidad}</td>
            <td>${totalUnidad}XAF</td>
        </tr>
        `
    }
    
    document.querySelector('.factura-carrito').innerHTML = datosFactura
    document.querySelector('.total-carito').innerHTML = totalCompra
    
    crearFacturaDePago()
}

function facturaIndividual(){
    if(location.pathname == '/procesar-pago.html'){
        document.querySelector('.solo-carrito').classList.add('d-none')

    } 
}

// FUNCTION QUE REDIRECCION A LA PAGINA DE PROCESAR-PAGO.HTML
function porcesarPago(datosCompra){
    /*
     datosCompra[0] = id plato
     datosCompra[1] = nombre restaurante
     datosCompra[2] = nombre de usuario
     */
    // console.log(datosCompra)
    location.href=`procesar-pago.html?rest=${datosCompra[1]}&&plato=${datosCompra[0]}&&client=${datosCompra[2]}`
}

//FUNCION PARA CREAR CARRITO DE COMPRA DEL USUARIO
// function crearCarrito(datosCompra){
    
//     // console.log(datosCompra)

//    let carrito = async ()=>{
//         const docSnap = await getDoc(doc(db, `/lista-restaurantes/${datosCompra[1]}/sub-${datosCompra[1]}/cartas/sub-cartas/`, `${datosCompra[0]}`))
//         // console.log(docSnap.data().datosPlato)

//         //destruction de los datos
//         const {nombre_del_plato,nombreImg, precio, que_lleva } = docSnap.data();

//         const data = [{
//             nombre_del_plato:nombre_del_plato,
//             nombreImg:nombreImg,
//             precio:precio,
//             que_lleva:que_lleva,
//             comprador:datosCompra[2]
//         }]
//         // console.log(data);

//         await setDoc(doc(db, "public-db/YYKv1vbDdUWhvcEezFyx/datos-carritos",`${datosCompra[2]}`), data);
//         console.log('tarrea Completada')

//         porcesarPago(datosCompra)
//     }

//     carrito()
// }




if(location.pathname =='/procesar-pago.html'){
    /*
       datosCompra[0] -> nom restaurante
       datosCompra[1] -> id del plato
       datosCompra[2] -> nom cliente
    */  
   if(!datosCompra.includes('facturar')){

        console.log(datosCompra)
        const docSnap = await getDoc(doc(db, `/lista-restaurantes/${datosCompra[0]}/sub-${datosCompra[0]}/cartas/sub-cartas/`, `${datosCompra[1]}`))
        // console.log(docSnap.data()); 

        const {nombre_del_plato, nombreImg, precio, que_lleva } = docSnap.data();
        datosCompra.push(precio);

        const pathImg = await getDownloadURL(ref(storage, `${nombreImg}`)) 

        //accedemos a la etiqueta
        const componentefactura = document.querySelector('.componenete-factura')

        //creamos el html dinamico
        datosFactura = `
            <img src="${pathImg}" class="card-img-top">

            <div class="card-body">
                <h5 class="card-title">${nombre_del_plato}</h5>
                <p class="card-text">${que_lleva}</p>
                <span>${precio}CFA</span>
            </div>

            <ul class="list-group list-group-flush">
                <li class="list-group-item"><p>TOTAL</p><h3>${precio} CFA</h3></li>
            </ul>

            <div class="card-body">
                <a href="#" class="card-link">Cancelar</a>
                <a href="#" class="card-link">Añadir al carrito</a>
            </div>
        `
        //inyectamos el html
        componentefactura.innerHTML=datosFactura;
        //inyectando el total en la factura
        document.querySelector('.total-carito').innerHTML = `${precio}CFA` 

        crearFacturaDePago()     
    }
}


//verficar el estado del check box
if(location.pathname == '/procesar-pago.html'){
    activarDesactivarCheckBox()
}
function activarDesactivarCheckBox(){
    //accediendo al check box
    var domicilioState =  document.getElementById('a-domicilio')
    //accediendo a los selectores de ubicacion
    var ubicacionCliente = document.querySelectorAll('.ubicacion');
    //verificar el metodo de pago
   
   //CODIGO BTN CHECKBOX - Activar y desactivar el select de ubicacion
   domicilioState.addEventListener('change', ()=> {                   
       if(domicilioState.checked){                    
           //si esta activo, lo desactivamos
           for(var i=0;i<ubicacionCliente.length; i++){
               ubicacionCliente[i].disabled = false
           }
       }
       else{
           //si esta desactivado, se activa
           for(var i=0;i<ubicacionCliente.length; i++){
               ubicacionCliente[i].disabled = true
           }
       }
   })
}

//inyectar html en el contenedor #pay-method, segun el metodo de pago
//PARA UNA ACTUALIZACION
function cargarMetodoDepago(){
    const metodoPago = document.querySelector('.pago')
            
    //contentedor, donde se mostraran la informacion segun el metodo de pago seleccionado
    const componeneteDatosPago =  document.getElementById('pay-method')
}

function crearFacturaDePago(){
//SECCION DE REALIZACION DEL PAGO
    //leyendo el numero de registro del servidor
    const formPedido = document.getElementById('realizar-pago')  
    formPedido.addEventListener('submit', (e)=>{
        e.preventDefault()
        //console.log(formPedido);

        if(datosCompra.includes('facturar')) {           
            crearFacturaCarrito(formPedido);
        }
        else{           
            crearFacturaIndividual(formPedido);    
        }      
                  
    })
}


function crearFacturaCarrito(formPedido){
    //capturar carrito en cache
    let datosCarritoCache = JSON.parse(localStorage.getItem('carrito'))
    //introducir en el array
    datosCarritoCache.forEach(carritoCache=>{
       datosCompra.push(carritoCache)
    })
    //introducir nombre de usuario activo
     datosCompra.push(usuario.email)         
    console.log(datosCompra);//datos del plato

    const registroActual = async ()=>{

        var totalregistro = 0;

        const querySnapshot = await getDocs(collection(db, "public-db/YYKv1vbDdUWhvcEezFyx/registros"));       
        querySnapshot.forEach(() => {
            totalregistro++;                                     
        });  
        
        //  console.log(totalregistro);//total registros guardados en el servidor
        //  console.log(formPedido[0].value);//nombre completo
        //  console.log(formPedido[1].value);//numero de telefono
        
        //  console.log(formPedido[2].checked);//estado del check box
         
         if(!formPedido[2].checked){
            formPedido[3].value=''
            formPedido[4].value=''
            formPedido[5].value=''
         }

        //  console.log(formPedido[3].value);// ubicacion - provincia
        //  console.log(formPedido[4].value);//ubicacion - ciudad
        //  console.log(formPedido[5].value);//ubicacion - bario

        for(var i=0;i<datosCarritoCache.length;i++){ 
            console.log(datosCarritoCache[i])
            console.log(datosCompra)

            let usuarioFactura = {
                idRegistro:totalregistro,            
                userName:datosCompra[2],
                nombre:formPedido[0].value,
                numero:formPedido[1].value,
                ubicacion:{
                            provincia:formPedido[3].value,
                            ciudad:formPedido[4].value,
                            bario:formPedido[5].value
                        },
                metodoPago:formPedido[6].value,
                restaurante:datosCarritoCache[i].metaRestaurante,
                totalPagado:datosCarritoCache[i].precio,
                idPlato:datosCarritoCache[i].metaIdPlato,
                token:'',
                completado:false
            }
            
            let registros = {
                id:totalregistro,
                fecha:new Date().toISOString(),
                restaurante:datosCarritoCache[i].metaRestaurante,
                userName:datosCompra[2],
            }
    
            // console.log(usuarioFactura)
            // console.log(registros)

            // console.log('-------------------------------------------------------------')      
            totalregistro++

            procesandoPago(usuarioFactura, registros)
        }
        // 

    }  
    registroActual()
}




function crearFacturaIndividual(formPedido){
    const registroActual = async ()=>{

        var totalregistro = 0;

        const querySnapshot = await getDocs(collection(db, "public-db/YYKv1vbDdUWhvcEezFyx/registros"));       
        querySnapshot.forEach(() => {
            totalregistro++;                          
        });  
        
        //  console.log(totalregistro);//total registros guardados en el servidor
        //  console.log(formPedido[0].value);//nombre completo
        //  console.log(formPedido[1].value);//numero de telefono
        
        //  console.log(formPedido[2].checked);//estado del check box
         
         if(!formPedido[2].checked){
            formPedido[3].value=''
            formPedido[4].value=''
            formPedido[5].value=''
         }

        //  console.log(formPedido[3].value);// ubicacion - provincia
        //  console.log(formPedido[4].value);//ubicacion - ciudad
        //  console.log(formPedido[5].value);//ubicacion - bario
        

        //  console.log(formPedido[6].value);//metodo de pago
        //  console.log(datosCompra);//metodo de pago

        

        let usuarioFactura = {
            idRegistro:totalregistro,            
            userName:datosCompra[2],
            nombre:formPedido[0].value,
            numero:formPedido[1].value,
            ubicacion:{
                        provincia:formPedido[3].value,
                        ciudad:formPedido[4].value,
                        bario:formPedido[5].value
                    },
            metodoPago:formPedido[6].value,
            restaurante:datosCompra[0],
            totalPagado:datosCompra[3],
            idPlato:datosCompra[1],
            token:'',
            completado:false
        }
        
        let registros = {
            id:totalregistro,
            fecha:new Date().toISOString(),
            restaurante:datosCompra[0],
            userName:datosCompra[2],
        }
        procesandoPago(usuarioFactura, registros)

    }  
    registroActual() 
}


function procesandoPago(usuarioFactura, registros){
    console.log(usuarioFactura)
    // console.log(registros)  

    const guardandoDatosCompra = async ()=>{
        //Guardando los datos tomando como refencia los numeros de registro
        await setDoc(doc(db, `lista-restaurantes/${usuarioFactura.restaurante}/sub-${usuarioFactura.restaurante}/clientes/${datosCompra[2]}`, `${ usuarioFactura.idRegistro}`), usuarioFactura);

        

        if(!datosCompra.includes('facturar')){
            await setDoc(doc(db, `public-db/YYKv1vbDdUWhvcEezFyx/registros/`, `${registros.id}`), registros);
            mostrarAlerta('success', 'Gracias por comprar con nosotros');
            setTimeout(() => {
                location.href = '/';
            }, 5000);
        }
        else{

            await setDoc(doc(db, `public-db/YYKv1vbDdUWhvcEezFyx/registros/`, `${registros.id}`), registros);
            mostrarAlerta('success', 'Pago del carrito completado');
            setTimeout(() => {
                location.href = '/';
            }, 5000);
        }       
    }
    guardandoDatosCompra()
   
}
export {porcesarPago}