"use strict"

import * as Pmgr from './pmgrapi.js'

/**
 * Librería de cliente para interaccionar con el servidor de PeliManager (pmgr).
 * Prácticas de IU 2021-22
 *
 * Para las prácticas de IU, pon aquí (o en otros js externos incluidos desde tus .htmls) el código
 * necesario para añadir comportamientos a tus páginas.
 *
 * Recomiendo separar el fichero en 2 partes:
 * - parte "página-independiente": funciones que pueden generar cachos de
 *   contenido a partir del modelo, pero que no tienen referencias directas a la página
 * - parte pequeña, al final, de "pegamento": asocia comportamientos a
 *   elementos de la página.
 * Esto tiene la ventaja de que, si cambias tu página, sólo deberías tener
 * que cambiar el pegamento.
 *
 * Fuera de las prácticas, lee la licencia: dice lo que puedes hacer con él:
 * lo que quieras siempre y cuando
 * - no digas que eres el autor original.
 * - no me eches la culpa de haberlo escrito mal.
 *
 * @Author manuel.freire@fdi.ucm.es
 */

//
// PARTE 1:
// Código de comportamiento, que sólo se llama desde consola (para probarlo) o desde la parte 2,
// en respuesta a algún evento.
//

/**
 * 
 * @param {string} sel CSS usado para indicar qué fieldset quieres convertir
 * en estrellitas. Se espera que el fieldset tenga este aspecto:
 *      <label title="Atómico - 5 estrellas">
            <input type="radio" name="rating" value="5" />
        </label>

        <label title="Muy buena - 4 estrellas">
            <input type="radio" name="rating" value="4" />
        </label>

        <label title="Pasable - 3 estrellas">
            <input type="radio" name="rating" value="3" />
        </label>

        <label title="Más bien mala - 2 estrellas">
            <input type="radio" name="rating" value="2" />
        </label>

        <label title="Horrible - 1 estrella">
            <input type="radio" name="rating" value="1" />
        </label>
 */
function stars(sel) {
    const changeClassOnEvents = (ss, s) => {
        s.addEventListener("change", e => {
            // find current index
            const idx = e.target.value;
            // set selected for previous & self, remove for next
            ss.querySelectorAll("label").forEach(label => {
                if (label.children[0].value <= idx) {
                    label.classList.add("selected");
                } else {
                    label.classList.remove("selected");
                }
            });
        });
    };
    const activateStars = (ss) => {
        ss.classList.add("rating");
        ss.querySelectorAll("input").forEach(s =>
            changeClassOnEvents(ss, s));
        let parent = ss;
        while (!parent.matches("form")) {
            parent = parent.parentNode;
        }
        parent.addEventListener("reset", () => {
            ss.querySelectorAll("input").forEach(e => e.checked = false);
            ss.querySelectorAll("label").forEach(e => e.classList.remove("selected"));
        });
    }
    document.querySelectorAll(sel).forEach(activateStars);
}

function createMovieItem(movie) {
    const r2s = r => r > 0 ? Pmgr.Util.fill(r, () => "⭐").join("") : "";
    const ratings = movie.ratings.map(id => Pmgr.resolve(id)).map(r =>
        `<span class="badge bg-${r.user==userId?"primary":"secondary"}">
        ${Pmgr.resolve(r.user).username}: ${r.labels} ${r2s(r.rating)}
        </span>
        `
    ).join("");
    var hid = isAdmin ? "":"hidden" ;
    return `
    <div class="card" data-id="${movie.id}">
    <div class="card-header"">
        <h4 class="mb-0" title="${movie.id}">
            ${movie.name} <small><i>(${movie.year})</i></small>
        </h4>
    </div>

    <div>
        <div class="card-body pcard">
            <div class="row">
                <div class="col-auto">
                    <img class="iuthumb" src="${serverUrl}poster/${movie.imdb}"/>
                </div>
                <div class="col">
                    <div class="row-12">
                        ${movie.director} / ${movie.actors} (${movie.minutes} min.)
                    </div>        
                    <div class="row-12">
                        ${ratings}
                    </div>        
                    <div class="iucontrol movie">
                        <button class="rm ${hid}" data-id="${movie.id}">🗑️</button>
                        <button class="edit ${hid}" data-id="${movie.id}">✏️</button>
                        <button class="rate" data-id="${movie.id}">⭐</button>
                    </div>  
                </div>
            </div>
        </div>
    </div>
    </div>
`;
}

