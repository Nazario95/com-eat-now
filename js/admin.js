// ----- SECCION IMPORTACIONES -------
//FIREBASE - importar archivo de exportacion principal
import componentes from "../templetes/exportfile.js";
import {getFirestore,doc, getDoc, updateDoc, addDoc, collection, getDocs, query, where, increment} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";
//conectando a app de firebase, para firestore y 
const connFirestore = getFirestore(componentes.app);

//fireStorage - almacenamiendo de archivos
import {getStorage, ref, uploadBytes } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-storage.js";
const storage = getStorage(componentes.app);

//TOAST ALERT
import { mostrarAlerta } from "./mensajes-alerta.js";

// /IMPORTAR USUARIO ACTIVO
import { usuarioActivo } from "./session.js";
//USUARIO ACTIVO EN CACHE
const usuarioActivoCache = localStorage.getItem('sesion');

//RUTA PRINCIPAL
const rutaPricipal = localStorage.getItem('rutaPrincipal');

//VARIABLES PREDETERMINADAS
//almacena seccion actual de la pagina
let tabActual = '';
//html a inyectar en menu de cartassubir-plato
let listaCarta = `<option >Lista de Cartas Disponibles</option>`;
//almacenamos aqui los datoscapturados de la lista de cartas en firestore
let elmentosCartaArray = [];
//almacenos aqui los datos obtenidos de las diferentes cartas y monstrarlos en estadistica
let tablaDatos = ``;

//verificando pagina actual
var elementoDiv = document.querySelector('.donde-estoy');
const valorUrl = window.location.search;
    
document.addEventListener('DOMContentLoaded',()=>{
    verificarValorUrl();
})

//EXTRACCION DE CARTAS TOTALES
const querySnapshot = await getDoc(doc(connFirestore, "public-db/YYKv1vbDdUWhvcEezFyx/lista-cartas", "vGiJKcEEu5GJ513eDqTi"));

if(querySnapshot.exists()){
    //convertimos el objeto obtenido en arraglo
    const covertirArray = Object.values(querySnapshot.data())
    elmentosCartaArray = covertirArray;
    const numeroElemetos = covertirArray.length;

    //CODIGO SOLO PARA SECCION CARTA
        // generamos el html para el componente de la lista de carta a partir de los datos del array obtenido
        for(var i=0;i<numeroElemetos;i++){
            listaCarta += `<option>${covertirArray[i]}</option>`;
            //inyectamos las opciones en el menu deplegable de
            //Solo para la seccion carta
                if(tabActual == 'carta' || tabActual == 'subir-plato' ){                
                    const elemento = document.querySelector('.valores-carta');
                    elemento.innerHTML = `
                        ${listaCarta}
                    `
                }
        }  
}


//VERIFICAR SECCION DE PAG ADMIN ACTUAL
function verificarValorUrl(){
    //capturar parrametros de la url.
    const parrametrosUrl = new URLSearchParams(valorUrl);  

    //si no exites ningun valor en el parrametro, decimos que estamos en home
    if(parrametrosUrl.size === 0){
        tabActual = 'home';
    }
    //accemos a las clave:valor de los parramtros
    for (const [llave, valor] of parrametrosUrl) {
        tabActual = valor;
        // console.log(tabActual);
    }
    inyectarHtmlTab(tabActual);
}


//APLICACIONES DE LA PAGINA ADMINSTRACION-----------------------------
    //Datos del formulario crear carta
    let datosFormCarta;
    //Datos del formulario subir plato
    let datosFormPlato;

    let btnCarta

    if(tabActual == 'carta'){
        datosFormCarta = document.querySelector('.form-carta');
        datosFormPlato = document.querySelector('.form-plato');
        btnCarta = document.querySelector('.btn-carta');         
    
        btnCarta.addEventListener('click',(e)=>{
        e.preventDefault();

            if(tabActual=='carta'){carta()}

            else if(tabActual=='subir-plato'){subirPlato()}
            else if(tabActual=='perfil'){perfil()}        
        });
    }

    if(tabActual == 'subir-plato'){
        datosFormCarta = document.querySelector('.form-carta');
        datosFormPlato = document.querySelector('.form-plato');
        btnCarta = document.querySelector('.btn-carta');         
    
        btnCarta.addEventListener('click',(e)=>{
            e.preventDefault();
            if(tabActual=='subir-plato'){subirPlato()}     
        });
    }



