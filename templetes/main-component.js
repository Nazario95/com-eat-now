//IMPORTANDO UBICACIONES DE LA DB-JSON
import tablaCiudades from "../data-source/ubicaciones.json" assert{type:"json"}
document.addEventListener('DOMContentLoaded', componentesMenus);
function componentesMenus(){
    //CREANDO DATOS DEL COMPONENTE
    const datosComponentes = [{
        classContainer:` tarjeta componente-tarjeta`,
        clssDescribcionTarjeta:`describcion-tarjeta`,
        imgSrc: `./src/img/comida-fang/`,
        tituloComida:['Comida Fang', 'Comida Bubi', 'Comida Anobonesa', 'Comisa Senegalesa'],
        nombreArchivoImagen:['1.png','2.png','3.png','4.png']        
        },
        {
            classContainer:`tarjeta componente-tarjeta`,
            clssDescribcionTarjeta:``,
            imgSrc: `./src/img/cadena-restaurantes/`,
            nombreRestaurante:['Galambo', 'Pizza Place', 'Restaurente hilton', 'La Bola'],
            nombreArchivoImagen:['1.png','2.png','3.png','4.png']        
        },

    ];  
    //CAPTURANDO CONTENEDOR PADRE A INYECTAR EN EL DOM
    const componentepadre = document.querySelector('#foot-c-father'); 
    const restautantesContainer = document.querySelector('#cadena-de-restaurantes'); 
    const containerRestaurantes = document.querySelector('.ubicacion-ciudad');
    //DETERMINANDO NUMERO DE VECES QUE SE EJECUTARA EL BUCLU DE INYECCION
    let numeroComponenetes = datosComponentes[0].nombreArchivoImagen.length;    
    //INYECTANDO COMPONENTES EN EL DOM
    for(let i=0;i<numeroComponenetes; i++){
        //CREANDO COMPONENTES
        let divContainer = document.createElement('div');
        divContainer.classList= `${datosComponentes[0].classContainer}`;

        let imgBg = document.createElement('img');
        imgBg.src= `${datosComponentes[0].imgSrc}${datosComponentes[0].nombreArchivoImagen[i]}`;

        let txtContainer = document.createElement('div');
        txtContainer.classList= `${datosComponentes[0].clssDescribcionTarjeta}`;

        let tituloComida = document.createElement('h5');
        tituloComida.textContent= `${datosComponentes[0].tituloComida[i]}`;

        //EMPAQUETANDO COMPONENTES
        txtContainer.appendChild(tituloComida);
        divContainer.appendChild(imgBg);
        divContainer.appendChild(txtContainer);
        componentepadre.appendChild(divContainer);
    }
    //INYECTANDO COMPONENTES DE RESTAURANTES EN EL DOM
    for(let i=0;i<numeroComponenetes; i++){
        //CREANDO COMPONENTES
        let divContainer = document.createElement('div');
        divContainer.classList= `${datosComponentes[1].classContainer}`;

        let imgBg = document.createElement('img');
        imgBg.src= `${datosComponentes[1].imgSrc}${datosComponentes[0].nombreArchivoImagen[i]}`;

        let txtContainer = document.createElement('div');
        txtContainer.classList= `${datosComponentes[1].clssDescribcionTarjeta}`;

        let tituloComida = document.createElement('h5');
        tituloComida.textContent= `${datosComponentes[1].nombreRestaurante[i]}`;

        //EMPAQUETANDO COMPONENTES
        txtContainer.appendChild(tituloComida);
        divContainer.appendChild(imgBg);
        divContainer.appendChild(txtContainer);
        restautantesContainer.appendChild(divContainer);
    }

}