function createGroupItem(group) {
    let allMembers = group.members.map((id) =>
        `<span class="badge bg-secondary">${Pmgr.resolve(id).username}</span>`
    ).join(" ");
    const waitingForGroup = r => r.status.toLowerCase() == Pmgr.RequestStatus.AWAITING_GROUP;
    let allPending = group.requests.map((id) => Pmgr.resolve(id)).map(r =>
        `<span class="badge bg-${waitingForGroup(r) ? "warning" : "info"}"
            title="Esperando aceptación de ${waitingForGroup(r) ? "grupo" : "usuario"}">
            ${Pmgr.resolve(r.user).username}</span>`

    ).join(" ");
    var hid = isAdmin ? " " : "hidden";
    return `
    <div class="card">
    <div class="card-header">
        <h4 class="mb-0" title="${group.id}">
            <b class="pcard">${group.name}</b>
        </h4>
    </div>
    <div class="card-body pcard">
        <div class="row-sm-11">
            <span class="badge bg-primary">${Pmgr.resolve(group.owner).username}</span>
            ${allMembers}
            ${allPending}
        </div>
        <div class="row-sm-1 iucontrol group">
            <button class="rm ${hid}" data-id="${group.id}">🗑️</button>
            <button class="edit" data-id="${group.id}">✏️</button>
            <button class="request" data-id="${group.id}">💌</button>
        </div>
    </div>              
    </div>
    </div>
`;
}


function createUserItem(user) {
    let allGroups = user.groups.map((id) =>
        `<span class="badge bg-secondary">${Pmgr.resolve(id).name}</span>`
    ).join(" ");
    const waitingForGroup = r => r.status.toLowerCase() == Pmgr.RequestStatus.AWAITING_GROUP;
    let allPending = user.requests.map((id) => Pmgr.resolve(id)).map(r =>
        `<span class="badge bg-${waitingForGroup(r) ? "warning" : "info"}"
            title="Esperando aceptación de ${waitingForGroup(r) ? "grupo" : "usuario"}">
            ${Pmgr.resolve(r.group).name}</span>`
    ).join(" ");
    
    var hid = isAdmin ? "":"hidden" ;
    return `
    <div class="card">
    <div class="card-header">
        <h4 class="mb-0" title="${user.id}">
            <b class="pcard">${user.username}</b>
        </h4>
    </div>
    <div class="card-body pcard">
        <div class="row-sm-11">
            ${allGroups}
            ${allPending}
        <div>
        <div class="row-sm-1 iucontrol user">
            <button class="rm ${hid}" data-id="${user.id}">🗑️</button>
            <button class="edit ${hid}" data-id="${user.id}">✏️</button>
        </div>        
    </div>
    </div>
`;
}
function createLogin(){
    let html = " ";
    if(isAdmin){
        html = `
            Admin(${uName}) 
            <a type="button" href="#" onclick="window.location.reload(true);">logout</a>
        `;
    }else{    
        html = `  
            ${uName}
            <a type="button" href="#" onclick="window.location.reload(true);">logout </a>
            `;
    }
    return html;
}
function createButtonGroup(){
    var hid = isAdmin ? "":"hidden" ;
    return `

    <button class="btn btn-light" href="#addGroup" data-bs-toggle="modal">➕ Añadir un Grupo</button>

    `;
}
function createButton(){
    var hid = isAdmin ? "":"hidden" ;
    return `
    <button class="btn btn-light ${hid}" href="#addMovie" data-bs-toggle="modal">➕ Añadir una Pelicula</button>
    `;
}
function createButtonUser(){
    var hid = isAdmin ? "":"hidden" ;
    return `
    <button class="btn btn-light ${hid}" href="#addUser" data-bs-toggle="modal">➕ Añadir un Usuario</button>
    `;
}

/**
 * Usa valores de un formulario para añadir una película
 * @param {Element} formulario para con los valores a subir
 */

