//ESTE TEMPLETE CONTIENE EL CODIGO QUE SE INYECTA EN EL HEADER SLIDER DEL INDEX.HTML
//1.IMPOTAR MODULOS NECESARIOS PARA LA CONN A FIREBASE
import componentes from "./exportfile.js";
import {getFirestore, collection, getDocs} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";
import {getStorage, ref, getDownloadURL, listAll} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-storage.js";
const storage = getStorage(componentes.app);
const imgMetaData = getFirestore(componentes.app);

//CAPTURANDO LOS METADATOS: al ser asyncrono, no necesita esperar a que se cargue el DOM
const querySnapshot =  await getDocs(collection(imgMetaData, "description-img"));

// CAPTURAR ELEMENTO PADRE DEL SLIDER
let capturaElementoSlider = document.querySelector('.carousel-inner'); 

// VARIABLES QUE ALAMCENAN LOS METADOS DE LAS IMAGENES
let nombComidaImg; //alamcena el nombre del plato
let describcionComidaImg; //alamcena la descricion del plato
let precioImgComida; //almacena el precion del palto
let pathImg;; //alamacena las rutas fisicas de las imagenes de los platos


// MODELO SLIDER GENERAL
let contenedorSliders =`
    <div class="carousel-item active">
        <img src="./src/img/0.png" class="d-block w-100 img-fluid">
        <div class="carousel-caption d-none d-md-block">
            <h5>PIDE TU CENA AQUI</h5>
            <p>El mejor servicio de pedido de comida a domicilio online</p>
        </div>
    </div>
`

//referenciar la carpeta de imagenes
const listaImagenes = ref(storage);
//cargar la lista de imagenes
listAll(listaImagenes)
.then((res) => {
  //PRIMERA ITERACION - capturar url de las imagenes y los nombres de las misma en el firestore
    res.items.forEach((elementos) => {
        //capturando url
        getDownloadURL(ref(storage,`${elementos.fullPath}`))
            .then((url) => {
                pathImg=url;//ya tenemos la url
                let nombreImgFirestore = elementos.fullPath //este es el nombre de la imagen en firestore, lo vamos a comparar con el nombre en firebase
                    //caputando archivos metados de las img en firebase
                    
                    //SEGUNDA ITERACION: Capturando los metadados
                    //accediendo a cada archivo captura para leer metadatos                  
                    querySnapshot.forEach((doc) => {
                        
                        nombComidaImg = doc.data().name;//nombre capturado
                        precioImgComida =  doc.data().precio;//precio capturado
                        describcionComidaImg = doc.data().descripcion;//descripcion de la img comida captura

                        //TENEMOS TODOS LOS ELEMENTOS NECESARIOS PARA CREAR UN COMPONENTE HTML

                        //comprbando que la img de firestore, corresponda a los metadatos de firebase, los nombres deben ser los mismo
                        if(nombreImgFirestore == doc.data().idName){
                            //inyectado valores en el componente modelo html para el slider
                            let componenteSlider = `
                                <div class="carousel-item">
                                    <img src="${pathImg}" class="d-block w-100 img-fluid">
                                    <div class="carousel-caption d-none d-md-block">
                                        <h5>${nombComidaImg}</h5>
                                        <p>${describcionComidaImg} a tan solo ${precioImgComida}</p>
                                    </div>
                                </div>
                            `
                            //lo combinamos con el componenete principal
                            contenedorSliders+=componenteSlider;
                            capturaElementoSlider.innerHTML=contenedorSliders;
                            return;

                            //verificar la inyeccion
                            // console.log(contenedorSliders)
                            
                        }//
                    })
                
        })
        .catch((error) => {
            console.log(error);
        });
    })
})

   
/* INFORMACION TECNICA
    - Para agregar mas contenedorSliders, solo debemos subir una imagen a la ruta raiz de las imganes en firestore
    - Las imagenes subidas, deben tener metadatos en la colleccion description-img, en donde idname=nombre de la imagene 
    en firestore

*/