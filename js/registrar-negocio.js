//importar archivo de exportacion principal
import componentes from "../templetes/exportfile.js";
import {getFirestore, collection, updateDoc, doc, setDoc, getDocs} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

//importamos funcion que muestra alertas
import { mostrarAlerta } from "./session.js";

//usuario activo
import { usuarioActivo } from "./session.js";

//configuracion de mi app de firebase
const db = getFirestore(componentes.app);

//capturamos los datos del formulario
const datosRegistroformulario = document.querySelector('.registro')

//definimos los valores prederminados de las constantes
let datosDelFormulario= {}
let restaurantes =[]; //almacena todos los restaures capturados del servidor
let crear = true;//si esta en false, no se puede crear un nuevo restaurante

async function leyendoDatosDelServidor(){    
    restaurantes =[]//reseteamos los damos almacenado en el areglo
    try {//capturamos datos los nombres de los restaurantes
         const querySnapshot = await getDocs(collection(db, "lista-restaurantes",));
            querySnapshot.forEach((doc) => {
                //console.log(doc.id);//nombre de la lista de restaurantes registrados
                restaurantes.push(doc.id)                
            });
    } 
    catch (error) { console.log(error);}
}
leyendoDatosDelServidor(); // funcion que carga los datos de firebase 

setTimeout(() => {
    //console.log(usuarioActivo[0])  
    if(usuarioActivo[0]==undefined) {
        //console.log('Iniciar session primero')
        redireccionar('index.html')
    }
}, 2000);

//al hacer clic, se guaran los datos del formualrio dentro del areglo
datosRegistroformulario.addEventListener('submit', (e)=>{  
    crear = true;//se resetea el valor de constrante que premite crear restaurantes
    e.preventDefault()
    //verificamos la extencion del correo
    const verificarExtencionCorreo = datosRegistroformulario[1].value.includes('@negocio.com')
    if(!verificarExtencionCorreo){
        inicializarAlerta('error', 'EL correo debe finalizar con @negocio.com');
        return;
    }
    //almacenamos los datos dentro de un objeto
    const  datosRegistro = {
        admin:usuarioActivo[0],//nombre Usuario Admin del restaurante
        nombre:datosRegistroformulario[0].value,
        correo: datosRegistroformulario[1].value,
        calle:datosRegistroformulario[4].value,
        ciudad:datosRegistroformulario[3].value,
        distrito:datosRegistroformulario[2].value,
        provincia:datosRegistroformulario[3].value,
        clientes_fieles:0,    
        numero_compras:0,    
        valoracion:0,
        telefono:datosRegistroformulario[5].value,
        token:''//los token se crearan al verificar el restaurante para las transacciones
    }
    console.log(datosRegistro)
    //el nombre del restauran, lo pasamo a minuscula ya que es el id a usar en firestore
    let nombreRestaurante = datosRegistro.nombre.toLowerCase();
    datosDelFormulario = datosRegistro;
    //funcion que verifica si existe el restaurente agregado
    verficarExistencia(nombreRestaurante);
   
}); 

function verficarExistencia(nombreRestaurante){
    //si existe, se ejecuta lo siguiente
    restaurantes.forEach(nombre=>{    
        if(nombreRestaurante === nombre){
            // console.log('Ya existe un restaurante con este nombre');
            inicializarAlerta('error', 'Ya existe un restaurante con este nombre');
            crear = false;
        }
    })
    //si no existe se llama a funcion de creacion
    if(crear){      
        crearEspacionrestaurante(nombreRestaurante);
    }
}
//funcion que crea el restaurante
function crearEspacionrestaurante(nombreRestaurante){   
    setDoc(doc(db, 'lista-restaurantes', nombreRestaurante), {});
    // console.log('collecion creada correstamente');
    crear=false;
    //llamando a funcion y completar el guarda del resto de datos 
    completarregistro(nombreRestaurante);
   
}

function completarregistro(nombreRestaurante){
    setTimeout(() => {
        //crear subcoleccion
        crearSubcolecciones(nombreRestaurante);

        //guardando el resto de datos dentro de la collecion del restaurente credo        
        setDoc(doc(db, "lista-restaurantes", nombreRestaurante), datosDelFormulario); 

        inicializarAlerta('success', 'Restaurante registrado correctamente');

        actualizarNivelUsuario()    
        
    }, 3000);
}

// funcion que designa al usuario como admin de un restaurante
function actualizarNivelUsuario(){
     const referenciaUser = doc(db,`public-db/YYKv1vbDdUWhvcEezFyx/users`,`${usuarioActivo[0]}`);

     updateDoc(referenciaUser, {negocio:'Restaurante'});

     setTimeout(() => {
        redireccionar('administracion.html')
    }, 2000);
}

//vualve a cargar los datos del servidor de nuevo para verificar que se hayan guardado correctamente.
async function guardandoDatosColeccion(){
    try {
        leyendoDatosDelServidor();
    } catch (error) {
        console.log(error)
    }
}

//redireccionar a la pagina de administracion del usuario
function redireccionar(pagina){
    window.location.href = `./${pagina}`
}
//funcion que muestra las alertas
function inicializarAlerta(alerType, alertMensaje){
    //funcion importada desde el archivo mensajes-alerta.js
    mostrarAlerta(alerType, alertMensaje);    
}

function crearSubcolecciones(nombreRestaurante){
    const colecciones=['administradores', 'clientes', 'cartas', 'facturas'];
    for(var i=0; i<=3; i++){
        setDoc(doc(db, `lista-restaurantes/${nombreRestaurante}/sub-${nombreRestaurante}`, `${colecciones[i]}`), {});
    }
}
//////////////////////////ACTUALIZACION///////////////////////////////////////////

//esta acutaliza consiste en la verificacion de los datos de entrada del formulario asi como el saneamiento de los datos recibidos.

//VALIDACION DE FORMULARIO - PENDIENTE DE ACUATUALIZACION
// function  verificarDatos(datos){

//     // console.log(datos[1].value)

//     var datosIncorrectos = 0; 
     
//      //convertir el objeto en array y recorer/verificar cada valor de la etiquta
//      //forma moderna de recorer objetos usando for
//      for(let clave in datos){               
//          //validamos cada etiquta con  checkValidity()  
//          if(!datos[clave].checkValidity()){
//             console.log(datos[clave].dataset.titulo);
//              datosIncorrectos+=1;
//              let mensajeError = `error en el campo ${datos[clave].dataset.titulo}`;
//              //si existe error, llamamos a la funcion de emision de errores
//              mostrarAlerta('error', mensajeError);
//          } 
//      }
 
//      if(datosIncorrectos=== 0){
//         // datosDelUsuario.apellidos.value
//           crearUsuario(datos);
//      }
     
//  }

//  function funcionAislada(datos){
//     datos = datos.elements;
//     console.log(datos);

//  }

export {restaurantes}