function validarPass(){
    if(document.getElementById("pass").value != document.getElementById("pass1").value){
       // document.getElementById("error").classList.add("mostrar");
        alert("Contraseñas incorrecta");
        return false;
    }else{
        //alert("Contraseña correcta, Procesando formulario...!")
        //document.getElementById("error").classList.remove("mostrar");
        //document.getElementById("ok").classList.remove("ocultar");
        
        return true;
    }
}
function nuevoUsuario(formulario){
    const user = new Pmgr.User(-1,
        formulario.querySelector('input[name="username"]').value,
        formulario.querySelector('input[name="pass"]').value,
        "USER", 0, 0, 0);
        Pmgr.addUser(user).then(() => {
            formulario.reset() // limpia el formulario si todo OK
            update();
        });
}

function nuevaPelicula(formulario) {
    const movie = new Pmgr.Movie(-1,
        formulario.querySelector('input[name="imdb"]').value,
        formulario.querySelector('input[name="name"]').value,
        formulario.querySelector('input[name="director"]').value,
        formulario.querySelector('input[name="actors"]').value,
        formulario.querySelector('input[name="year"]').value,
        formulario.querySelector('input[name="minutes"]').value);
    Pmgr.addMovie(movie).then(() => {
        formulario.reset() // limpia el formulario si todo OK
        update();
    });
}

/**
 * Usa valores de un formulario para modificar una película
 * @param {Element} formulario para con los valores a subir
 */
function modificaPelicula(formulario) {
    const movie = new Pmgr.Movie(
        formulario.querySelector('input[name="id"]').value,
        formulario.querySelector('input[name="imdb"]').value,
        formulario.querySelector('input[name="name"]').value,
        formulario.querySelector('input[name="director"]').value,
        formulario.querySelector('input[name="actors"]').value,
        formulario.querySelector('input[name="year"]').value,
        formulario.querySelector('input[name="minutes"]').value)
    Pmgr.setMovie(movie).then(() => {
        formulario.reset() // limpia el formulario si todo OK
        modalEditMovie.hide(); // oculta el formulario
        update();
    }).catch(e => console.log(e));
}

/**
 * Usa valores de un formulario para modificar una grupo
 * @param {Element} formulario para con los valores a subir
 */
 function modificaGrupo(formulario) {
    const group = new Pmgr.Group(
        formulario.querySelector('input[name="id"]').value,
        formulario.querySelector('input[name="name"]').value)
    Pmgr.setGroup(group).then(() => {
        formulario.reset() // limpia el formulario si todo OK
        modalEditGroup.hide(); // oculta el formulario
        update();
    }).catch(e => console.log(e));
}

/**
 * Usa valores de un formulario para modificar una usuario
 * @param {Element} formulario para con los valores a subir
 */
 function modificaUsuario(formulario) {
    const user = new Pmgr.User(
        formulario.querySelector('input[name="id"]').value,
        formulario.querySelector('input[name="username"]').value,
        formulario.querySelector('input[name="pass"]').value,
        "USER", 0, 0, 0);
    Pmgr.setUser(user).then(() => {
        formulario.reset() // limpia el formulario si todo OK
        modalEditUser.hide(); // oculta el formulario
        update();
    }).catch(e => console.log(e));
}

/**
 * Usa valores de un formulario para añadir un rating
 * @param {Element} formulario para con los valores a subir
 */
function nuevoRating(formulario) {
    const rating = new Pmgr.Rating(-1,
        formulario.querySelector('input[name="user"]').value,
        formulario.querySelector('input[name="movie"]').value,
        formulario.querySelector('input[name="rating"]:checked').value,
        formulario.querySelector('input[name="labels"]').value);
    Pmgr.addRating(rating).then(() => {
        formulario.reset() // limpia el formulario si todo OK
        modalRateMovie.hide(); // oculta el formulario
        update();
    }).catch(e => console.log(e));
}

/**
 * Usa valores de un formulario para modificar un rating
 * @param {Element} formulario para con los valores a subir
 */
function modificaRating(formulario) {
    const rating = new Pmgr.Rating(
        formulario.querySelector('input[name="id"]').value,
        formulario.querySelector('input[name="user"]').value,
        formulario.querySelector('input[name="movie"]').value,
        formulario.querySelector('input[name="rating"]:checked').value,
        formulario.querySelector('input[name="labels"]').value);
    Pmgr.setRating(rating).then(() => {
        formulario.reset() // limpia el formulario si todo OK
        modalRateMovie.hide(); // oculta el formulario
        update();
    }).catch(e => console.log(e));
}

