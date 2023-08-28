//GENERER IMAGENS DEL CARUCEL DEL HEADER
document.addEventListener('DOMContentLoaded', ()=>{
    //Determina el numero de elementos que debemos crear
    let numeroDeImagenes = 2;
    //caputamos el elmento del DOM sobre el cual agregaremos los hijos
   let capturaElementoSlider = document.querySelector('.carousel-inner'); 
    //Este bucle crear las etiquetas tantas veces como le indiquemos segun el numero de imagenes
   for(let i=0; i< numeroDeImagenes; i++){

    let div =  document.createElement('div');
    div.classList= 'carousel-item';
 
    let img = document.createElement('img');
    img.src = `./src/img/${i+1}.png`;

    let div2 =  document.createElement('div');
    div2.classList= 'carousel-caption d-none d-md-block';

    let textoTituloSlider =  document.createElement('h5');
    textoTituloSlider.textContent = `${i}. ESTE TIUTLO ES DINAMICO`;

    let textoSlider =  document.createElement('p');
    textoSlider.textContent = `${i}. todo el texto relacionado a lo que se vende, es dinacico`;

    div.appendChild(img);
    div2.appendChild(textoTituloSlider);
    div2.appendChild(textoSlider);
    div.appendChild(div2);
    capturaElementoSlider.appendChild(div);
   }
});