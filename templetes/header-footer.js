
let head = '';
let header = '';
let footer = '';

//elementos del header
let menu = {}
let enlaces = {}

//tipos de header
let headerMovil = '';
let headerPc = ''

//boton buscar del header
let botonBuscarRestaurante = '';
let buscadorComida = `
  <h2 class=" fs-1 fw-bolder">QUE TE GUSTARIA COMER</h2>
  <form class="d-flex justify-content-center buscador" role="search">
    <input class=" search-bar form-control input-comida" type="search" placeholder="Busca tu plato favorito aqui">
    <button id="buscar-comida" class="btn btn-outline-danger buscar-comida" type="submit" style="margin-left: 5px;background-color: #c31952; color: white;">Buscar</button>
  </form>
`;

//guardamos informacion de la ubicacion actual
const paginaActual = location.pathname;

if(paginaActual === '/administracion.html'){
   menu = {
    opcion1 : 'Home',
    opcion2 : 'Informacion de perfil', 
    opcion3 : 'Historial de compras',
    opcion4 : 'Crear Carta',
    opcion5 : 'Subir plato'
   }

   enlaces = {    
    link0:'/administracion.html?selec=',
    link1:'home',
    link2:'perfil',
    link3:'historial',
    link4:'carta',
    link5:'subir-plato'
   }
   //eliminamos el boton de buscar comida cuando esatamos en la seccion de adminstracion
   buscadorComida = '';
   //COMPONENTE HEADER PARA PAGINA DE ADMINISTRACION
   headerMovil =`
    <li class="nav-item">
      <a class="nav-link" href="${enlaces.link0+enlaces.link1}"><h5>${menu.opcion1}</h5></a>  
    </li>
    <li class="nav-item">
      <a class="nav-link" href="${enlaces.link0+enlaces.link2}"><h5>${menu.opcion2}</h5></a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="${enlaces.link0+enlaces.link3}"><h5>${menu.opcion3}</h5></a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="${enlaces.link0+enlaces.link4}"><h5>${menu.opcion4}</h5></a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="${enlaces.link0+enlaces.link5}"><h5>${menu.opcion5}</h5></a>
    </li>
    `;

    headerPc =`
    <li class="nav-item">
    <a class="nav-link" href="${enlaces.link0+enlaces.link1}">${menu.opcion1}</a>
    </li>
    <li class="nav-item">
    <a class="nav-link" href="${enlaces.link0+enlaces.link2}">${menu.opcion2}</a>
    </li>
    <li class="nav-item">
    <a class="nav-link" href="${enlaces.link0+enlaces.link3}">${menu.opcion3}</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="${enlaces.link0+enlaces.link4}">${menu.opcion4}</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="${enlaces.link0+enlaces.link5}">${menu.opcion5}</a>
    </li>
    `;
}

