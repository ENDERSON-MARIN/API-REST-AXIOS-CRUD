//ASIGNAMOS LAS VARIABLES NECESARIAS, DOCUMENT, TABLA, FORMULARIO,TITULO,TEMPLATE, FRAGMENT
    const d = document,
      $table = d.querySelector(".crud-table"),
      $form = d.querySelector(".crud-form"),
      $title = d.querySelector(".crud-title"),
      $template = d.getElementById("crud-template").content,
      $fragment = d.createDocumentFragment();

    /* OBTENER TODOS LOS REGISTROS */
/* Se crea una funcion asincrona y mediante el try...catch se gestiona la petición mediante axios */
    const getAll = async () => {
      try {
        let res = await axios.get("http://localhost:5555/productos"),
          json = await res.data;

        console.log(json);//me devuelve la data en un array de objetos
        // por cada elemento se va llenando el template con los elementos de la tabla
        json.forEach(el => {
          $template.querySelector(".id").textContent = el.id;
          $template.querySelector(".nombre").textContent = el.nombre;
          $template.querySelector(".color").textContent = el.color;
          $template.querySelector(".peso").textContent = el.peso;
        //a cada elemento se le crea un data-atributes con los valores 
          $template.querySelector(".edit").dataset.id = el.id;
          $template.querySelector(".edit").dataset.nombre = el.nombre;
          $template.querySelector(".edit").dataset.color = el.color;
          $template.querySelector(".edit").dataset.peso = el.peso;
          $template.querySelector(".delete").dataset.id = el.id;

        //se clona el nodo  template, segundo parámetro en true para que traiga todos los datos
          let $clone = d.importNode($template, true);
        //se le agrega el template clonado al fragmento.
          $fragment.appendChild($clone);
        });
        //se le agrega al cuerpo de la tabla el fragmento.
        $table.querySelector("tbody").appendChild($fragment);
      } catch (err) {
        let message = err.statusText || "Ocurrió un error";
        //manejo del error se inserta debajo de la tabla el error personalizado.
        $table.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`);
      }
    }
    //se cargan los datos obtenidos al cargar el documento
    d.addEventListener("DOMContentLoaded", getAll);

    /* CREAR Y EDITAR EL REGISTRO SELECCIONADO */

    //por delegacion de eventos
    d.addEventListener("submit", async e => {
    //si el evento es generado por el formulario
      if (e.target === $form) {
        //se cancela el comportamiento por defecto
        e.preventDefault();
        //si el elemento id no tiene valor es para crear
        if (!e.target.id.value) {
          //Create - POST
          try {
            let options = {
              method: "POST",
              headers: {
                "Content-type": "application/json; charset=utf-8"
              },
            //se convierte a cadena de texto los datos
              data: JSON.stringify({
                nombre: e.target.nombre.value,
                color: e.target.color.value,
                peso: e.target.peso.value,
              })
            },
              res = await axios("http://localhost:5555/productos", options),
              json = await res.data;

            location.reload();//recarga la página y ver la nueva inserción
          } catch (err) {
            //se crea el error personalizado
            let message = err.statusText || "Ocurrió un error";
            $form.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`);
          }
        //si el elemento id tiene valor es para editar
        } else {
          //Update - PUT
          try {
            let options = {
              method: "PUT",
              headers: {
                "Content-type": "application/json; charset=utf-8"
              },
              data: JSON.stringify({
                nombre: e.target.nombre.value,
                color: e.target.color.value,
                peso: e.target.peso.value,
              })
            },
              res = await axios(`http://localhost:5555/productos/${e.target.id.value}`, options),
              json = await res.data;

            location.reload();
          } catch (err) {
            let message = err.statusText || "Ocurrió un error";
            $form.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`);
          }
        }
      }
    });

    /* ELIMINAR EL REGISTRO SELECCIONADO */
    //delegamos el evento click 
    d.addEventListener("click", async e => {
    //si el click se genera en el boton de editar
      if (e.target.matches(".edit")) {
    //llenamos los campos del formulario con la información
        $title.textContent = "Editar Producto";
        $form.nombre.value = e.target.dataset.nombre;
        $form.color.value = e.target.dataset.color;
        $form.peso.value = e.target.dataset.peso;
        $form.id.value = e.target.dataset.id;
      }
    //si el click se genera en el boton de eliminar
      if (e.target.matches(".delete")) {
        //le mandamos un confirm que devuelve un boolean, true si es aceptar y  false si es cancelar 
        let isDelete = confirm(`¿Estás seguro de eliminar el Producto # ${e.target.dataset.id}?`);

        if (isDelete) {
          //Delete - DELETE
          try {
            let options = {
              method: "DELETE",
              headers: {
                "Content-type": "application/json; charset=utf-8"
              }
            },
              res = await axios(`http://localhost:5555/productos/${e.target.dataset.id}`, options),
              json = await res.data;

            location.reload();
          } catch (err) {
            let message = err.statusText || "Ocurrió un error";
            alert(`Error ${err.status}: ${message}`);
          }
        }
      }
    });