/**
 * Usa valores de un formulario para añadir una película
 * @param {Element} formulario para con los valores a subir
 */
function generaPelicula(formulario) {
    const movie = Pmgr.Util.randomMovie();
    for (let [k, v] of Object.entries(movie)) {
        const input = formulario.querySelector(`input[name="${k}"]`);
        if (input) input.value = v;
    }
}

/**
 * Usa valores de un formulario para añadir un grupo
 * @param {Element} formulario para con los valores a subir
 */
 function nuevoGrupo(formulario) {
    const group = new Pmgr.Group(-1,
        formulario.querySelector('input[name="name"]').value,
        userId,
        null,
        null);
    Pmgr.addGroup(group).then(() => {
        formulario.reset() // limpia el formulario si todo OK
        update();
    }).catch(e => console.log(e));;
}
function botonBusqueda(){
    return `
    <input type="search" class="form-control" id="movieSearch" placeholder="Busca por título de Pelicula" aria-describedby="searchMovieLabel">
    <span class="input-group-text" id="searchMovieLabel">🔍</span>
    `;
}

/**
 * En un div que contenga un campo de texto de búsqueda
 * y un select, rellena el select con el resultado de la
 * funcion actualizaElementos (que debe generar options), y hace que
 * cualquier búsqueda filtre los options visibles.
 */
let oldHandler = false;
/**
 * Comportamiento de filtrado dinámico para un select-con-busqueda.
 * 
 * Cada vez que se modifica la búsqueda, se refresca el select para mostrar sólo 
 * aquellos elementos que contienen lo que está escrito en la búsqueda
 * 
 * @param {string} div selector que devuelve el div sobre el que operar
 * @param {Function} actualiza el contenido del select correspondiente
 */
function activaBusquedaDropdown(div, actualiza) {
    let search = document.querySelector(`${div} input[type=search]`);
    let select = document.querySelector(`${div} select`);

    // vacia el select, lo llena con elementos validos
    actualiza(`${div} select`);

    // manejador
    const handler = () => {
        let w = search.value.trim().toLowerCase();
        let items = document.querySelectorAll(`${div} select>option`);

        // filtrado; poner o.style.display = '' muestra, = 'none' oculta
        items.forEach(o =>
            o.style.display = (o.innerText.toLowerCase().indexOf(w) > -1) ? '' : 'none');

        // muestra un array JS con los seleccionados
        console.log("Seleccionados:", select.value);
    };

    // filtrado dinámico
    if (oldHandler) {
        search.removeEventListener('input', handler);
    }
    oldHandler = search.addEventListener('input', handler);
}

