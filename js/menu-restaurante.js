import componentes from "../templetes/exportfile.js";
import {getFirestore, collection, getDocs} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

//accedemos a las imagenes
import {getStorage, ref, getDownloadURL} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-storage.js";
const storage = getStorage(componentes.app);

//importamos la configuracion de mi app firebase
const db = getFirestore(componentes.app);

//CAPTURANDO NOMBRE DE RESTAURANTE
    const parrametosUrl = new URLSearchParams(window.location.search);
    let nombreRestaurante  =[];

    for (const [key, value] of parrametosUrl) {
        nombreRestaurante.push(value);
    }
    document.querySelector('.nombre-restaurante').innerHTML=nombreRestaurante[0].toUpperCase();

//CAPTURANDO LA CARTA DEL RESTAURANTE
let componente = '';
let categoriaPlato='';

//AREGLOS PARA ALMACENAR TODOS LOS DATOS DATOS NECESARIOS
let totalCategorias = [];
let totalCartas = [];
let urlImgCollection = [];
let idDelPlato = []

//CAPTURA DE DATOS NECESARIOS

//capturar todas las cartas del restaurante indicado en la URL
const obtenerDatosDelServer = new Promise((resolve, reject) => {
    const cartaRestaurante =  getDocs(collection(db,`lista-restaurantes/${nombreRestaurante[0]}/sub-${nombreRestaurante[0]}/cartas/sub-cartas`))
    if(cartaRestaurante){
        resolve(cartaRestaurante)
    }
})

//Guardando los datos capturados dentro del array
obtenerDatosDelServer
    .then(docs =>{
        //accediendo a cada carta por bucle
        docs.forEach(carta =>{  
            //guardamos las cartas del restaurante 
            totalCartas.push(carta.data());
            idDelPlato.push(carta.id)

            //extraer categoria
            var {categoria} = carta.data();
        
            if(!totalCategorias.includes(categoria)){
                //guardar categoria
                totalCategorias.push(categoria)
            }
        });
        //funcion que crea los div segun numero de categorias
        crearSeccionCategorias(totalCategorias,idDelPlato)
        
    })
    .then(()=>{

        // console.log(totalCategorias);
        // console.log(totalCartas);

        //accediento a las imagenes de cada carta almacenada 
        //alamcenar los nombres en un array, eso servira para comparar las img mas adelante
        let nombreImg = []
        //parche de seguridad
        let Cantidadletras = [];

        totalCartas.forEach(imgCarta =>{
            
            const cargarUrlImg =  new Promise((resolve, reject) => {
                const urlImagen =  getDownloadURL(ref(storage, `${imgCarta.nombreImg}`))

                if(urlImagen){
                    resolve(urlImagen)
                }
            })

            cargarUrlImg
                .then(data =>{
                    urlImgCollection.push(data)
                    //inclumos el nombre de la img en el array
                    nombreImg.push(imgCarta.nombreImg);
                    //almacenamos la catidad de letras de cada nombre
                    Cantidadletras.push(imgCarta.nombre_del_plato.length+2)
                })
                .catch(error => {console.log(error)})
        }) 

        setTimeout(() => {
            imprimirIMGs(urlImgCollection, nombreImg)
        }, 4000);
    })
    


    //funcion para crear los contenedores de las diferentes categorias
    function crearSeccionCategorias(categorias,idDelPlato){
        //contenedor
        let contenedorCategoria = document.getElementById('carta-restaurante');        
        // console.log(categorias.length)
        for(let x=0; x<categorias.length; x++){   
            categoriaPlato +=`
                <div>
                    <h3> CARTA: ${categorias[x].toUpperCase()}S DE ${nombreRestaurante[0].toUpperCase()}</h3>
                    
                    <div class="contenedor-platos-categoria">
                        <div id="${categorias[x]}" class="platos-por-categoria"></div>
                    </div>
                </div>
            `;            
        }
        //inyectando containers de categorias
        contenedorCategoria.innerHTML=categoriaPlato; 
        //funcion para crear las cartas de cata container
        iniciarInyeccion(categorias, totalCartas, idDelPlato);// enviamos los arrays que alamecna las categorias y las cartas
    }

    //es importante enviar los arrays desde las funciones, para asegurar el tiempo de existencia, ya que los valores vienen desde funciones asyncronas de contrario, podriasmos tener errores para codiciones de bajar velocidad de internet
    function iniciarInyeccion(categorias, cartas, idDelPlato){
        // console.log(categorias)
        // console.log(cartas)
        // console.log(idDelPlato)
        
        //accedemos a cada ccategoria
        categorias.forEach(categoria => {
            
            //iteramos en todas las cartas
             for(var i=0;i<cartas.length;i++){
                 // filtramos las cartas segun la catagoria en la que estamos
                if(categoria == cartas[i].categoria){
                    //solo creamos un componente si la categoria coincide
                    componente +=`
                        <div class="shadow-sm p-3 mb-5  bg-body  hover-description componente-carta-restaurante">
                            <img id="${cartas[i].nombreImg}" class="img-fluid" alt="${cartas[i].nombre_del_plato}"> 
                            <div>
                                <span>${cartas[i].nombre_del_plato.toUpperCase()}</span><br>
                                <span><span class="link">Ingredientes</span>: ${cartas[i].que_lleva}</span><br>
                                <span class="precio">A tan solo ${cartas[i].precio}FCFA</span><br>
                                <a href="./describcion-comida-1.html?id=${idDelPlato[i]}&&res=${nombreRestaurante[0]}" class="comprar" target="_blank">
                                    <span class="comprar link">PRUEBALO YA</span>
                                </a> 
                            </div>                                        
                        </div>   
                    `
                }
               
             }
             //accedemos a contenedor de la categoria actual
             let contenedorCategoria = document.getElementById(`${categoria}`);
             //inyectamos las cartas en el contenedor
             contenedorCategoria.innerHTML = componente

            //  console.log(contenedorCategoria);
            //  console.log(componente); 

             componente = '';//vaciamos la variable componentes, para que almacene otras cartas de categoria diferente             
        }) 
               
    }

    function imprimirIMGs(urlsImg, nombreImg){   

        // console.log(Cantidadletras) // esto es para cerrar un problema de seguridad que expone las cuentas de usuario dentro de la pagina 

        if(urlsImg.length == 0){
            console.log('No se encontro nigun elemento disponible')  
        }   
        
        else{
            // console.log(urlsImg)
            // console.log(nombreImg)  

            for(var i=0; i<nombreImg.length; i++){                
               let imgComponent = document.getElementById(`${nombreImg[i]}`) 
               imgComponent.setAttribute("src", `${urlsImg[i]}`);            
            }
        }
    }