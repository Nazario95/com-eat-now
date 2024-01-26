// ----- SECCION IMPORTACIONES -------
//FIREBASE - importar archivo de exportacion principal
import componentes from "../templetes/exportfile.js";
import {getFirestore,doc, getDoc, updateDoc, addDoc, collection, getDocs, query, where} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";
//conectando a app de firebase, para firestore y 
const connFirestore = getFirestore(componentes.app);

//fireStorage - almacenamiendo de archivos
import {getStorage, ref, uploadBytes } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-storage.js";
const storage = getStorage(componentes.app);

//TOAST ALERT
import { mostrarAlerta } from "./mensajes-alerta.js";

// /IMPORTAR USUARIO ACTIVO
import { usuarioActivo } from "./session.js";

//VARIABLES PREDETERMINADAS
//almacena seccion actual de la pagina
let tabActual = '';
//html a inyectar en menu de cartas
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
    const datosFormCarta = document.querySelector('.form-carta');
    //Datos del formulario subir plato
    const datosFormPlato = document.querySelector('.form-plato');
    //Captura del boton Submit
    const btnCarta = document.querySelector('.btn-carta');
    btnCarta.addEventListener('click',(e)=>{
        e.preventDefault();
        if(tabActual=='carta'){carta()}
        else if(tabActual=='subir-plato'){subirPlato()}
        else if(tabActual=='perfil'){perfil()}        
    });


// ------ SECCION INFORMACION PERFIL ------ 
        //consultamos el nombre del restaurante de usuario activo
        const buscarRestaurante = query(collection(connFirestore, 'lista-restaurantes'), where("admin", "==", `${usuarioActivo[0]}`))

        const datosObtenidos = await getDocs(buscarRestaurante)

        datosObtenidos.forEach(doc =>{
            // console.log(doc.id) ;
            usuarioActivo.push(doc.id)//almacenamos el nombre del restaurante en el arreglo
        })

        if(tabActual=='perfil'){
            const querySnapshot =  await getDoc(doc(connFirestore, "lista-restaurantes", usuarioActivo[1]));
            // console.log(querySnapshot.data());

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
                location.href = '/administracion.html?selec=carta';
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
                    location.href = '/administracion.html?selec=subir-plato';
                }, 2000);
            })
            .catch(error=>console.log(error));
    }
    
  
//APLICACION PARA EXTRACCION DE DATOS EN EL MODAL DE LA SECCION INFORMACION PERFIL > ESTADISTICAS
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
                numeroDeCompras:doc.data().total_pedidos
           }
           tablaDatos+= `
           <tr>
               <th scope="row">${id}</th>
               <td>${nombrePlato}</td>
               <td>${valoracion}</td>
               <td>${numeroDeCompras}</td>
           </tr> 
           `;

           let elementoDatosEstadisticos = document.getElementById('tabla-datos-estadisticos');
            elementoDatosEstadisticos.innerHTML = tablaDatos;
           
    })
 
});

var homeData = [];
if(tabActual=='home'){
    const querySnapshot =  await getDoc(doc(connFirestore, "lista-restaurantes", usuarioActivo[1]));
    
    //Agregar Datos estadisticos al array
    homeData.push(querySnapshot.data().nombre) 
    homeData.push(querySnapshot.data().numero_compras) 
    homeData.push(querySnapshot.data().correo) 

    // console.log(homeData)
    //inyectar datos estadisticos en html
    document.querySelector('.nom-restaurante').textContent=homeData[0]
    document.querySelector('.num-compras').textContent=homeData[1]
    document.querySelector('.usuario-actvo').textContent=homeData[2] 
    
    
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
                                    <th scope="col">id</th>
                                    <th scope="col">Plato</th>
                                    <th scope="col">Valoracion</th>
                                    <th scope="col">Numero de compras</th>
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
        elementoDiv.innerHTML =`
        <table class="table table-light">
            <thead>
                <tr>
                    <!--------- PRIMERA COLUMNA ------------>
                    <th scope="col">Usuario</th>
                    <th scope="col">Plato</th>
                    <th scope="col">Fecha</th>
                </tr>
            </thead>

            <tbody>
                <tr>
                    <td><!-- INICIO DE HTML MODAL -->

                        <!--------- ELEMENTO BOTON QUE ACTIVA EL MODAL -------->
                        <!-------- data-bs-target="#infoCompra" AQUI INDICAS AL MODAL QUE APUNTAS O OBRAS ------>
                        <a type="button" data-bs-toggle="modal" data-bs-target="#infoCompra">
                            Nazario
                        </a>
                        
                        <!-- -------EL MODAL A INVOCAR------- -->
                        <!------ infoCompra, DEBE COINCIDIR CON EL MODAL QUE APUNTAS ARIBA ------->
                        <div class="modal fade" id="infoCompra" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
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
                                        <p>ID de Compra: <span>1X1XSS7</span></p>
                                        <p>Plato: <span>Arroz Con Pollo</span></p>
                                        <p>Pagado: <span>5.000FCFA</span></p>
                                        <p>Tipo de Pago: <span>Tarjeta de Credito</span></p>
                                        <p>Codigo: <span>4757</span></p>
                                        <p>Fecha: <span>1-10-23</span></p>
                                    </div>
                                    <!------------ LOS BOTONES DE ABAJO DEL MODAL ------------>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-warning" data-bs-dismiss="modal">Imprmir Factura</button>
                                        <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cancelar</button>
                                        <button type="button" class="btn btn-success">Completado</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- FINAL DEL MODAL -->
                    </td>
                    <td>Arroz Con Pollo</td>
                    <td>10-10-2023</td>
                </tr>
                <!-- FIN DE FILA TABLA -->
            </tbody>
        </table>
        <!-- FIN DE LA TABLA -->
        `
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

  