window.addEventListener('DOMContentLoaded', iniciarInyeccion);

function iniciarInyeccion(){
    const head = document.querySelector('head');
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');


    head.innerHTML= `<meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="./config/normalize.css" type="mime">
    <link rel="stylesheet" href="./css/all.min.css">  
    <link rel="stylesheet" href="./css/bootstrap.min.css">
    <link rel="stylesheet" href="./css/style.css">
    <title>just-eat</title>   `;


    header.innerHTML=`
    <div class="nav nav-bar justify-content-center shadow-sm p-3 mb-5">
      <ul class="nav  menu-modo-pc nav-underline">
        <li class="nav-item">
          <a class="nav-link" href="./index.html">Busca tu restaurente favorito</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="./login.html">Iniciar Sesion</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Ayuda</a>
        </li>
      </ul>

    <div class="menu-modo-movil">
      <p >
        <a data-bs-toggle="collapse" href="#collapseExample" role="button"  aria-controls="collapseExample">
        <img src="./src/img/barras.svg" class="menu-hamburguesa-icon ">
        </a>
      </p>
      <div class="collapse" id="collapseExample">
        <div class="">
          <ul class="nav d-block nav-underline">
            <li class="nav-item ">
              <a class="nav-link" href="index.html""><h5>Busca tu restaurente favorito</h5></a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="login.html"><h5>Iniciar Sesion</h5></a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#"><h5>Ayuda</h5></a>
            </li>
          </ul>
        </div>
      </div>
    </div><!-- menu-hamburguesa -->

    </div><!-- . End Nav-bar -->

    <div class="search-foot ">
      <h2 class=" fs-1 fw-bolder">PIDE TU COMIDA A DOMICILIO</h2>
      <form class="d-flex justify-content-center" role="search">
        <input class=" search-bar form-control" type="search" placeholder="Que te GustariaComer">
        <button class="btn btn-outline-danger" type="submit" style="margin-left: 5px;background-color: #c31952; color: white;">Buscar</button>
      </form>
    </div><!--. End, bar-seach-food-->
    <h4>
      <a href="./index.html">Ir a Inicio</a>
    </h4>

    `

    footer.innerHTML=`
    <div class="container text-center">
    <div class="row">
      <div class="col footer-section">
        <h4 >Servicio al Cliente</h4>
        <div>
          <a class="d-block" href="#">Ayuda</a>
          <a class="d-block" href="#">Iniciar sesión</a>
          <a class="d-block"  href="#">Regístrate</a>
          <a class="d-block"  href="#">Contactanos</a>
        </div>
      </div>
      <div class="col footer-section">
        <h4>Tipos de Cocina</h4>
        <div>
          <a class="d-block" href="#">Pizza</a>
          <a class="d-block" href="#">Kebab</a>
          <a class="d-block"  href="#">Hamburguesas</a>
          <a class="d-block"  href="#">Bocadillos</a>
        </div>
      </div>
      <div class="col footer-section">
        <h4>Sobre Nosotros</h4>
        <div>
          <a class="d-block" href="#">Quienes somos</a>
          <a class="d-block" href="#">Regístra tu restaurante</a>
          <a class="d-block"  href="#">Política de Privacidad</a>
          <a class="d-block"  href="#">Términos y Condiciones</a>
        </div>
      </div>
    </div>
  </div>

  <div class="footer-redes-sociales ">
   <div class="d-flex justify-content-center" >
    <p>Siguenos</p>
    <a href="#"><i class="fab fa-facebook"></i></a>
    <a href="#"><i class="fab fa-twitter"></i></a>
    <a href="#"><i class="fab fa-instagram"></i></a>  
   </div>    
  </div>
    `
    
}