if(paginaActual != '/administracion.html'){
  menu = {
    opcion1 : 'Busca tu restaurante favorito',
    opcion2 : 'Iniciar sesion', 
    opcion3 : 'Ayuda'
   }

   enlaces = {    
    link0:'/',
    link1:'resultados-busqueda.html',
    link2:'login.html',
    link3:'#'
   }

   //codigo html del boton buscar
  botonBuscarRestaurante = `
  <li class="nav-item">                
    <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#exampleModal">
      ${menu.opcion1}
    </button>

    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">Encuentra tu restaurante favorito aqui</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">   
            <form class="">
                <div class="mb-3">
                  <label for="barra-buscador-restaurante" class="form-label">Que restaurante buscas?</label>
                  <input type="text" id="barra-buscador-restaurante" class="form-control buscar-restaurante">
                </div>                   
                <button type="submit" class="btn btn-danger btn-buscar-restaurante">Buscar</button>  
                  <br>    <br>                    
                <div class="resultados-busqueda"></div>   
            </form>
          </div>               
        </div>
      </div>
    </div>
  </li>
  `;
  
//boton modal de buscar comida, solo para header en menu mobil
var modalBuscarRestaurante = `
    <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#exampleModal-2">
      Encuentra tu restaurante aqui
    </button>
  `

//OCULTAMOS LOS BUSCADORES 'BucarComida y Buscar restaurante' del header solo en la pagina indicada
let omitirPaginas = ['/create-user.html', '/registrar.html' , '/cuenta.html', '/historial-pedidos.html']
if(omitirPaginas.includes(paginaActual)){
  buscadorComida = '';
  botonBuscarRestaurante = '';
  modalBuscarRestaurante = ''

  if(paginaActual === '/cuenta.html'){
    buscadorComida = `
      <h2>Datos de cuenta de usuario</h2>
    `;  
  }
}
   headerMovil =`
    <li class="nav-item">
      ${modalBuscarRestaurante}

      <div class="modal fade" id="exampleModal-2" tabindex="-1" aria-labelledby="exampleModalLabe2" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabe2">Encuentra tu restaurante favorito aqui</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">   
              <form class="">
                  <div class="mb-3">
                    <label for="barra-buscador-restaurante-2" class="form-label">Escribe el nombre aqui</label>
                    <input type="text" id="barra-buscador-restaurante-2" class="form-control buscar-restaurante-movil">
                  </div>                   
                  <button type="submit" class="btn btn-danger btn-buscar-restaurante2">Buscar</button>  
                    <br>    <br>                    
                  <div class="resultados-busqueda-movil">
                    
                  </div>   
              </form>
            </div>               
          </div>
        </div>
      </div>

   </li>

   <li class="nav-item existe-sesion">
     <a class="nav-link" href="${enlaces.link0+enlaces.link2}"><h5 class="txt-color-phone-mode">${menu.opcion2}</h5></a>
   </li>

    <li class="d-flex justify-content-center text-light fw-bold">
      Mi carrito
      <button type="button" class="btn  position-relative d-flex" data-bs-toggle="modal" data-bs-target="#modal-carrito">        
        <img src="./src/svg/cart-fill-w.svg" alt="">
        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger cantidad-carrito-movil">0</span>
      </button>
    </li>

   <li class="nav-item">
     <a class="nav-link" href="${enlaces.link0+enlaces.link3}"><h5 class="txt-color-phone-mode">${menu.opcion3}</h5></a>
   </li>
   `;

   headerPc =`
   
   <li class="nav-item">
    <div id="modal-login" class="existe-sesion">
      <!-html inyectado por el archivo "login.js", constante "modalLogin" linea "105"->
    </div>
  </li>

  <button type="button" class="btn  position-relative" data-bs-toggle="modal" data-bs-target="#modal-carrito">
    <img src="./src/svg/cart-fill.svg" alt="">
    <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger cantidad-carrito">0</span>
  </button>

   <li class="nav-item">
    <a class="nav-link px-4 " href="${enlaces.link3}">${menu.opcion3}</a>
   </li>
   `;
}


header=`
  <!------------ CONTENEDOR PRINCIPAL HEADER --------->   
  <div class="nav nav-bar justify-content-center shadow-sm p-3 mb-5">

    <!--------------- CARGAR HTML SOLO PC ------->
    <ul class="nav  menu-modo-pc nav-underline">
      ${botonBuscarRestaurante}
      ${headerPc}

    </ul>


    <!--------------- FIN CARGAR HTML SOLO PC ------->

    <!-------------CARGAR HTML SOLO MOVIL -------------->
    <div class="menu-modo-movil">
    <p>
      <a data-bs-toggle="collapse" href="#collapseExample" role="button"  aria-controls="collapseExample">
      <img src="./src/img/barras.svg" class="menu-hamburguesa-icon ">
      </a>
    </p>
    <div class="collapse" id="collapseExample">
      <div>
        <ul class="nav d-block nav-underline">

        ${headerMovil}

        </ul>
      </div>
    </div>
  </div>
  <!-------------FIN CARGAR HTML SOLO MOVIL -------------->

</div>
<!-------------HEADER CONTENEDOR PRINCIPAL -------------->
<div class="search-foot ">
  ${buscadorComida}
</div><!--. End, bar-seach-food-->
<h4>
  <a href="./index.html">Ir a Inicio</a>
</h4>
`



head= `<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="./config/normalize.css" type="mime">
<link rel="stylesheet" href="./css/all.min.css">  
<link rel="stylesheet" href="./css/bootstrap.min.css">
<link rel="stylesheet" href="./css/style.css">
<script src="./css/jquery.min.js"></script>
<link rel="stylesheet" href="./css/toastr.min.css">
<link rel="stylesheet" href="./css/menu-buton-enline.css">
<script src="./css/toastr.min.js"></script>
<title>just-eat</title>   
`;


// SECCION DEL FOOTER ----------------------
let enlacesFooter = `
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
`

// definiiendo seccion en donde se mostraran los enlaces
const paginas = ['busqueda', 'describcion', 'pago', 'cuenta', 'historial-pedidos'];
paginas.forEach((pagina)=>{
  if(paginaActual.includes(pagina)){
    enlacesFooter = '';
  }
})


footer=`
  
    ${enlacesFooter}
    <div class="footer-redes-sociales ">
    <div class="d-flex justify-content-center" >
    <p>Siguenos</p>
    <a href="#"><i class="fab fa-facebook"></i></a>
    <a href="#"><i class="fab fa-twitter"></i></a>
    <a href="#"><i class="fab fa-instagram"></i></a>  
    </div>    
  </div>
`;

export {head, header, footer}