//
// Función que refresca toda la interfaz. Debería llamarse tras cada operación
// por ejemplo, Pmgr.addGroup({"name": "nuevoGrupo"}).then(update); // <--
//
function update() {
    const appendTo = (sel, html) =>
        document.querySelector(sel).insertAdjacentHTML("beforeend", html);
    const empty = (sel) => {
        const destino = document.querySelector(sel);
        while (destino.firstChild) {
            destino.removeChild(destino.firstChild);
        }
    }
    try {
        // vaciamos los contenedores
        empty("#movies");
        empty("#groups");
        empty("#users");
        empty("#botonPelicula");
        empty("#botonUsuario");
        empty("#botonGrupo");
        empty("#login-nav");
        empty("#mensajebienvenida");
        empty("#barraBusqueda");
        // y los volvemos a rellenar con su nuevo contenido
        Pmgr.state.movies.forEach(o => appendTo("#movies", createMovieItem(o)));
        Pmgr.state.groups.forEach(o => appendTo("#groups", createGroupItem(o)));
        Pmgr.state.users.forEach(o => appendTo("#users", createUserItem(o)));
        appendTo("#botonPelicula", createButton());        
        appendTo("#botonUsuario", createButtonUser());
        appendTo('#botonGrupo', createButtonGroup());
        appendTo("#login-nav", createLogin());
        appendTo("#barraBusqueda", botonBusqueda());

        document.querySelector("#movieSearch").addEventListener("input", e => {
            const v = e.target.value.toLowerCase();
            document.querySelectorAll("#movies div.card").forEach(c => {
                const m = Pmgr.resolve(c.dataset.id);
                // aquí podrías aplicar muchos más criterios
                const ok = m.name.toLowerCase().indexOf(v) >= 0;
                c.style.display = ok ? '' : 'none';
            });
        });
        
        // y añadimos manejadores para los eventos de los elementos recién creados
        // botones de borrar películas
        document.querySelectorAll(".iucontrol.movie button.rm").forEach(b =>
            b.addEventListener('click', e => {
                const id = e.target.dataset.id; // lee el valor del atributo data-id del boton
                Pmgr.rmMovie(id).then(update);
            }));
        // botones de editar películas
        document.querySelectorAll(".iucontrol.movie button.edit").forEach(b =>
            b.addEventListener('click', e => {
                const id = e.target.dataset.id; // lee el valor del atributo data-id del boton
                const movie = Pmgr.resolve(id);
                const formulario = document.querySelector("#movieEditForm");
                for (let [k, v] of Object.entries(movie)) {
                    // rellenamos el formulario con los valores actuales
                    const input = formulario.querySelector(`input[name="${k}"]`);
                    if (input) input.value = v;
                }

                modalEditMovie.show(); // ya podemos mostrar el formulario
            }));
        // botones de editar grupo
        document.querySelectorAll(".iucontrol.group button.edit").forEach(b =>
            b.addEventListener('click', e => {
                const id = e.target.dataset.id; // lee el valor del atributo data-id del boton
                const group = Pmgr.resolve(id);
                const formulario = document.querySelector("#groupEditForm");
                for (let [k, v] of Object.entries(group)) {
                    // rellenamos el formulario con los valores actuales
                    const input = formulario.querySelector(`input[name="${k}"]`);
                    if (input) input.value = v;
                }

                modalEditGroup.show(); // ya podemos mostrar el formulario
            }));

        //boton de editar usuario
        document.querySelectorAll(".iucontrol.user button.edit").forEach(b =>
            b.addEventListener('click', e => {
                const id = e.target.dataset.id; // lee el valor del atributo data-id del boton
                const user = Pmgr.resolve(id);
                const formulario = document.querySelector("#userEditForm");
                for (let [k, v] of Object.entries(user)) {
                    // rellenamos el formulario con los valores actuales
                    const input = formulario.querySelector(`input[name="${k}"]`);
                    if (input) input.value = v;
                }

                modalEditUser.show(); // ya podemos mostrar el formulario
            }));
        // botones de evaluar películas
        document.querySelectorAll(".iucontrol.movie button.rate").forEach(b =>
            b.addEventListener('click', e => {
                const id = e.target.dataset.id; // lee el valor del atributo data-id del boton
                const formulario = document.querySelector("#movieRateForm");
                const prev = Pmgr.state.ratings.find(r => r.movie == id && r.user == userId);
                if (prev) {
                    // viejo: copia valores
                    formulario.querySelector("input[name=id]").value = prev.id;
                    const input = formulario.querySelector(`input[value="${prev.rating}"]`);
                    if (input) {
                        input.checked;
                    }
                    // lanza un envento para que se pinten las estrellitas correctas
                    // see https://stackoverflow.com/a/2856602/15472
                    if ("createEvent" in document) {
                        const evt = document.createEvent("HTMLEvents");
                        evt.initEvent("change", false, true);
                        input.dispatchEvent(evt);
                    } else {
                        input.fireEvent("onchange");
                    }
                    formulario.querySelector("input[name=labels]").value = prev.labels;
                } else {
                    // nuevo
                    formulario.reset();
                    formulario.querySelector("input[name=id]").value = -1;
                }
                formulario.querySelector("input[name=movie]").value = id;
                formulario.querySelector("input[name=user]").value = userId;
                modalRateMovie.show(); // ya podemos mostrar el formulario
            }));
        // botones de borrar grupos
        document.querySelectorAll(".iucontrol.group button.rm").forEach(b =>
            b.addEventListener('click', e => Pmgr.rmGroup(e.target.dataset.id).then(update)));
        
            // botón request grupo DA PROBLEMAS
        document.querySelectorAll(".iucontrol.group button.request").forEach(b =>
            b.addEventListener('click', e => {

                const id = e.target.dataset.id; // lee el valor del atributo data-id del boton
                const request = new Pmgr.Request(-1,
                userId,
                id,
                "awaiting_group");
                Pmgr.addRequest(request).then(update);
                
            }));

        // botones de borrar usuarios
        document.querySelectorAll(".iucontrol.user button.rm").forEach(b =>
            b.addEventListener('click', e => Pmgr.rmUser(e.target.dataset.id).then(update)));
        //borrar ratings
     //   document.querySelectorAll("").forEach(b => b.addEventListener('click', e => Pmgr.rmRating(e.target.dataset.id).then(update)));

    } catch (e) {
        console.log('Error actualizando', e);
    }

    /* para que siempre muestre los últimos elementos disponibles */
    activaBusquedaDropdown('#dropdownBuscablePelis',
        (select) => {
            empty(select);
            Pmgr.state.movies.forEach(m =>
                appendTo(select, `<option value="${m.id}">${m.name}</option>`));
        }
    );
}

