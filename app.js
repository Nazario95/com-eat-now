import componentes from "./templetes/exportfile.js";  
import { usuario } from "./js/session.js";
// CONEXION A FIRESTORE ---------------
import {getFirestore, getDoc, doc, getDocs, collection, updateDoc}  from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";
const db = getFirestore(componentes.app)

import {getStorage, ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-storage.js";
const storage = getStorage(componentes.app);

//INDEX.HTML - INYECTAR DATOS CATEGORIA ----------------------------------
if(location.pathname ==='/index.html' || location.pathname ==='/'){
    let componenteCategoriaMovil = ``;
    let componenteCategorilPc = ``;
    //ACCEDEMOS AL CONTENEDOR
    //movil
    const contenedorCategorias = document.querySelector('.explorar-categorias')
    //pc
    const contenedorCategoriasPc = document.getElementById('foot-c-father'); 

    const  inyectarCategorias = async ()=>{
        //CAPTURANDO LAS CATEGORIAS DEL SERVIDOR 
        const categoriasObj = await getDoc(doc(db,"public-db/YYKv1vbDdUWhvcEezFyx/lista-cartas/", "vGiJKcEEu5GJ513eDqTi"))
        const categorias = Object.values(categoriasObj.data());
        // console.log(categorias)
        //CREANDO COMPONENETES
        categorias.forEach((categoria)=>{
            componenteCategoriaMovil += `
            <div class=" tarjeta componente-tarjeta">
                <a  href="./resultados-busqueda.html?plato=${categoria}">
                    <img src="./src/img/categorias/${categoria}.jpg">
                    <div class="describcion-tarjeta"><h5>${categoria}</h5></div>
                </a>
            </div>
            `;

            componenteCategorilPc += `
            <div class="tarjeta componente-tarjeta">
                <a  href="./resultados-busqueda.html?plato=${categoria}">
                    <img src="./src/img/categorias/${categoria}.jpg" class="dimension-tarjeta">
                    <div class="describcion-tarjeta"><h5>${categoria}</h5></div>
                </a>
            </div>
            `;
        });

        //INYECTANDO COMPONENTES
        contenedorCategorias.innerHTML=componenteCategoriaMovil;
        contenedorCategoriasPc.innerHTML=componenteCategorilPc
    }

    inyectarCategorias()
  
}
// -----------------end index -----------------------------


// HISTORIAL DE PEDIDOS.HTML -------------------------------

//guardar todos los restaurantes en donde este este usuario
var restaurantesUsuario = []
//almacena el html de cada historial
var componenteTablaHistorial='';
var btnCancelarPedido;

if(location.pathname == '/historial-pedidos.html'){
    // console.log('yes') 
    capturarRestaraurantes()
    setTimeout(() => {
        btnCancelarPedido = document.querySelectorAll('.accion-cancelar-pedido');
        cancelarPedido()
    }, 5000);
}

//funcion que captura la lista de los restaurantes
function capturarRestaraurantes(){
    const SnapRestaurantes = async()=>{
        var snpaRestaurantes = await getDocs(collection(db,'lista-restaurantes'))
        snpaRestaurantes.forEach(restaurante =>{
            restaurantesUsuario.push(restaurante.id)
        })
        // console.log(restaurantesUsuario)
        capturarpedidosUsuario()
    } 
    SnapRestaurantes()
}
//funcion que captura todos los platos del usuario en cada restaurante
function capturarpedidosUsuario(){ 
    // console.log(restaurantesUsuario)
    var informacionPlato = []
    //si no hay usuario en cache, vamos a la pagina de inicio
    if(localStorage.getItem('sesion') == null){
        location.href='./'
    }

    restaurantesUsuario.forEach(historiaRetsurante =>{
         const historiaCompra = async ()=>{       
            const capturarHistoria = await getDocs(collection(db,`lista-restaurantes/${historiaRetsurante}/sub-${historiaRetsurante}/clientes/${localStorage.getItem('sesion')}`))

            capturarHistoria.forEach(dato => {
                // console.log(dato.data())
                //estos datos seran necesarios para acceder a los datos del plato mas abajo
                var datosPlato = {
                    restaurante:dato.data().restaurante,
                    idPlato:dato.data().idPlato,
                    idRegistro:dato.data().idRegistro
                }
                informacionPlato.push(datosPlato)
                // console.log(informacionPlato)
                componenteTablaHistorial += `
                <tr>
                    <th class="p-1">
                        ${dato.data().idRegistro}                            
                    </th>

                    <td class="p-1">
                        <span id="id-${dato.data().idPlato}-${dato.data().idRegistro}">
                            <img src="./src/img/load.svg">
                        </span>
                        <p class="m-0">${dato.data().totalPagado}XAF</p>
                    </td>

                    <td class="p-1"> ${dato.data().restaurante} </td>

                    <td class="p-1" id="fecha-registro-${dato.data().idRegistro}">
                        <img src="./src/img/load.svg">
                    </td>

                    <td class="p-1">
                        <div class="estado">
                            <p class="m-0 estado-en-proceso" id="estado-pedido-${dato.data().idRegistro}">En Proceso</p>
                        </div>                            
                        <div>
                            <button id="${dato.data().idRegistro}" class="btn btn-danger p-1 cancelar-pedido accion-cancelar-pedido registro-${dato.data().idRegistro}">Cancelar pedido</button>
                        </div>
                    </td>
                </tr> 
                `
            })
            document.getElementById('tabla-historial').innerHTML = componenteTablaHistorial
        }
        historiaCompra()
    })
    //funcion que pone los nombres  de los platos en la tabla    
    setTimeout(() => {
        //es necesario ejeturarla 2seg despues, pues es asyncrono
        nombresComidaHistorial(informacionPlato)
    }, 2000);
}
//PONER NOMBRES DE LOS PLATOS Y ACTUALIZAR EL ESTADO DEL PEDIDO
function nombresComidaHistorial(informacionPlato){  
    // console.log(informacionPlato)
    informacionPlato.forEach(plato=>{
        const capturarDatosPlato = async()=>{
            //inyectando nombre de plato
            var datoPlato = await getDoc(doc(db,`lista-restaurantes/${plato.restaurante}/sub-${plato.restaurante}/cartas/sub-cartas`,plato.idPlato)) 
            
            document.getElementById(`id-${plato.idPlato}-${plato.idRegistro}`).innerHTML=datoPlato.data().nombre_del_plato           

            //inyectando fecha
            var fechaPlato = await getDoc(doc(db,`public-db/YYKv1vbDdUWhvcEezFyx/registros`, `${plato.idRegistro}`))            
            document.getElementById(`fecha-registro-${plato.idRegistro}`).innerHTML=fechaPlato.data().fecha

            //verificar estado            
            if(fechaPlato.data().estado!=undefined){

                // console.log(fechaPlato.data().estado)               

                //leemos el elemento btn del html
                // console.log(document.getElementById(`estado-pedido-${fechaPlato.data().id}`))
                //eliminamos estado predeterminado
                document.getElementById(`estado-pedido-${fechaPlato.data().id}`).classList.remove('estado-en-proceso')
                //agregamos el estado guardado en servidor
                document.getElementById(`estado-pedido-${fechaPlato.data().id}`).classList.add(fechaPlato.data().estado)

                // console.log(fechaPlato.data().id)

                if(fechaPlato.data().estado.includes('completado')){
                    document.getElementById(`estado-pedido-${fechaPlato.data().id}`).textContent = 'Tu Pedido Esta Listo'
                    //ocultar el boton de cancelar tras completar el pedido
                    document.getElementById(`${fechaPlato.data().id}`).classList.add('d-none');
                }
                if(fechaPlato.data().estado.includes('retirado')){
                    document.getElementById(`estado-pedido-${fechaPlato.data().id}`).textContent = 'Pagado y Retirado'
                    //ocultar el boton de cancelar tras completar el pedido
                    document.getElementById(`${fechaPlato.data().id}`).classList.add('d-none');
                }
                if(fechaPlato.data().estado.includes('cancelando')){
                    document.getElementById(`estado-pedido-${fechaPlato.data().id}`).textContent = 'Cancelando'
                    document.getElementById(`${fechaPlato.data().id}`).classList.remove('cancelar-pedido');
                    document.getElementById(`${fechaPlato.data().id}`).classList.add('deshacer');
                    document.getElementById(`${fechaPlato.data().id}`).textContent = 'Desahacer'
                }
                if(fechaPlato.data().estado.includes('cancelado')){
                    document.getElementById(`estado-pedido-${fechaPlato.data().id}`).textContent = 'Cancelado'
                    //ocultar el boton de cancelar tras completar el pedido
                    document.getElementById(`${fechaPlato.data().id}`).classList.add('d-none');
                } 
            }

        }
        capturarDatosPlato()
    })
   
}

//funcion para cancelar un pedido
function cancelarPedido(){  
    // console.log(btnCancelarPedido)
    btnCancelarPedido.forEach( brnCancelar=> {
        brnCancelar.addEventListener('click',()=>{
            
            if(brnCancelar.classList[5]=='deshacer'){
                // console.log('deshaciendo')        
                var estado = 'estado-en-proceso'
            }
            else{
                // console.log(brnCancelar.classList) 
                var estado = 'estado-en-cancelando'
            }
                       
            actualizarEstadoPedido(brnCancelar.id, estado)
                
        })
    }); 
}

function actualizarEstadoPedido(id, estado){
    const actualizarEstado = async ()=>{

        await updateDoc(doc(db,`public-db/YYKv1vbDdUWhvcEezFyx/registros/`,id), {
            estado:estado
        })

        if(estado == 'estado-en-proceso'){
            await updateDoc(doc(db,`public-db/YYKv1vbDdUWhvcEezFyx/registros/`,id), {
                estado:estado
            })
            document.getElementById(`estado-pedido-${id}`).classList.remove('estado-en-cancelando')
            document.getElementById(`estado-pedido-${id}`).classList.add(estado)
            document.getElementById(`estado-pedido-${id}`).textContent='En Proceso'
            location.href=location.pathname
        }
        if(estado == 'estado-en-cancelando'){
            await updateDoc(doc(db,`public-db/YYKv1vbDdUWhvcEezFyx/registros/`,id), {
                estado:estado
            })
            document.getElementById(`estado-pedido-${id}`).classList.remove('estado-en-proceso')
            document.getElementById(`estado-pedido-${id}`).classList.add(estado)
            document.getElementById(`estado-pedido-${id}`).textContent='Cancelando'
            location.href=location.pathname

        }
    } 
    actualizarEstado()
}


// GLOBAL - TODAS LAS PAGINAS ----------------------------------
//funcion que inyecta datos el header
function templetePrincipal(){
    const head = document.querySelector('head');
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');

    head.innerHTML = componentes.head;

    if(location.pathname !='/index.html' && location.pathname !='/'){
        //ocultar componentes del header para pagina "/login.html"
        if(location.pathname =='/login.html'){
            header.innerHTML = ''; 
            footer.innerHTML = '';
            return;
        }
        //inyectado  modal del carrito en el header
        else{
            header.innerHTML= `
                ${componentes.header}
                <!-- modal del carrito -->
                <div class="modal fade" id="modal-carrito" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                        <div class="modal-header">
                            <p class="modal-title px-1" id="exampleModalLabel">Mi Carrito</p><img src="./src/svg/cart-fill.svg" alt="">
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body modal-datos-carrito elmentos-carrito">

                            <div class="d-flex justify-content-center carrito-nombre">
                                <p class="my-0 px-2">Vacio</p>
                                <img class='btn-borrar ' type="button" src="./src/svg/trash3-fill.svg">
                            </div>
                            
                        </div>
                        <button type="button" class="btn btn-danger facturar-carrito">Facturar</button> 
                        </div>
                    </div>
                </div>
            `;
        }        
    }   
    if(footer && location.pathname){
        footer.innerHTML = componentes.footer;
    }       
}
templetePrincipal();


// ADMINISTRACION.HTML-------------------------------------
//impedir que se carguen los modales en el menu de la pagina de adminstracion
if(location.pathname!= '/administracion.html'){
    inyectarModalLogin();
}
function inyectarModalLogin(){
    const containerModalLogin = document.getElementById('modal-login');
    if(location.pathname =='/login.html'){//inyectar formulario sin modal, solo si se usa movil
        containerModalLogin.innerHTML = componentes.formLogin;        
        return;
    }
    containerModalLogin.innerHTML = componentes.modalLogin;
}


// RESTAURANTES -------------------
let componentePlaceHolder = ``;
const contendorImgRestaurante = document.querySelector('.cadena-de-restaurantes')

const restaurantes = await getDocs(collection(db,`lista-restaurantes`));

restaurantes.forEach(restaurante =>{
    const urlImgRestaurante = async ()=>{
        await getDownloadURL(ref(storage,`/logo-restaurante/${restaurante.id}.png`))
            .then((url)=>{
                componentePlaceHolder+=`
                    <div class="tarjeta componente-tarjeta d-block">
                        <a href="./menu-restaurante.html?restaurante=${restaurante.id}">
                        <img src="${url}">
                        <div><h5 class="link bg-color">${restaurante.id}</h5></div>
                        </a>
                    </div>
                 `
            })
            //el if es un parche, para evitar conflicto con otras paginas
            if(location.pathname=='/index.html' || location.pathname=='/'){
                contendorImgRestaurante.innerHTML=componentePlaceHolder;
            }
            
    }
    urlImgRestaurante()  
})


//GUARDAR DATOS USUARIO EN CACHE
setTimeout(() => {
    var session =''
    // console.log(usuario.email)
    // session.push(usuario.email)
    session = usuario.email
    localStorage.setItem('sesion',session)
}, 2000);

















