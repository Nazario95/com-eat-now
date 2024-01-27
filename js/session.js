//importar archivo de exportacion principal
import componentes from "../templetes/exportfile.js";
//importar conexion a firebase
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
const auth  = getAuth(componentes.app);

//RUTA PRINCIPAL
const rutaPricipal = localStorage.getItem('rutaPrincipal')
// console.log(rutaPricipal)

// CONEXION A FIRESTORE ---------------
import {getFirestore, doc, setDoc, updateDoc, collection, getDocs, getDoc}  from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";
const db = getFirestore(componentes.app);

let usuarioActivo = []

var usuario;

document.addEventListener('DOMContentLoaded',()=>{
    //capurando datos del formulario para iniicar sesion
   const loginData = document.querySelector('.form_container');
   const submitBtn = document.querySelector('.sign-in_btn');   

   //Esto solo se ejecuta cuando registramos un usuario
   if(location.pathname === `${rutaPricipal}create-user.html`){
        //capurando datos del formulario para crear usuario  
        //El formulario  
         const DatosUsuario = document.querySelector('#crear-usuario');
         //el boton crear formulario
        const crearUsuario = document.querySelector('.crear-usuario');
        crearUsuario.addEventListener('click', (e)=>{
            e.preventDefault();
            //objeto que alamcena las etiquetas completas: necesitamos las etiquetas para vericar los campos
            let datosDelUsuario = {
                nombre:DatosUsuario[0],
                apellidos:DatosUsuario[1],
                correo:DatosUsuario[2],
                password:DatosUsuario[3],
                passwordMatch:DatosUsuario[4]
            }  
            //funcion que verifica los campos   
             verificarDatos(datosDelUsuario);
           });
   }
     

    //reaccionando al boton submit 'iniciar sesion'
   submitBtn.addEventListener('click', (e)=>{
       e.preventDefault();      
       //almacenado valores del formulario en variables
       if(location.pathname ===`${rutaPricipal}login.html`){
        var email = loginData[0].value;
        var password = loginData[1].value;
       }else{
         email = loginData[1].value;
         password = loginData[2].value;
        //  console.log(email, password);
       }
       
       //iniicando saneamiento de los datos del formulario       
       if(loginData[1].checkValidity()){
            if(!loginData[2].checkValidity()){
                //llamar funcion de alerta
                mostrarAlerta('error', 'escriba una contraseña')
           }else{
            //llamando a la funcion iniciarsesion            
            iniciarSesion(email, password); 
           }
       }
       if(!loginData[1].checkValidity()){
        //llamar funcion de alerta
        mostrarAlerta( 'error','Correo Erroneo')
       }
   } );
})

//iniciar sesion con correo
function iniciarSesion(email, password){
    //console.log(email, password)
    signInWithEmailAndPassword(auth, email, password)
     .then(() => {
        //redireccionando usuario al index
        window.location.href = "./index.html";
    })
    .catch((error) => {
        const errorCode = error.code;
        //Guardanos los errores en un objeto
        let errotype={
            network:'erro de red',
            invalid:'Correo o Contraseña invalido'
        }
        //convertimos el objeto en areglo
        let errors = Object.keys(errotype);
        //ver codigo de error que envia el server
        //console.log(errorCode);
        //mostrar el error al usuario
        errors.forEach((verEror)=>{
             if(errorCode.indexOf(verEror) !== -1){                
                mostrarAlerta('error', errotype[verEror]);
            }
            
        });
        
     });
}