// ------ SECCION INFORMACION PERFIL ------ 
        //consultamos el nombre del restaurante de usuario activo
        const buscarRestaurante = query(collection(connFirestore, 'lista-restaurantes'), where("admin", "==", `${usuarioActivo[0]}`))

        const datosObtenidos = await getDocs(buscarRestaurante)

        datosObtenidos.forEach(doc =>{
            // console.log(doc.id) ;
            usuarioActivo.push(doc.id)//almacenamos el nombre del restaurante en el arreglo
        })

        if(tabActual=='perfil'){
            console.log(usuarioActivo)
            const querySnapshot =  await getDoc(doc(connFirestore, "lista-restaurantes", usuarioActivo[1]));
            console.log(querySnapshot.data());

            const datosRegistroformulario = document.getElementById('registro');
            //Ver datos guardados
            datosRegistroformulario[0].value = querySnapshot.data().nombre;
            datosRegistroformulario[1].value = querySnapshot.data().correo;
            datosRegistroformulario[2].value = querySnapshot.data().provincia;
            datosRegistroformulario[3].value = querySnapshot.data().ciudad;
            datosRegistroformulario[4].value = querySnapshot.data().bario;
            datosRegistroformulario[5].value = querySnapshot.data().telefono;
            
        }

        function perfil(){
            const datosRegistroformulario = document.getElementById('registro');
            const  datosRegistro = {
                id:'2m2m11',
                nombre:datosRegistroformulario[0].value,
                correo: datosRegistroformulario[1].value,
                bario:datosRegistroformulario[4].value,
                ciudad:datosRegistroformulario[3].value,
                provincia:datosRegistroformulario[2].value,
                clientes_fieles:0,    
                numero_compras:0,    
                valoracion:0,
                telefono:datosRegistroformulario[5].value,
                token:''
            }

            updateDoc(doc(connFirestore,"lista-restaurantes", usuarioActivo[1]),datosRegistro);
            let msg = 'Actualizacion completada';
            mostrarAlerta('success',msg)
        }
    

     // ---- SECCION CREAR CARTA ------
        // APP PARA SUBIR UNA CARTA NUEVA
        function carta(){
            let existeCarta = 0;
            const nombreCategoria = datosFormCarta[1].value.toLowerCase();
            // const descripcionCarta = datosFormCarta[2].value.toLowerCase();

            for(let i=0; i<elmentosCartaArray.length; i++){
                if(nombreCategoria.match(elmentosCartaArray[i])){
                    //exsteCarta, al ser uno, no se va ha enviar datos de manera erronea
                    existeCarta = 1;
                    //mensajes de alerta
                    let msg1 = `Ya existe una carta relacionada al nombre ${elmentosCartaArray[i]}`;
                    let msg2 = `Haz click en la lista desplegable y selciona "${elmentosCartaArray[i].toUpperCase()} "`;
                    //mostramos las aelrtas
                    mostrarAlerta('info', msg1);
                    //segunda alerta
                    setTimeout(() => {
                        mostrarAlerta('info', msg2);
                    }, 6000);
                    break;
                }
            }

            if(existeCarta==0){ 
                agregarCategoria(nombreCategoria);
            }
        }
        //funcion que agrega la carta a la bd de firestores
        function agregarCategoria(categoria){
            //leemos el numero de elementos actuales en la  bd
            const cantidadElemtosActual = elmentosCartaArray.length;
            //creamos el texto de la seccion "key" del objeto
                //las key se nombra nc1, nc2, nc-n
            let typoCategoria = `nc${cantidadElemtosActual+1}`
            //actualizamos los datos
            updateDoc(doc(connFirestore, "public-db/YYKv1vbDdUWhvcEezFyx/lista-cartas", "vGiJKcEEu5GJ513eDqTi"),
                {[typoCategoria]:categoria}
            );
            //menaje del popup alert
            let msg1 = 'Registro completado.\nPor favor, recargue la pagina'
            mostrarAlerta('success', msg1);
            //recargamos la pagina, para evitar que se reescriban datos en la db
            setTimeout(() => {
                location.href = './administracion.html?selec=carta';
            }, 2000);
        }
   
    //----- SECCION SUBIR PLATO ------ 
    function subirPlato(){

        const grupoPerteneciente = ['carta']//los grupos  determinaminan la zona en la que se va a mostra la imagen

        const datosPlato = {
            id:'112-A-RWD',//formato:(112 - numero en la lista total de usuarios) -- (A-Primera letra de su nombre) -- (RWD,RW, W - nivel de acceso, metodo linux)
            categoria:datosFormPlato[0].value,
            nombre_del_plato:datosFormPlato[1].value,
            guarnicion:datosFormPlato[2].value,

            nombreImg:`N_${datosFormPlato[1].value}-C_${datosFormPlato[0].value}-U_${usuarioActivo[0]}-G_${grupoPerteneciente[0]}`,

            precio:datosFormPlato[4].value,
            que_lleva:datosFormPlato[5].value,
            total_pedidos:0,
            valoracion:0
        }
        

    //SUBIR DATOS COMIDA
        // console.log(usuarioActivo[1])
        const subirDatosComida = new Promise((resolve, reject) => {
            //codigo asyncrno de la promesa
            var enviadoDatos =  addDoc(collection(connFirestore, `lista-restaurantes/${usuarioActivo[1]}/sub-${usuarioActivo[1]}/cartas/sub-cartas`),datosPlato);
        
            if(enviadoDatos){
                resolve(enviadoDatos);
            }       
            else{
                reject(error);
            }    
        
        });

        //ALMACENAR LOS METADATOS DE LA IMAGNE
     

        //ALAMCENAR LAS IMAGENES
            //ruta donde se almacenara la imagen aque querremos subir
            var rutaArchivo = datosFormPlato[3].files[0];
            //nombre con el que se almacenara en fiireStor
            var nombreArchivo= datosPlato.nombreImg;
            // console.log(nombreArchivo)

        //REDIMENSIONAR IMAGEN - Proximamente

            //  const resizedImg = resizeImage(img, 0.6);
            //  console.log(resizedImg)
             
 
            //  function resizeImage(image, quality) {
            //      const canvas = document.createElement('canvas');
            //      const ctx = canvas.getContext('2d');
             
            //      canvas.width = image.width * 0.6;
            //      canvas.height = image.height * 0.6;
             
            //      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
             
            //      return canvas.toDataURL('image/jpeg', quality);
            //  }


        const subirImagenes = new Promise((resolve, reject) => {

            const storageRef = ref(storage, `${nombreArchivo}`);
            //codigo asyncrono
            var enviadoImagenes = uploadBytes(storageRef, rutaArchivo );

            if(enviadoImagenes){
                resolve(enviadoImagenes);
            }       
            else{
                reject(error);
            }    
        })

        subirDatosComida
            .then(() => {
                console.log('Datos...ok')
                return subirImagenes;
            })
            .then(() =>{
                console.log('Imagenes...ok')
                let msg = 'Plato agregado correctamente a su menu'
                mostrarAlerta('success', msg);
            })
            .then(()=>{
                setTimeout(() => {
                    location.href = './administracion.html?selec=subir-plato';
                }, 2000);
            })
            .catch(error=>console.log(error));
    }  


