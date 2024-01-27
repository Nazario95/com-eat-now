//VERIFICAR PAGINA ACTUAL
const paginaActual = location.pathname;
headConstructor();
defauldFunction();

//VALORES PREDETERMINADOS
let menu = {}

let enlaces = {}

let paginaHeaderMovil ='';
let paginaHeaderOrdenador='';




let mostrarBotonBuscar ='';

let htmlCodeMenuMovil ='';

let head;
let header='';
let footer='';
//valor prdeterminado de input buscador
  //imput buscaador, inyecta html que crear el buscador princiapl que esta despues del menu navegacion
  var inputBuscador = '';

// texto predetermiado del buscador princpa;
var txtBuscarComida = {
  txtBuscarRestaurante:'',
  textTitulo: 'PIDE TU COMIDA A DOMICILIO',
  textPlaceHolder: 'Que te gustaria comer'
}

//PRINCIPALES FUNCIONONES
function defauldFunction(){
  headerConstructor();   
}


//----------------------- VALOR FUERA DE LA PAGINA DE ADMINISTRACION---------------------
  if(location.pathname != '/administracion.html'){

    //valores de menu
    menu = {
        opcion1:'Buscar un restaurante',
        opcion2:'Iniciar Sesion',
        opcion3:'Ayuda'
      }

    //enlaces
    enlaces= {      
        link0:"/",
        link1:'login.html',
        link2:'administracion.html',
        link3:'create-user.html',
        link4:'index.html',
        link5:'descipcion-comida.html',
        link6:'#',
        link7:'resultados-busqueda.html'
      }

      //inyectamos el boton modal normal
      mostrarBotonBuscar = `
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
                      <label for="barra-buscador-restaurante" class="form-label">Escribe el nombre aqui</label>
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

      htmlCodeMenuMovil = `  
        <li class="nav-item">
          <a class="nav-link" href="${enlaces.link0+enlaces.link7}"><h5>${menu.opcion1}</h5></a>  
        </li>
        <li class="nav-item existe-sesion">
          <a class="nav-link" href="${enlaces.link0+enlaces.link1}"><h5>${menu.opcion2}</h5></a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="${enlaces.link6}"><h5>${menu.opcion3}</h5></a>
        </li> 
      `
    }

  mostrarBotonBuscar = `
  <li class="nav-item">
    <a class="nav-link" href="${enlaces.link0+enlaces.link1}"><h5>${menu.opcion1}</h5></a>
  </li>
`

if(location.pathname === '/resultados-busqueda.html'){
  txtBuscarComida.txtBuscarRestaurante='';//oculta el boton "$txtBuscarRestaurante" de ariba, en la pagina "resultados-busqueda.html"
  txtBuscarComida.textTitulo = 'ENCUENTRA TU RESTAURANTE FAVORITO';//cambia el "textTitulo" del objeto "txtBuscarComida"
  txtBuscarComida.textPlaceHolder = 'Prueba buscar un restaurante de tu ciudad'; //cambia el texto del textPlaceHolder "txtBuscarComida"
}

//este condicional se ejecuta fuera de la pagina "registrar.html"
if(location.pathname != '/registrar.html'){
//contruye el input de buscador de la fuera "registrar.html"
  inputBuscador = `
  <h2 class=" fs-1 fw-bolder">${txtBuscarComida.textTitulo}</h2>
  <form class="d-flex justify-content-center buscador" role="search">
    <input class=" search-bar form-control" type="search" placeholder="${txtBuscarComida.textPlaceHolder}">
    <button class="btn btn-outline-danger" type="submit" style="margin-left: 5px;background-color: #c31952; color: white;">Buscar</button>
  </form>
`
}
//se ejecuta en la pagina "administracion.html"
if(location.pathname === '/administracion.html'){
  //cambia el texto del buscador  fuera "registrar.html"
    var inputBuscador = ''
  }


  //------------------CONTRUCTOR DEL HEAD -----------------
  function headConstructor(){
    //contenido del head
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

    console.log(head)
  }


  //------------------CONTRUCTOR DEL HEADER -----------------
  function headerConstructor(){
      crearElementosHeader(paginaActual);
      //contenido del header
     
  }

  function headerInyector(){
    header=`
      <!------------ CONTENEDOR PRINCIPAL HEADER --------->   
      <div class="nav nav-bar justify-content-center shadow-sm p-3 mb-5">
    
      <!--------------- CARGAR HTML SOLO PC ------->
        <ul class="nav  menu-modo-pc nav-underline">
    
          <li class="nav-item">
            <div id="modal-login" class="existe-sesion">
              <!-html inyectado por el archivo "login.js", constante "modalLogin" linea "105"->
            </div>
          </li>
          ${paginaHeaderOrdenador}
        </ul>
        <!--------------- FIN CARGAR HTML SOLO PC ------->
    
        <!-------------CARGAR HTML SOLO MOVIL -------------->
      <div class="menu-modo-movil">
        <p >
          <a data-bs-toggle="collapse" href="#collapseExample" role="button"  aria-controls="collapseExample">
          <img src="./src/img/barras.svg" class="menu-hamburguesa-icon ">
          </a>
        </p>
        <div class="collapse" id="collapseExample">
          <div>
            <ul class="nav d-block nav-underline">
              ${paginaHeaderMovil}
            </ul>
          </div>
        </div>
      </div>
      <!-------------FIN CARGAR HTML SOLO MOVIL -------------->
    
      </div><!-- . End Nav-bar -->
      <!-------------HEADER CONTENEDOR PRINCIPAL -------------->
      <h4>
        <a href="./index.html">Ir a Inicio</a>
      </h4>    
    `
    footerConstructor();
  }

  //------------------CONTRUCTOR DEL FOOTER -----------------
  function footerConstructor(){    
    footer=`
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
    `;
  }


  function crearElementosHeader(paginaActual){

    if(paginaActual === '/administracion.html'){
      //elementos del menu administracion
      adminPageConstructor()
    }
  }

  function adminPageConstructor(){
    menu = {
      opcion1 : 'Home',
      opcion2 : 'Historial de compras',
      opcion3 : 'Informacion de perfil',
      opcion4 : 'Crear Carta',
      opcion5 : 'Subir plato'
    }
    //enlaces del menu de administracion
    enlaces = {
      link0:'/administracion.html?selec=',
      link1:'home',
      link2:'perfil',
      link3:'historial',
      link4:'carta',
      link5:'subir-plato'
    }

    paginaHeaderMovil =`
      <li class="nav-item">
        <a class="nav-link" href="${enlaces.link0+enlaces.link1}"><h5>${menu.opcion1}</h5></a>  
      </li>
      <li class="nav-item existe-sesion">
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

    paginaHeaderOrdenador =`
    <li class="nav-item">
    <a class="nav-link" href="${enlaces.link0+enlaces.link3}">${menu.opcion2}</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="${enlaces.link0+enlaces.link4}">${menu.opcion4}</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="${enlaces.link0+enlaces.link5}">${menu.opcion5}</a>
    </li>
    `;

    headerInyector()
  }