//verificar se hay sesion activa
onAuthStateChanged(auth, (user) => {   
    //capturando elementos de nombre de usuario
    var textSesionActiva = document.querySelectorAll('.existe-sesion');
    if (user) {
        usuario=user; //usuario - Toda la informacion del usuario
        //Guarndar datos de sesion en el objeto
        usuarioActivo.push(user.email)
        if(location.pathname===`${rutaPricipal}create-user.html` || location.pathname===`${rutaPricipal}login.html`){
            location.pathname ='./';
        }
        let mensajeBienvenida = `Bienvenido ${user.email}`;

        // mostrarAlerta('success', mensajeBienvenida);
        textSesionActiva.forEach((sesionActiva)=>{
            sesionActiva.innerHTML=`
                <div class="dropdown text-center">
                    <button class="btn dropdown-toggle border-0 p-0 fw-bold usuario color_fff" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <img src="./src/svg/person-fill.svg">
                        ${user.email}
                    </button>

                    <ul class="dropdown-menu bg-transparent border border-0 p-0 menu-usuario">
                        <li class="d-flex">
                            <img src="./src/svg/gear-fill.svg" class="px-2">
                            <a class="nav-link m-0 fw-bold" href="./cuenta.html">Mi Cuenta</a>
                        </li>                       
                        <li class="d-flex">
                            <img src="./src/svg/bag-fill.svg" class="px-2">
                            <a class="nav-link m-0 fw-bold" href="./historial-pedidos.html">Historia de pedidos</a>
                        </li>
                        <li class="d-flex">
                            <img src="./src/svg/server.svg" class="px-2">
                            <a class="nav-link m-0 fw-bold" href="./check.html?ir-a=panel">Panel de Administracion</a>
                        </li>
                        <li class="d-flex">
                            <img src="./src/svg/log-out.svg" class="px-2">
                            <a class="nav-link log-out m-0 fw-bold" href="#">CerrarSesion</a>
                        </li>
                    </ul>
                </div>
            `                        
        })        
        ; cerraSesion();          
    }

    // PAGINA: ./CUENTA.HTML
    if(location.pathname === `${rutaPricipal}cuenta.html`){
        console.log('cargando')
        const userData = async ()=>{
            const snapshotUserData= await getDoc(doc(db, 'public-db/YYKv1vbDdUWhvcEezFyx/users/', usuarioActivo[0]))
            if(snapshotUserData){
                // console.log(snapshotUserData.data())
                datosCuenta(snapshotUserData.data());
            }
        } 
        userData();
    }

    else{
        // console.log('No hay una sesion activa')
    }
})


// CERAR SESION
function cerraSesion(){
    const logOut = document.querySelectorAll('.log-out');
    logOut.forEach((logOut)=>{
        logOut.addEventListener('click', ()=>{
            auth.signOut()
                .then(()=>{
                    // console.log('Cerrando Session');
                    if(location.href != './' || localStorage.href != './index.html'){
                        location.href = './';
                        return;
                    }
                    location.reload(true); 
                })
                .catch(error=>{console.log(error)});
        });
    })	
    
}

//CERRAR UNA SESSION ACTIVA
function cerrarSessionInstantaneo(){
    auth.signOut()
    .then(()=>{
        // console.log('Cerrando Session');
        if(location.href != './' || localStorage.href != './index.html'){
            location.href = './';
            return;
        }
        location.reload(true); 
    })
    .catch(error=>{console.log(error)});
}

//VERIFICAR DATOS DEL FORMULARIO
function  verificarDatos(datosDelUsuario){
   var datosIncorrectos = 0;  
    //convertir el objeto en array y recorer/verificar cada valor de la etiquta
    //forma moderna de recorer objetos usando for
    
    for(let clave in datosDelUsuario){               
        //validamos cada etiquta con  checkValidity() 
        // console.log(datosDelUsuario[clave].checkValidity())
        if(!datosDelUsuario[clave].checkValidity()){
            datosIncorrectos+=1;
            let mensajeError = `error en el campo ${datosDelUsuario[clave].dataset.titulo}`;
            //si existe error, llamamos a la funcion de emision de errores
            mostrarAlerta('error', mensajeError);
        } 
    }

    if(datosIncorrectos=== 0){
       // datosDelUsuario.apellidos.value
       guardarDatosUsuario(datosDelUsuario);
        // console.log('correcto')
    }
    
}
//CREAR CUENTA DE INICIO DE SESSION
function crearUsuario(datosDelUsuario){
    // console.log(datosDelUsuario)
    let email = datosDelUsuario.correo.value;
    let password = datosDelUsuario.password.value;
    let passwordMatch = datosDelUsuario.passwordMatch.value;

    if(password != passwordMatch) {
        let mensajeAlerta = 'Las contraseñas no coinciden';
        mostrarAlerta('error', mensajeAlerta);
        return;
    }

    createUserWithEmailAndPassword(auth, email, password)
			.then(() => {
				//console.log(user);
                mostrarAlerta('success', 'Cuenta Creada Correctamente'); 
                setTimeout(() => {
                    cerrarSessionInstantaneo()
                }, 3000);              
			})
			.catch((error) => {
				var errorCode = error.code;
				var errorMessage = error.message;
				console.log(errorCode, errorMessage);  

                let passCorto= 'weak';
                let emailExistente= 'email';
               
                if(`${errorCode}`.includes(passCorto)){
                    let mensajeAlerta = 'La contraseña es demasiado corta';
                    mostrarAlerta('error', mensajeAlerta);
                }
                if(`${errorCode}`.includes(emailExistente)){
                    // console.log(errorCode)
                    let mensajeAlerta = 'Este correo ya fue registrado por otro usuario';
                    mostrarAlerta('error', mensajeAlerta);
                }
               
			});
}