var homeData = [];
if(tabActual=='home'){
    const querySnapshot =  await getDoc(doc(connFirestore, "lista-restaurantes", usuarioActivo[1]));
    localStorage.setItem('datosRestauranteCache',JSON.stringify(querySnapshot.data()))
    // console.log(querySnapshot.data());
    //Agregar Datos estadisticos al array
    homeData.push(querySnapshot.data().nombre) 
    homeData.push(querySnapshot.data().numero_compras) 
    homeData.push(querySnapshot.data().correo) 

    // console.log(homeData)
    //inyectar datos estadisticos en html
    document.querySelector('.nom-restaurante').textContent=homeData[0]
    document.querySelector('.num-compras').textContent=homeData[1]
    document.querySelector('.usuario-actvo').textContent=homeData[2] 
    
    //APLICACION PARA EXTRACCION DE DATOS EN EL MODAL DE LA SECCION INFORMACION HOME > ESTADISTICAS
    const datosEstadisticos = new Promise((resolve, reject) => {
        const docsCartarestaurantes = getDocs(collection(connFirestore, `/lista-restaurantes/${usuarioActivo[1]}/sub-${usuarioActivo[1]}/cartas/sub-cartas/`));

        if(docsCartarestaurantes){
            resolve(docsCartarestaurantes)
        }
    })

    datosEstadisticos
        .then(res =>{
            res.forEach((doc) => { 
                let {id,nombrePlato,valoracion,numeroDeCompras} = {
                    id:doc.id,
                    nombrePlato:doc.data().nombre_del_plato,
                    valoracion:doc.data().valoracion,
                    numeroDeCompras:doc.data().total_pedidos,
            }
            tablaDatos+= `
            <tr id="${id}">
                <td>${nombrePlato}</td>
                <td>${valoracion}</td>
                <td>${numeroDeCompras}</td>
            </tr> 
            `;

            let elementoDatosEstadisticos = document.getElementById('tabla-datos-estadisticos');
                elementoDatosEstadisticos.innerHTML = tablaDatos;
            
        })
    
    });
}