/*

  header=`
  <!------------ CONTENEDOR PRINCIPAL HEADER --------->   
  <div class="nav nav-bar justify-content-center shadow-sm p-3 mb-5">

  <!--------------- CARGAR HTML SOLO PC ------->
    <ul class="nav  menu-modo-pc nav-underline">
      
      ${mostrarBotonBuscar}

      <li class="nav-item">
        <div id="modal-login" class="existe-sesion">
          <!-html inyectado por el archivo "login.js", constante "modalLogin" linea "105"->
        </div>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="${enlaces.link6}">${menu.opcion3}</a>
      </li>
      ${htmlCodeAdminPageOnlyPC}
    </ul>
    <!--------------- FIN CARGAR HTML SOLO PC ------->

    <!-------------CARGAR HTML SOLO MOVIL -------------->
  <div class="menu-modo-movil">
    <p >
      <a data-bs-toggle="collapse" href="#collapseExample" role="button"  aria-controls="collapseExample">
      <img src="./src/img/barras.svg" class="menu-hamburguesa-icon ">
      </a>
    </p>
    <div class="collapse" id="collapseExample">
      <div>
        <ul class="nav d-block nav-underline">
          ${htmlCodeMenuMovil}
        </ul>
      </div>
    </div>
  </div>
  <!-------------FIN CARGAR HTML SOLO MOVIL -------------->

  </div><!-- . End Nav-bar -->
  <!-------------HEADER CONTENEDOR PRINCIPAL -------------->

  <div class="search-foot ">
    ${inputBuscador}
  </div><!--. End, bar-seach-food-->
  <h4>
    <a href="./index.html">Ir a Inicio</a>
  </h4>

`
*/