class GestionarProductos {
    iniciar() {

        fetch( url )

        .then( respuesta => respuesta.json())
        .then( resultado => {

             productos = resultado.productos;
              // Solo quiero mostrar los articulos destacados.
             let productosOfertados = productos.filter( prod => prod.oferta == 1 );
             this.cargarProductos( productosOfertados );

        })
       /*
        //Arreglo de productos
        productos = [

            {
                "id": 1,
                "nombre": "Proteína Gold Standard Whey de 10lb + Shaker",
                "descripcion": "Sabor chocolate o vainilla + S/19.90 llévate un Shaker Perú ó Shaker Dúal",
                "precio": 718,
                "stock": 30,
                "img": "CategoriaProteinaGold.png",
                "oferta": 0
            },
            {
                "id": 2,
                "nombre": "Proteína aislada ISO 100 5lb - Dymatize",
                "descripcion": "Sabor Gourmet Chocolate.Proteína de suero de leche 100% hidrolizado.",
                "precio": 539,
                "stock": 40,
                "img": "CategoriaProteinaElite.png",
                "oferta": 1
            },

            {
                "id": 3,
                "nombre": "Proteína aislada ISO COOL 2lb - Ultimate",
                "descripcion": "Sabor Chocolate.Proteína aislado de suero de leche.",
                "precio": 219,
                "stock": 20,
                "img": "CategoriaProteinaIso.png",
                "oferta": 0
            },
            {
                "id": 4,
                "nombre": "Proteína Matrix 5lb - Syntrax",
                "descripcion": "Sabor Vainilla.Proteína a base de suero de leche",
                "precio": 279,
                "stock": 45,
                "img": "categoriaProteinaShake.png",
                "oferta": 1
            },
            {
                "id": 5,
                "nombre": "Proteína Matrix 2lb - Syntrax",
                "descripcion": "Sabor Simply Vainilla.Proteìna a base de suero.",
                "precio": 139,
                "stock": 25,
                "img": "categoriaProteinaMatrix.png",
                "oferta": 1
            },
            {
                "id": 6,
                "nombre": "Proteína Iso Fit de 5lb - Nutrex",
                "descripcion": "Sabor Galleta.Proteína a base de suero de leche",
                "precio": 400,
                "stock": 15,
                "img": "categoriaProteinaIsofit.png",
                "oferta": 0
            }
        ]*/

      
          this.mostrarCarrito();
          this.actualizarContador();

            
    }

// Funcion encargada de cargar los productos en la pagina
cargarProductos( productos ) { 
        
    const divProductos    = document.querySelector('#productos');
    divProductos.innerHTML = '';

    if( productos.length === 0 ) {

        this.mostrarHeader('No se han encontrado productos para su búsqueda');
        return false;
    } 
    else {          

        productos.forEach( (producto) => {

            const {  id : id_prod,
                nombre : nombre_prod,
                precio: precio_prod,
                img : img_prod,
                cantidad : cant_prod ,
            descripcion : descripcion_prod} = producto;



            let prod = document.createElement('div');
            prod.classList.add('col-12', 'h200', 'border', 'bg-white', 'rounded', 'mt-3', 'd-flex', 'align-items-center', 'p-3', 'flex-row', 'producto');
            prod.setAttribute('id', 'row_'+id_prod);    
           
    
            prod.innerHTML = `      <div class="w-20">
                                        <img src="./assets/img/${img_prod}" alt="" width="150" height="150" >
                                    </div>

                                    <div class="p-3 d-flex flex-column w-60 h-150">
                                        <h3>${nombre_prod}</h3>                                            
                                        <p>${descripcion_prod.substring(0,120)}</p>
                                    </div>

                                    <div class="d-flex align-items-center justify-content-center flex-column w-20 h-150">
                                        <p class="precio">S/. ${precio_prod}</p>
                                        <a href="javascript:addCarrito(${id_prod})" class="btn btn-primary">Comprar Ahora</a>
                                    </div>`;

            divProductos.appendChild( prod );

        } )    
    }
}

// Funcion para buscar un producto
buscar( q ) { 

    let resultado = productos.filter( producto => producto.nombre.toLowerCase().includes( q.toLowerCase() ) || producto.descripcion.toLowerCase().includes( q.toLowerCase() ));      
    this.cargarProductos( resultado );            
}

reinicio()
{

    carrito=[];
    localStorage.setItem(key_carrito, JSON.stringify( carrito ));
    const dt = DateTime.now();
    let date =  dt.toLocaleString();       
    localStorage.setItem(key_actualizacion,date);
    this.actualizarContador();
    this.mostrarCarrito();
    this.mostrar_notificacion("Gracias por su compra !!!.",3000,"bottom");


}

addCart( infoProducto ) {
    
    
   const existe = carrito.some( producto => producto.id === infoProducto.id );

   // si ya existe necesito aumentar el contador
   if(existe) 
   {
      
       const articulos = carrito.map( producto => {

           if(producto.id === infoProducto.id)
           {
               producto.cantidad++;
               return producto;
           }
           else
           {
               return producto;
           }

           carrito = articulos;               

       })

                  // Mostramos un msg con el resultado de la operacion
                  Toastify({
                    text: "Se actualizo la cantidad del producto",
                    duration: 2000,
                    gravity: 'bottom'
    
                }).showToast();
       

   }
   else 
   {
       // Como no existe lo agrego
       carrito.push(infoProducto);

       Toastify({
        text: "Se agrego el producto",
        duration: 3000,
        gravity: 'bottom'

    }).showToast();
      

   }

   this.actualizarCarrito();
}

//Contabilizo las cantidad de productos
contarProductos() { 

    let contadorProductos = 0;

    carrito.forEach(( producto ) => {

        contadorProductos = contadorProductos + parseInt(producto.cantidad);
    })

    return contadorProductos;
}

//Actualizo el carrito
actualizarCarrito() {

    
    this.actualizarContador();

    
    this.mostrarCarrito();

    
    this.guardarCarrito();
}

// Actualizar contador carrito
actualizarContador() { 

    let totalArticulos = this.contarProductos();

    let countCarrito = document.querySelector('#badgeCarrito');

    // Actualizar contador del carrito
    countCarrito.innerHTML = totalArticulos;

}

// Actualizar detalle del carrito
mostrarCarrito() { 
    let detalleCarrito = document.querySelector('#idCarrito');

    detalleCarrito.innerHTML = '';

    let total = 0;
    carrito.forEach( ( producto ) => {


        /*
        const id = producto.id ;
        const nombre = producto.nombre ;
        const precio = producto.precio ;
        const img = producto.img ;
        const cantidad = producto.cantidad ;
        */

       // aplicamos desestructuracion de objeto
        const { id, nombre, precio, img, cantidad  } = producto;

        const row = document.createElement('div');
        row.classList.add('row');
        total += cantidad*parseInt(precio);
        row.innerHTML = `
                    <div class="col-1 d-flex align-items-center justify-content-center p-2 border-bottom">
                    <a href="javascript:eliminar(${id})">
                      <i class="fa-solid fa-circle-xmark"></i>
                    </a>
                   </div>
                    <div class="col-2 d-flex align-items-center p-2 border-bottom">
                        <img src="${img}" width="80"/>
                    </div>

                    <div class="col-4 d-flex align-items-center p-2 border-bottom">
                        ${nombre}
                    </div>

                    <div class="col-2 d-flex align-items-center justify-content-end p-2 border-bottom">
                        S/. ${precio}
                    </div>

                    <div class="col-1 d-flex align-items-center justify-content-end p-2 border-bottom">
                        ${cantidad}
                    </div>

                    <div class="col-1 d-flex align-items-center justify-content-center p-2 border-bottom">
                        <a href="javascript:restar(${id})">
                            <i class="fa-solid fa-square-minus fa-1x"></i>
                        </a>
                    </div>
                    <div class="col-1 d-flex align-items-center justify-content-center p-2 border-bottom">
                        <a href="javascript:suma(${id})">
                            <i class="fa-solid fa-plus fa-1x"></i>
                        </a>
                    </div>
        `;

        
        detalleCarrito.appendChild(row);


    })

    let row = document.createElement('div');
    row.classList.add('row');
    
    row.innerHTML = `   <div class="col-4 d-flex align-items-center justify-content-start p-2 border-bottom">
                            Total a pagar:
                        </div>
                        <div class="col-8 d-flex align-items-center justify-content-end p-2 border-bottom">
                            <b> S/. ${total}</b>
                        </div>`;

    // Agrega el HTML del carrito en el tbody
    detalleCarrito.appendChild(row);


    let blockPay = document.querySelector('#pay');

    if (total === 0){
        blockPay.innerHTML = ''
    }else{
    blockPay.innerHTML = `<button type="button"  onclick="javascript:reiniciar()"  data-bs-dismiss="offcanvas" class="btn btn-outline-primary d-block mx-auto" aria-label="Close">Finalizar Compra</button>`
    }

    
}


// A partir de un id se elimina el producto
eliminarArticulo( id ) { 

    Swal.fire({
        title: '"Esta seguro de eliminar el producto ?"',
        showCancelButton: true,
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, eliminarlo',
        cancelButtonText: `Cancelar`,
      }).then((result) => {
        
        if (result.isConfirmed) 
        {
            carrito = carrito.filter( articulo => articulo.id != id);
            this.actualizarCarrito();

            this.mostrar_notificacion("el articulo fue eliminado del carrito",2000,"bottom");

        }            
      })         
      
}
//RestaCantidaddeArticulo
restarArticulo( id ) { 
    
    carrito = carrito.map( producto => { 

       if(producto.id !== id) return producto  
       if(producto.cantidad >1) producto.cantidad = producto.cantidad - 1
        return producto
    });
    this.actualizarCarrito();
      
}
//SumaCantidaddeArticulo
sumaArticulo( id ) { 
    
    carrito = carrito.map( producto => { 

        if(producto.id !== id) return producto  
        producto.cantidad = producto.cantidad + 1
        return producto
    });
    this.actualizarCarrito();
      
}

// Guardar en Storage
guardarCarrito() { 
   
    localStorage.setItem(key_carrito, JSON.stringify( carrito ));
    const dt = DateTime.now();
    let date =  dt.toLocaleString();       
    localStorage.setItem(key_actualizacion,date);

}

//Muestra un detalle de lo mostrado en pantalla
mostrarHeader( msg ) { 
    const headerProductos = document.querySelector('#headerProductos');
    headerProductos.innerHTML = msg;
}


mostrar_notificacion (texto,duracion,posicion){


                      // Mostramos un msg con el resultado de la operacion
                      Toastify({
                        text: texto,
                        duration: duracion,
                        gravity: posicion
        
                    }).showToast();


}


}