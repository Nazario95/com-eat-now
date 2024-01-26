//importar archivo de exportacion principal
import componentes from "../templetes/exportfile.js";
import {getStorage, ref, getDownloadURL, uploadBytes, deleteObject, listAll } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-storage.js";
const storage = getStorage(componentes.app);

// console.log(storage);
// console.log(ref(storage, 'imagenes'));

var num = 1;

document.getElementById('archivo').addEventListener('change', function() {
    var file_path = this.files[0];
    var file_name = this.files[0].name;

    const storageRef = ref(storage, `/imagenes/${file_name}`);
    uploadBytes(storageRef, file_path ).then((snapshot) => {
        console.log(snapshot);
        console.log('Uploaded a blob or file!');
      });

  });

getDownloadURL(ref(storage, '/imagenes/Unidad Paz Y justicia 2.png'))
.then((url) => {
    console.log(url)
    // Or inserted into an <img> element
    // const img = document.getElementById('descarga-imagen');
    // img.setAttribute('src', url);
  })
  .catch((error) => {
    console.log(error);
  });

  document.getElementById('borrar').addEventListener('click', function() {
    const deleteRef = ref(storage, `1.png`);
    deleteObject(deleteRef).then(() => {
       console.log('aechivo eliminado')
      }).catch((error) => {
        console.log(error)
      });

  });

  const listRef = ref(storage);
  listAll(listRef)
  .then((res) => {
    res.prefixes.forEach((folderRef) => {
      console.log(folderRef)
    });
    res.items.forEach((itemRef) => {
        console.log(itemRef)
    });
  }).catch((error) => {
    console.log(error)
  });