//
// PARTE 2:
// Código de pegamento, ejecutado sólo una vez que la interfaz esté cargada.
//

// modales, para poder abrirlos y cerrarlos desde código JS
const modalEditMovie = new bootstrap.Modal(document.querySelector('#movieEdit'));
const modalRateMovie = new bootstrap.Modal(document.querySelector('#movieRate'));
const modalEditGroup = new bootstrap.Modal(document.querySelector('#groupEdit'));
const modalEditUser  = new bootstrap.Modal(document.querySelector('#userEdit'));

// si lanzas un servidor en local, usa http://localhost:8080/
const serverUrl = "http://gin.fdi.ucm.es/iu/";
//const serverUrl = "http://localhost:8080/";
Pmgr.connect(serverUrl + "api/");

// guarda el ID que usaste para hacer login en userId
let userId = -1;
let isAdmin  = "";
let uName ="";
const login = (username, password) => {
    Pmgr.login(username, password)
        .then(d => {
            console.log("login ok!", d);
            userId = Pmgr.state.users.find(u =>
                u.username == username).id; //buscar id

            uName = username//buscar username
            session = true;
            isAdmin = Pmgr.state.users.find(u => u.username == username).role == "ADMIN,USER";
            update(d);
        })
        .catch(e => {
            console.log(e, `error ${e.status} en login (revisa la URL: ${e.url}, y verifica que está vivo)`);
            console.log(`el servidor dice: "${e.text}"`);
        });
}
//login("Victo_20", "vito1");
//login("g1", "gX82i");
//login("g01", "sebas");
//login("sebas","sebas");
let session="";
function log(formulario){
    let user = formulario.querySelector('input[name="username"]').value;
    let pass = formulario.querySelector('input[name="pass"]').value;
    
    Pmgr.login(user, pass).then(d => {
        console.log("login ok!", d);
        userId = Pmgr.state.users.find( u => u.username == user).id; //busca el usuario

        uName = user; // guardamos el nombre de usuario
            
        isAdmin = Pmgr.state.users.find( u => u.username == user).role == "ADMIN,USER"; // busca el rol del usuario
        session = true;
        formulario.reset();
        update(d);
    })
    .catch(e => {
        console.log(e, `error ${e.status} en login (revisa la URL: ${e.url}, y verifica que está vivo)`);
        console.log(`el servidor dice: "${e.text}"`);
        
    });
}
{
    const f = document.querySelector("#userSession form");

    f.querySelector("button[type='submit']").addEventListener('click', (e) => {
        console.log("enviando inicio de sesión")
        if(f.checkValidity()){
            e.preventDefault();
            log(f);
        }
    });
}
{
    /** 
     * Asocia comportamientos al formulario de añadir películas 
     * en un bloque separado para que las constantes y variables no salgan de aquí, 
     * manteniendo limpio el espacio de nombres del fichero
     */
    const f = document.querySelector("#addMovie form");
    // botón de enviar
    f.querySelector("button[type='submit']").addEventListener('click', (e) => {
        if (f.checkValidity()) {
            e.preventDefault(); // evita que se haga lo normal cuando no hay errores
            nuevaPelicula(f); // añade la pelicula según los campos previamente validados
        }
    });
    // botón de generar datos (sólo para pruebas)
    f.querySelector("button.generar").addEventListener('click',
        (e) => generaPelicula(f)); // aquí no hace falta hacer nada raro con el evento
} {
    /**
     * formulario para modificar películas
     */
    const f = document.querySelector("#movieEditForm");
    // botón de enviar
    document.querySelector("#movieEdit button.edit").addEventListener('click', e => {
        console.log("enviando formulario!");
        if (f.checkValidity()) {
            modificaPelicula(f); // modifica la pelicula según los campos previamente validados
        } else {
            e.preventDefault();
            f.querySelector("button[type=submit]").click(); // fuerza validacion local
        }
    });
}{
    /**
     * formulario para modificar grupos
     */
    const f = document.querySelector("#groupEditForm");
    // botón de enviar
    document.querySelector("#groupEdit button.edit").addEventListener('click', e => {
        console.log("enviando formulario!");
        if (f.checkValidity()) {
            modificaGrupo(f); // modifica el grupo según los campos previamente validados
        } else {
            e.preventDefault();
            f.querySelector("button[type=submit]").click(); // fuerza validacion local
        }
    });
}