// FUNCION QUE INYECTA LOS DATOS EN LAS PAGINAS
function inyectarHtmlTab(tabActual){
    if(tabActual === 'home'){
        
        elementoDiv.innerHTML = `
        <div class="d-flex centrar-flex">
            <div class="d-block">

                 <div class="card">
                     <h4>Restaurente <span class="nom-restaurante"></span></h4>
                     <p class="usuario-actvo">Administrador</p>
                 </div>

                <div class="card">
                    <p>Cuenta sin verificar</p>
                </div>
            </div>

            <div class="d-block">
                <div class="card">
                    <h4>Total Compras Realizadas</h4>
                    <h2 class="num-compras"></h2>
                </div>

                <div class="card">
                    <a type="button"  data-bs-toggle="modal" data-bs-target="#exampleModal">
                        <h2>Estadistica</h2>
                    </a>
                </div>
            </div>
        </div>

        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-fullscreen">
                <div class="modal-content">

                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Datos Estadisticos</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    
                    <div class="modal-body" id="datos-estadisticos">
                        <!-- ---------------------------MODAL------------------------------------ -->
                            <table class="table">

                            <thead>
                                <tr>
                                    <th scope="col">Plato</th>
                                    <th scope="col">Valoracion</th>
                                    <th scope="col">Numero de compras</th>
                                    <th scope="col">Fecha de Creacion</th>
                                </tr>
                            </thead>

                            <tbody id="tabla-datos-estadisticos">                               
                                                                                    
                            </tbody>
                        </table>
                        <!-- ------------------------FIN MODAL--------------------------------------- -->
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cerrar</button>
                        
                    </div>
                </div>
            </div>
        </div>

        <div class="btn-carta"></div>
        `
    }

    
    // ----------------------------------------------------------------------------------------------------------------
    else if(tabActual === 'perfil'){

        elementoDiv.innerHTML = `
        <form id="registro" class="container registro">
            <div class="mb-3">
                <label for="nomre" class="nombre">nombre del restaurante</label>
                <input autocomplete="off" required type="text" class="form-control" id="nombre"  data-titulo="nombre del restaurante">
            </div>

            <div class="mb-3">
            <label for="correo" class="correo">correo del restaurante</label>
            <input autocomplete="off" required type="email" class="form-control" id="correo" data-titulo="correo electronico">
            </div>

            <div class="mb-3 d-flex ">
                <select required class="form-select ciudad">
                    <option selected>provincia</option>
                    <option value="bioko-norte">Bioko-Norte</option>
                    <option value="bioko-sur">Bioko Sur</option>
                    <option value="litoral">Litoral</option>
                </select>

                <select required class="form-select bario" >
                    <option selected>ciudad</option>
                    <option value="malabo">Malabo</option>
                    <option value="baney">Baney</option>
                    <option value="bata">Bata</option>
                </select>
            </div>
                <div class="mb-3">
                    <label for="bario" class="correo">Bario</label>
                    <input  autocomplete="off" required type="text" class="form-control" id="bario" data-titulo="zona de ubicacion del restaurante">
                </div>
        
                <div class="mb-3">
                    <label for="tel" class="correo">Telefono</label>
                    <input  autocomplete="off" required type="number" class="form-control" id="tel" data-titulo="telefono del restaurante">
                </div>
        
            <button type="submit" class="btn btn-danger btn-carta">Actualizar</button>
        </form>
        `
    }
    // ----------------------------------------------------------------------------------------------------------------
    else if(tabActual === 'historial'){
        //DATOS => Seccion historial

        let clientesRestaurante=[]
        let getPlatosCliente = []
        let getEstadoPedido = []
        let platosCarta = []

        let htmlTablaClientes='';

        //verificar informacion de restante en cache
        verificarDatosRestaurante()

        //extraer informacion restaurante en cache
        var {correo, nombre} = JSON.parse(localStorage.getItem('datosRestauranteCache'))
    //    console.log(correo, nombre.toLowerCase());

       //Promesa de capturar clientes
       const getNombresClientes= new Promise((resolve, reject) => {
            let clientes =  getDocs(collection(connFirestore,`lista-restaurantes/${nombre.toLowerCase()}/sub-${nombre.toLowerCase()}/clientes/sub-clientes`)) 

            if(clientes){
                resolve(clientes)
            }
       })
       //procesar resultados de clientes capturados
       getNombresClientes
        .then(clientes =>{             
            clientes.forEach(cliente =>{
                //guardando nombres en el array "clientesRestaurante"
                clientesRestaurante.push(cliente.id)
            })        
        })
        
        .then(() =>{
            clientesRestaurante.forEach(cliente => {
                //Promesa que captura todos los platos del restaurante
                const getPlatosRestaurante = new Promise((resolve, reject) => {

                    let platosCliente = getDocs(collection(connFirestore,`lista-restaurantes/${nombre.toLowerCase()}/sub-${nombre.toLowerCase()}/clientes/sub-clientes/${cliente}/sub-${cliente}`));

                    if(platosCliente){
                        resolve(platosCliente)
                    }
                })

                getPlatosRestaurante
                //capturando los platos
                    .then(platosCliente =>{
                        platosCliente.forEach(platos => {
                            getPlatosCliente.push(platos.data())                           
                            htmlHistorialCompras(platos.data())
                        })
                        
                    })
              
            })
           
            function htmlHistorialCompras(datos){
                // console.log(datos)

                let datosPlatoRegistro = async()=>{                      
                    let obtenerIdRegistro = await getDoc(doc(connFirestore,`public-db/YYKv1vbDdUWhvcEezFyx/registros/${datos.idRegistro}`))
                    // console.log(obtenerIdRegistro.data())
                    getEstadoPedido.push(obtenerIdRegistro.data())

                    let getDatosDelPlato = await getDoc(doc(connFirestore,`lista-restaurantes/${datos.restaurante}/sub-${datos.restaurante}/cartas/sub-cartas/${datos.idPlato}`))
                    //creamos una constante para almacenar los platos
                    const platosRestaurante =getDatosDelPlato.data()
                    //agregamos el id del plato al nuevo objeto creado
                    platosRestaurante.idPlatoRegistro=getDatosDelPlato.id
                    //agregamos los datos al array global platosCarta
                    platosCarta.push(platosRestaurante)

                    // inyectarhtmlDatosTabla(datos,getRegistros,getInfoDatosDelPlato)
                }
                datosPlatoRegistro()
            
            }

            //llamando a la funcion para crear elementos de la tabla
            setTimeout(() => {
                inyectarhtmlDatosTabla()
            }, 3000);

            function inyectarhtmlDatosTabla(){
                // console.log(clientesRestaurante)
                // console.log(getPlatosCliente)
                // console.log(getEstadoPedido)
                // console.log(platosCarta)

                clientesRestaurante.forEach(cliente =>{
                    getPlatosCliente.forEach(plato=>{                        
                        if(cliente === plato.userName){
                            // console.log(cliente)
                            // console.log(plato)

                            for(var i=0;i<platosCarta.length;i++){
                                if(platosCarta[i].idPlatoRegistro == plato.idPlato){
                                    var nombrePlato = platosCarta[i].nombre_del_plato
                                }
                            }

                            for(var i=0;i<getEstadoPedido.length;i++){
                                if(getEstadoPedido[i].id == plato.idRegistro){
                                    var fechaCompra = getEstadoPedido[i].fecha
                                }
                            }
                            // console.log(nombrePlato)
                            // console.log(fechaCompra)

                            htmlTablaClientes += `
                                    <tr>
                                        <td><!-- INICIO DE HTML MODAL -->

                                            <!--------- ELEMENTO BOTON QUE ACTIVA EL MODAL -------->
                                            <!-------- data-bs-target="#infoCompra" AQUI INDICAS AL MODAL QUE APUNTAS O OBRAS ------>
                                            <a type="button" data-bs-toggle="modal" data-bs-target="#${plato.idRegistro}-${plato.idPlato}">
                                                ${plato.userName}
                                            </a> 
                                        </td>
                                        <td>${nombrePlato}</td>
                                        <td>${fechaCompra}</td>
                                        <td>
                                            <p class="m-0 text-light estado-pedido" id="${plato.idRegistro}">
                                                <img src="./src/img/load.svg">
                                            </p> 
                                        </td>
                                    </tr>


                                <div>
                                <!-- -------EL MODAL A INVOCAR------- -->
                                <!------ infoCompra, DEBE COINCIDIR CON EL MODAL QUE APUNTAS ARIBA ------->
                                <div class="modal fade" id="${plato.idRegistro}-${plato.idPlato}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                    <!-- INDICAMOS LA POSOCION DEL MODAL -->
                                    <div class="modal-dialog  modal-dialog-centered">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <!-------- TITULO DEL MODAL -------->
                                                <h1 class="modal-title fs-5" id="staticBackdropLabel">Informacion de Compra</h1>
                                                <!-------- RESERVADO PARA EL X DE CERRA ------>
                                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <!---------- TODOS LOS DATOS QUE QUIERES PONER EL MODAL, AQUI VAN ------------>
                                            <div class="modal-body">
                                                <p>ID de Compra: 0000<span>${plato.idRegistro}</span></p>
                                                <p>Plato: <span>${nombrePlato}</span></p>
                                                <p>Pagado: <span>${plato.totalPagado}FCFA</span></p>
                                                <p>Tipo de Pago: <span>${plato.metodoPago}</span></p>
                                                <p>Codigo: <span>4757</span></p>
                                                <p>Fecha: <span>${fechaCompra}</span></p>
                                            </div>
                                            <!------------ LOS BOTONES DE ABAJO DEL MODAL ------------>
                                            <div class="modal-footer">
                                                <button type="button" class="${plato.idRegistro} btn btn-warning btn-imprimir" value="imprimir">Realizar pago</button>

                                                <button type="button" class="${plato.idRegistro} btn btn-danger btn-cancelar" value="cancelar">Cancelar</button>

                                                <button type="button" class="${plato.idRegistro} btn btn-secondary btn-rechazar" value="rechazar">Rechazado</button>

                                                <button type="button" class="${plato.idRegistro} btn btn-success btn-completado" value="completado">Completado</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- FINAL DEL MODAL -->
                                </div> 
                                <!-- FIN DE FILA TABLA -->                      
                            `
                        }
                    })
                    
                })   

                document.getElementById('tabla-historial-compras').innerHTML = htmlTablaClientes

                // console.log(htmlTablaClientes)
                // modificarEstadosCompra(datos,getRegistros)
                // carrgarEstadoPedido(datos,getRegistros)
                cargarEstadoPedido() 
                modificarEstadosCompra()               
            }
        })

        elementoDiv.innerHTML =`
        <table class="table table-light">
            <thead>
                <tr>
                    <!--------- PRIMERA COLUMNA ------------>
                    <th scope="col">Usuario</th>
                    <th scope="col">Plato</th>
                    <th scope="col">Fecha</th>
                    <th scope="col">Estado</th>
                </tr>
            </thead>

            <tbody id="tabla-historial-compras">
                <!-- FIN DE FILA TABLA -->
            </tbody>
        </table>
        ` 
         //inyecta estado del pedido
         function cargarEstadoPedido(){

            // console.log(getEstadoPedido)
            // console.log(getPlatosCliente)
            
            getPlatosCliente.forEach(plato =>{
                // console.log(plato.idRegistro)
                for(var i=0;i<getEstadoPedido.length;i++){

                    if(plato.idRegistro == getEstadoPedido[i].id){

                        if(getEstadoPedido[i].estado == undefined || getEstadoPedido[i].estado == 'proceso'){
                            // console.log('estado-> undefined')

                            document.getElementById(plato.idRegistro ).classList.add('estado-en-proceso');

                            document.getElementById(plato.idRegistro ).innerHTML =`
                                <span>En Proceso</span>
                            `
                        }

                        if(getEstadoPedido[i].estado == 'completado'){
                            // console.log('estado-> completado')

                            document.getElementById(plato.idRegistro ).classList.add('estado-en-completado');

                            document.getElementById(plato.idRegistro ).innerHTML =`
                                <span>Completado</span>
                            `
                        }

                        if(getEstadoPedido[i].estado == 'retirado'){
                            // console.log('estado-> retirado')

                            document.getElementById(plato.idRegistro ).classList.add('estado-en-retirado');

                            document.getElementById(plato.idRegistro ).innerHTML =`
                                <span>Retirado</span>
                            `
                        }

                        if(getEstadoPedido[i].estado == 'cancelando'){
                            // console.log('estado-> cancelando')

                            document.getElementById(plato.idRegistro ).classList.add('estado-en-cancelando');

                            document.getElementById(plato.idRegistro ).innerHTML =`
                                <span>Cancelando</span>
                            `
                        }

                        if(getEstadoPedido[i].estado == 'cancelado'){
                            // console.log('estado-> cancelado')

                            document.getElementById(plato.idRegistro ).classList.add('estado-en-cancelado');

                            document.getElementById(plato.idRegistro ).innerHTML =`
                                <span>Cancelado</span>
                            `
                        }
                       
                    }
                }                
            })           
        } 

        function modificarEstadosCompra() {
            let btnImprimir = document.querySelectorAll('.btn-imprimir')         
            let btnCancelar = document.querySelectorAll('.btn-cancelar')         
            let btnRechazado = document.querySelectorAll('.btn-rechazar')         
            let btnCompletado = document.querySelectorAll('.btn-completado') 

            // console.log(btnImprimir)
            btnImprimir.forEach(impresion => {//imprimir se da cuando ya se pago el pedido
                impresion.addEventListener('click', ()=>{
                    // console.log('imprimiendo')
                    // console.log(btnCompletado.classList[0])
                    // console.log(impresion.classList[0])
                    cambiarEstadopedido(impresion.classList[0], 'retirado')
                })
            })

            btnCancelar.forEach(cancelar => {
                cancelar.addEventListener('click', ()=>{
                    // console.log('cancelar')
                    // console.log(btnCompletado.classList[0])
                    // console.log(cancelar.classList[0])
                    cambiarEstadopedido(cancelar.classList[0], 'cancelado')
                })
            })

            btnRechazado.forEach(rechazar => {
                rechazar.addEventListener('click', ()=>{
                    //rechaza la peticion de cancelacion del usuario
                    cambiarEstadopedido(rechazar.classList[0], 'proceso')
                })
            })

            btnCompletado.forEach(completado => {
                completado.addEventListener('click', ()=>{
                    console.log('completar')
                    // console.log(btnCompletado.classList[0])
                    // console.log(completado.classList[0])
                    cambiarEstadopedido(completado.classList[0], 'completado')
                })
            })
        }

    //funciona que actualizo los indicadores de estado del pedido
    function cambiarEstadopedido(numRegistrado, estadoCompra){
        //actualizar estado
        // console.log(getPlatosCliente)

        getPlatosCliente.forEach(pagoCompletado=>{
            if(pagoCompletado.idRegistro == numRegistrado && pagoCompletado.completado == 'true'){
                // console.log('este pedido ya fue procesado')
                mostrarAlerta('error','ERROR: Este pedido ya fue completado y retirado')                
            }
            else if(pagoCompletado.idRegistro == numRegistrado && pagoCompletado.completado != 'false'){
                if(confirm("Completar operacion?")){
                    completandoProcesoDeCompra(numRegistrado, estadoCompra)
                }
            }
        })

        //solo se ejecutado si este pedido aun no se ha completado el pago y retiro
    function completandoProcesoDeCompra(numRegistrado, estadoCompra){

        updateDoc(doc(connFirestore,`public-db/YYKv1vbDdUWhvcEezFyx/registros`,numRegistrado), {estado:estadoCompra})

        //si se pulsa el boton de "Realizar pago"
        if(estadoCompra == 'retirado' || estadoCompra == 'cancelado'){
            getPlatosCliente.forEach(valoracionPlato=>{                
                if(valoracionPlato.idRegistro == numRegistrado){
                    //si no se cancela la compra, incrementamos la el numero de compra
                    if(estadoCompra != 'cancelado'){
                         //incrementamos el contador de compra del plato
                        updateDoc(doc(connFirestore,`lista-restaurantes/${valoracionPlato.restaurante}/sub-${valoracionPlato.restaurante}/cartas/sub-cartas`, valoracionPlato.idPlato),
                        {total_pedidos:increment(1)}
                        );
                    }                  

                    //indicamos que la compra se ha realizado o cancelado
                    updateDoc(doc(connFirestore,`lista-restaurantes/${valoracionPlato.restaurante}/sub-${valoracionPlato.restaurante}/clientes/sub-clientes/${valoracionPlato.userName}/sub-${valoracionPlato.userName}`, numRegistrado),
                        {completado:'true'}
                    );

                }
            }) 
            mostrarAlerta('success','Registro Completado') 
        }
        setTimeout(() => {
            location.reload()
         }, 2000);
    }

        
        // console.log('estado modificado')
    }

        

    }
    // ----------------------------------------------------------------------------------------------------------------
    
    else if(tabActual === 'carta'){
      
            elementoDiv.innerHTML =`
            <form class="colorful-form form-carta">
                <div>          
                    <select class="btn-option valores-carta">
                        ${listaCarta}
                    </select>
                </div>           
                <p>No lo Encuetras? Inidiquelo Aqui</p>
                <div class="form-group">
                <label class="form-label" for="name">Nombre de La Categoria:</label>
                <input  autocomplete="off" required="" placeholder="Introducir nombre" class="form-input" type="text">
                </div>
                <div class="form-group">
                <label class="form-label" for="message">Breve describcion de la categoria</label>
                <textarea  autocomplete="off"  placeholder="A que tipo de alimentos pertenece esta categoria" class="form-input" name="message" id="message"></textarea>
                </div>
                <button class="form-button btn-carta" type="submit">Guardar</button>
            </form>
            `
    }

    // ----------------------------------------------------------------------------------------------------------------
    else if(tabActual === 'subir-plato'){   

        console.log('leyendo')

        let guarnicion = `<option >Nada selecionado</option>`;
        let arrayGuarnicion = ['arroz', 'pan', 'yuca', 'platano', 'fufu', 'otro'];

        for(let i=0;i<arrayGuarnicion.length;i++){
            guarnicion+=`<option >${arrayGuarnicion[i]}</option>`;
        }

        elementoDiv.innerHTML =`
        <form id="registro" class="container registro form-plato">
            <span>Seleciona la categoria de la carta</span>
            <div class="mb-3 d-flex ">                
                <select required class="valores-carta">
                    ${listaCarta}
                </select>
            </div>

            <div class="mb-3">
                <label for="nombre-plato" class="nombre">Nombre del Plato</label>
                <input autocomplete="off" required type="text" class="form-control" id="nombre-plato">
            </div>

            <span>Guarnicion o acompañante</span>
            <div class="mb-3 d-flex ">                
                <select required class="valores-carta">
                    ${guarnicion}
                </select>
            </div>

            <div class="mb-3">
                <label class="file">Subir imagen del plato</label>
                <input type="file" name="fichero" class="d-block" id="fichero">
            </div>

            <div class="mb-3">
                <label for="precio-plato" class="correo">Precio del plato</label>
                <input autocomplete="off"  required type="number" class="form-control" id="precio-plato">
            </div>
    
            <div class="mb-3">
                <label for="tel" class="correo">Que lleva este plato?</label>
                <textarea required type="text" class="form-control" id="plato-describcion"></textarea>
            </div>
        
            <button type="submit" class="btn btn-danger btn-carta" data-id="plato">Cargar</button>
        </form>
        `        
    }
}   


  function verificarDatosRestaurante(){
    if(localStorage.getItem('datosRestauranteCache') == null){
        location.href = './administracion.html?selec=home'
    }
  }