//GUARDAR DATOS DEL USUARIO
function guardarDatosUsuario(datosDelUsuario){ 
    let error = [false]
    let password = datosDelUsuario.password.value;
    let passwordMatch = datosDelUsuario.passwordMatch.value;

    if(password != passwordMatch) {
        let mensajeAlerta = 'Las contraseñas no coinciden';
        mostrarAlerta('error', mensajeAlerta);
        error[0] = true
    }

    const guardarDatos = {
        nombre:datosDelUsuario.nombre.value,
        apellidos:datosDelUsuario.apellidos.value,
        correo:datosDelUsuario.correo.value,
        negocio:'Sin Registro',        
    }

    // console.log(guardarDatos)

    let noExiste = [true];
    const guardandoDatosCompra = async ()=>{

        const verificarExistenciaDeUsuario = await getDocs(collection(db,`public-db/YYKv1vbDdUWhvcEezFyx/users/`))

        verificarExistenciaDeUsuario.forEach((doc)=>{ 
            if(doc.id==guardarDatos.correo){
                noExiste [0]= false;
                console.log('Este correo ya existe')
                mostrarAlerta('error', 'Ya existe una cuenta con este correo');
            }
        })
        // console.log(noExiste[0]);
        if( noExiste[0] == true){
            guardarDatosUsuario()
        }

        function guardarDatosUsuario(){

            // console.log('Contuando...')

            setDoc(doc(db,"public-db/YYKv1vbDdUWhvcEezFyx/users/", `${guardarDatos.correo}`), guardarDatos);  

            mostrarAlerta('success', 'Datos Guardados Correctamente');
            crearUsuario(datosDelUsuario, guardarDatos) 
        }  
    }    
    if(error[0]==false){
        guardandoDatosCompra()
    }
}
//esta funcion se ejecuta solo si estamos en la pagina "CUENTA.HTML" y rellena el formulario de datos de usuario
function datosCuenta(userData){
    //accedemos al formulario
    let perfilUsuario = document.getElementById('datos-usuario')
    // console.log(userData)

    //iteramos sobre el objeto "userData"
    for (const clave in userData) {
    
        for(let i=0;i<7;i++){//iteramos sobre los campos del formulario
            const guardarEnForm =  perfilUsuario[i].getAttribute("id")
            //inyectamos valores en los campos que coniciden
            if(clave == guardarEnForm){
                // console.log(guardarEnForm,'=>',clave)
                perfilUsuario[i].value= userData[clave]
            }
        }
    }
}

//FUNCION BTN ACTUALIZAR EN LA PAGINA "CUENTA.HTML"
if(location.pathname== `${rutaPricipal}cuenta.html`){
    const btnActualizar = document.getElementById('actualizar')
    btnActualizar.addEventListener('click',(e)=>{
        //la sentencia "if" es un parche, debido a que el archivo session  tiene conflicto de id con el archivo registrar.html
        
            e.preventDefault()
        
            btnActualizar.innerHTML= `
                Actualizando
                <img src="./src/img/load.svg" alt="">
            `
            actualizarPerfil()
    
    })
}

function actualizarPerfil(){
    let perfilUsuario = document.getElementById('datos-usuario')
        
    let nuevosDatosDePerfil = {
        nombre:perfilUsuario[0].value,
        apellidos:perfilUsuario[1].value,
        correo:perfilUsuario[2].value,
        provincia:perfilUsuario[3].value,
        ciudad:perfilUsuario[4].value,
        residencia:perfilUsuario[5].value,
        contacto:perfilUsuario[6].value,
    }
    // console.log(nuevosDatosDePerfil)
    // console.log(usuarioActivo[0])

    updateDoc(doc(db,`public-db/YYKv1vbDdUWhvcEezFyx/users`, usuarioActivo[0]),nuevosDatosDePerfil);
    let msg = 'Actualizacion completada';
    mostrarAlerta('success',msg)

    setTimeout(() => {
        location.href = './cuenta.html';
    }, 3000);
    
}

//MENSAJES DE ALERTA
export function mostrarAlerta(alerType, mensajeError){
    //console.log(mensajeError);
    toastr[alerType](mensajeError)
    toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": "toast-top-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "3000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
    }
}
export {usuarioActivo, usuario} ////usuario - Toda la informacion del usuario