{
    /**
     * formulario para modificar usuario
     */
    const f = document.querySelector("#userEditForm");
    // botón de enviar
    document.querySelector("#userEdit button.edit").addEventListener('click', e => {
        console.log("enviando formulario!");
        if (f.checkValidity()) {
            if(validarPass()){
                modificaUsuario(f);
            }
        } else {
            e.preventDefault();
            f.querySelector("button[type=submit]").click(); // fuerza validacion local
        }
    });
}


{
    /**
     * formulario para evaluar películas; usa el mismo modal para añadir y para editar
     */
    const f = document.querySelector("#movieRateForm");
    // botón de enviar
    document.querySelector("#movieRate button.edit").addEventListener('click', e => {
        console.log("enviando formulario!");
        if (f.checkValidity()) {
            if (f.querySelector("input[name=id]").value == -1) {
                nuevoRating(f);
            } else {
                modificaRating(f); // modifica la evaluación según los campos previamente validados
            }
        } else {
            e.preventDefault();
            f.querySelector("button[type=submit]").click(); // fuerza validacion local
        }
    });
    // activa rating con estrellitas
    stars("#movieRateForm .estrellitas");
}

{
    /** 
     * Asocia comportamientos al formulario de añadir grupos
     * en un bloque separado para que las constantes y variables no salgan de aquí, 
     * manteniendo limpio el espacio de nombres del fichero
     */
    const f = document.querySelector("#addGroup form");
    // botón de enviar
    f.querySelector("button[type='submit']").addEventListener('click', (e) => {
        if (f.checkValidity()) {
            e.preventDefault(); // evita que se haga lo normal cuando no hay errores
            nuevoGrupo(f); // añade la pelicula según los campos previamente validados
        }
    });
}
/*Agregar un nuevo usuario*/
{
    const f = document.querySelector("#addUser form");

    f.querySelector("button[type='submit']").addEventListener('click', (e) =>{
        if(f.checkValidity()){
            e.preventDefault();
            if(validarPass()){ //antes de registrarlo comprueba que las contraseñas sean iguales
                nuevoUsuario(f);
            }
        }
    })
}

/*Editar un usuario*/
{
    const f = document.querySelector("#userEdit form");

    f.querySelector("button[type='submit']").addEventListener('click', (e) =>{
        if(f.checkValidity()){
            e.preventDefault();
            if(validarPass()){ //antes de registrarlo comprueba que las contraseñas sean iguales
                modificaUsuario(f);
            }
        }
    })
}
/**
 * búsqueda básica de películas, por título
 */



// cosas que exponemos para poder usarlas desde la consola
window.modalEditMovie = modalEditMovie;
window.modalRateMovie = modalRateMovie;
window.modalEditUser = modalEditUser;
window.update = update;
window.login = login;
window.userId = userId;
window.Pmgr = Pmgr;
window.stars = stars;
window.whoami = () => ({ userId, uName,isAdmin, session});
// ejecuta Pmgr.populate() en una consola para generar datos de prueba en servidor
// ojo - hace *muchas* llamadas a la API (mira su cabecera para más detalles)
// Pmgr.populate();
