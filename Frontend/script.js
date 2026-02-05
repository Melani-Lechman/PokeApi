/**
 * Este script consume la API de Spring Boot en localhost:8080.
 * Asegúrate de que tu backend de Spring Boot esté corriendo
 */

// --- URLs de la API ---
const API_BASE_URL = "http://localhost:8080/api";
const API_URL_ENTRENADORES = `${API_BASE_URL}/entrenadores`;
const API_URL_EQUIPOS = `${API_BASE_URL}/equipos`;
const API_URL_POKEMON = `${API_BASE_URL}/pokemon`;
const API_URL_ENCUENTROS = `${API_BASE_URL}/encuentros`;
const POKEAPI_URL = 'https://pokeapi.co/api/v2/pokemon/';

// --- Referencias al DOM (Generales) ---
const sections = document.querySelectorAll('.app-section');
const pokemonSelectModal = document.getElementById('pokemonSelectModal');
const pokemonSelectModalList = document.getElementById('pokemonSelectModalList');
const cancelarSelectPokemonBtn = document.querySelector('#pokemonSelectModal button.bg-gray-400');

// --- Referencias al DOM (Entrenadores) ---
const formEntrenador = document.getElementById('form-entrenador');
const listaEntrenadores = document.getElementById('lista-entrenadores');
const entrenadorIdInput = document.getElementById('entrenador-id');
const entrenadorNombreInput = document.getElementById('entrenador-nombre');
const entrenadorCiudadInput = document.getElementById('entrenador-ciudad');
const entrenadorTitle = document.getElementById('form-entrenador-title');
const entrenadorCancelBtn = document.querySelector('#form-entrenador button[type="button"]');
let editandoEntrenador = false;

// --- Referencias al DOM (Equipos) ---
const formEquipo = document.getElementById('form-equipo');
const listaEquipos = document.getElementById('lista-equipos');
const equipoIdInput = document.getElementById('equipo-id');
const equipoNombreInput = document.getElementById('equipo-nombre');
const equipoEntrenadorSelect = document.getElementById('equipo-entrenador-id');
const equipoTitle = document.getElementById('form-equipo-title');
const equipoCancelBtn = document.querySelector('#form-equipo button[type="button"]');
let editandoEquipo = false;
let entrenadoresMap = new Map();

// --- Referencias al DOM (Capturar) ---
const btnBuscarPokemon = document.querySelector('#capturar button.bg-blue-600');
const searchInput = document.getElementById('pokemon-search');
const searchResultDiv = document.getElementById('search-result');
const listaPokemonCapturados = document.getElementById('lista-pokemon-capturados');
let cachePokemonBuscado = null; // Guarda el último Pkmn buscado (DE POKEAPI)
let equiposMap = new Map(); // Caché para nombres de equipos

// --- Referencias al DOM (Encuentros) ---
const btnSimularEncuentro = document.querySelector('#encuentros button.bg-red-600');
const pk1Selection = document.getElementById('pk1-selection');
const pk2Selection = document.getElementById('pk2-selection');
const listaEncuentros = document.getElementById('lista-encuentros');
let seleccionActual = null; // 'pk1' o 'pk2'
let pk1 = null; // Pokémon simple de NUESTRA DB
let pk2 = null; // Pokémon simple de NUESTRA DB
let pokemonMap = new Map(); // Caché para datos de Pokémon (de NUESTRA DB)

// --- NAVEGACIÓN ---
function showSection(sectionId) {
    sections.forEach(section => section.classList.add('hidden'));
    const sectionElement = document.getElementById(sectionId);
    if (sectionElement) {
        sectionElement.classList.remove('hidden');
    }
    
    // Recargar datos relevantes para la sección
    if (sectionId === 'entrenadores') loadEntrenadores();
    if (sectionId === 'equipos') loadEquipos();
    if (sectionId === 'capturar') loadPokemonCapturados(); // Carga Pkmn y Equipos (para el form)
    if (sectionId === 'encuentros') loadEncuentros(); // Carga Pkmn y Encuentros
}

// --- INICIALIZACIÓN ---
window.onload = () => {
    // 1. Cargar la primera sección
    showSection('entrenadores');
    
    // 2. Asignar eventos a formularios
    formEntrenador.addEventListener("submit", handleSubmitEntrenador);
    if(entrenadorCancelBtn) entrenadorCancelBtn.addEventListener("click", resetFormEntrenador);
    
    formEquipo.addEventListener("submit", handleSubmitEquipo);
    if(equipoCancelBtn) equipoCancelBtn.addEventListener("click", resetFormEquipo);

    // 3. Asignar eventos a botones
    if(btnBuscarPokemon) btnBuscarPokemon.addEventListener("click", buscarPokemon);
    if(cancelarSelectPokemonBtn) cancelarSelectPokemonBtn.addEventListener("click", closePokemonSelectModal);
    if(btnSimularEncuentro) btnSimularEncuentro.addEventListener("click", guardarEncuentro);

    pk1Selection.querySelector('button').addEventListener('click', () => abrirModalSeleccion('pk1'));
    pk2Selection.querySelector('button').addEventListener('click', () => abrirModalSeleccion('pk2'));


    // 4. Cerrar modal al hacer clic fuera
    window.addEventListener("click", (event) => {
        if (event.target == pokemonSelectModal) closePokemonSelectModal();
    });
};

function getTipoClase(tipoString) {
    if (!tipoString) return 'type-normal';
    return `type-${tipoString.toLowerCase()}`;
}

function getTipoSpan(tipoString) {
    if (!tipoString) return '';
    const typeName = tipoString.charAt(0).toUpperCase() + tipoString.slice(1);
    return `<span class="px-2 py-1 text-xs font-semibold rounded-full ${getTipoClase(tipoString)}">${typeName}</span>`;
}


// -------------------------------------
// --- ENTRENADORES (CRUD 1) ---
// -------------------------------------

function loadEntrenadores() {
    listaEntrenadores.innerHTML = '<p>Cargando entrenadores...</p>';
    fetch(API_URL_ENTRENADORES)
        .then(res => {
            if (!res.ok) throw new Error('Error en la respuesta del servidor');
            return res.json();
        })
        .then(data => {
            entrenadoresMap.clear(); 
            data.forEach(e => entrenadoresMap.set(e.id, e.nombre));
            mostrarEntrenadores(data);
        })
        .catch(err => {
            console.error("Error cargando entrenadores:", err);
            listaEntrenadores.innerHTML = `<p class="text-red-500">Error al cargar los entrenadores. Verifica que el servidor esté corriendo en ${API_URL_ENTRENADORES}</p>`;
        });
}

function mostrarEntrenadores(entrenadores) {
    listaEntrenadores.innerHTML = "";
    if (!entrenadores || entrenadores.length === 0) {
        listaEntrenadores.innerHTML = '<p class="text-gray-500">No hay entrenadores registrados.</p>';
        return;
    }
    
    entrenadores.forEach(e => {
        const div = document.createElement("div");
        div.className = "flex justify-between items-center p-3 bg-gray-50 rounded-lg border";
        div.innerHTML = `
            <div>
                <span class="font-semibold">${e.nombre}</span>
                <span class="text-sm text-gray-600">(${e.ciudad})</span>
            </div>
            <div class="flex gap-2">
                <button class="btn-editar bg-yellow-500 text-white px-3 py-1 rounded-md text-sm hover:bg-yellow-600" data-id="${e.id}">Editar</button>
                <button class="btn-eliminar bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700" data-id="${e.id}">Eliminar</button>
            </div>
        `;
        listaEntrenadores.appendChild(div);
    });
    
    agregarEventListenersEntrenador();
}

function agregarEventListenersEntrenador() {
    document.querySelectorAll('#lista-entrenadores .btn-editar').forEach(btn => {
        btn.addEventListener('click', function() {
            handleEditEntrenador(this.getAttribute('data-id'));
        });
    });
    document.querySelectorAll('#lista-entrenadores .btn-eliminar').forEach(btn => {
        btn.addEventListener('click', function() {
            handleDeleteEntrenador(this.getAttribute('data-id'));
        });
    });
}

function handleSubmitEntrenador(e) {
    e.preventDefault();
    const data = {
        nombre: entrenadorNombreInput.value.trim(),
        ciudad: entrenadorCiudadInput.value.trim()
    };
    
    if (!data.nombre || !data.ciudad) {
        alert("Por favor, complete todos los campos");
        return;
    }

    const id = entrenadorIdInput.value;
    const method = (editandoEntrenador && id) ? "PUT" : "POST";
    const url = (editandoEntrenador && id) ? `${API_URL_ENTRENADORES}/${id}` : API_URL_ENTRENADORES;

    fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    .then(res => {
        if (!res.ok) throw new Error(`Error al ${method === 'POST' ? 'crear' : 'actualizar'}`);
        return res.json();
    })
    .then(() => {
        alert(`Entrenador ${method === 'POST' ? 'creado' : 'actualizado'} exitosamente`);
        resetFormEntrenador();
        loadEntrenadores();
    })
    .catch(err => {
        console.error("Error:", err);
        alert(err.message);
    });
}

function handleEditEntrenador(id) {
    fetch(`${API_URL_ENTRENADORES}/${id}`)
        .then(res => {
            if (!res.ok) throw new Error('Entrenador no encontrado');
            return res.json();
        })
        .then(data => {
            entrenadorIdInput.value = data.id || '';
            entrenadorNombreInput.value = data.nombre || '';
            entrenadorCiudadInput.value = data.ciudad || '';
            editandoEntrenador = true;
            entrenadorTitle.textContent = "Editando Entrenador";
            entrenadorNombreInput.focus();
        })
        .catch(err => {
            console.error("Error al cargar entrenador:", err);
            alert("Error al cargar los datos: " + err.message);
        });
}

function handleDeleteEntrenador(id) {
    if (confirm("¿Está seguro que desea eliminar este entrenador?")) {
        fetch(`${API_URL_ENTRENADORES}/${id}`, { 
            method: "DELETE" 
        })
        .then(res => {
            if (!res.ok) throw new Error('Error al eliminar');
            alert("Entrenador eliminado exitosamente");
            loadEntrenadores();
        })
        .catch(err => {
            console.error("Error:", err);
            alert("Error al eliminar el entrenador");
        });
    }
}

function resetFormEntrenador() {
    formEntrenador.reset();
    entrenadorIdInput.value = "";
    editandoEntrenador = false;
    entrenadorTitle.textContent = "Nuevo Entrenador";
}

// -------------------------------------
// --- EQUIPOS (CRUD 2) ---
// -------------------------------------

function loadEntrenadoresOptions() {
    fetch(API_URL_ENTRENADORES)
        .then(res => res.json())
        .then(data => {
            entrenadoresMap.clear(); 
            let optionsHtml = '<option value="">-- Selecciona Entrenador --</option>';
            data.forEach(e => {
                entrenadoresMap.set(e.id, e.nombre);
                optionsHtml += `<option value="${e.id}">${e.nombre}</option>`;
            });
            equipoEntrenadorSelect.innerHTML = optionsHtml;
        })
        .catch(err => {
            console.error("Error cargando opciones de entrenador:", err);
            equipoEntrenadorSelect.innerHTML = '<option value="">Error al cargar</option>';
        });
}

function loadEquipos() {
    loadEntrenadoresOptions(); 
    
    listaEquipos.innerHTML = '<p>Cargando equipos...</p>';
    fetch(API_URL_EQUIPOS)
        .then(res => {
            if (!res.ok) throw new Error('Error en la respuesta del servidor');
            return res.json();
        })
        .then(data => {
            equiposMap.clear();
            data.forEach(e => equiposMap.set(e.id, e.nombre));
            mostrarEquipos(data);
        })
        .catch(err => {
            console.error("Error cargando equipos:", err);
            listaEquipos.innerHTML = `<p class="text-red-500">Error al cargar los equipos. Verifica el servidor en ${API_URL_EQUIPOS}</p>`;
        });
}

function mostrarEquipos(equipos) {
    listaEquipos.innerHTML = "";
    if (!equipos || equipos.length === 0) {
        listaEquipos.innerHTML = '<p class="text-gray-500">No hay equipos creados.</p>';
        return;
    }
    
    equipos.forEach(eq => {
        const div = document.createElement("div");
        div.className = "flex justify-between items-center p-3 bg-gray-50 rounded-lg border";
        const nombreEntrenador = entrenadoresMap.get(eq.entrenadorId) || '???';
        div.innerHTML = `
            <div>
                <span class="font-semibold">${eq.nombre}</span>
                <span class="text-sm text-gray-600">(Entrenador: ${nombreEntrenador})</span>
            </div>
            <div class="flex gap-2">
                <button class="btn-editar bg-yellow-500 text-white px-3 py-1 rounded-md text-sm hover:bg-yellow-600" data-id="${eq.id}">Editar</button>
                <button class="btn-eliminar bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700" data-id="${eq.id}">Eliminar</button>
            </div>
        `;
        listaEquipos.appendChild(div);
    });
    
    agregarEventListenersEquipo();
}

function agregarEventListenersEquipo() {
    document.querySelectorAll('#lista-equipos .btn-editar').forEach(btn => {
        btn.addEventListener('click', function() {
            handleEditEquipo(this.getAttribute('data-id'));
        });
    });
    document.querySelectorAll('#lista-equipos .btn-eliminar').forEach(btn => {
        btn.addEventListener('click', function() {
            handleDeleteEquipo(this.getAttribute('data-id'));
        });
    });
}

function handleSubmitEquipo(e) {
    e.preventDefault();
    const data = {
        nombre: equipoNombreInput.value.trim(),
        entrenadorId: parseInt(equipoEntrenadorSelect.value)
    };
    
    if (!data.nombre || !data.entrenadorId) {
        alert("Por favor, complete todos los campos");
        return;
    }

    const id = equipoIdInput.value;
    const method = (editandoEquipo && id) ? "PUT" : "POST";
    const url = (editandoEquipo && id) ? `${API_URL_EQUIPOS}/${id}` : API_URL_EQUIPOS;

    fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    .then(res => {
        if (!res.ok) throw new Error(`Error al ${method === 'POST' ? 'crear' : 'actualizar'} equipo`);
        return res.json();
    })
    .then(() => {
        alert(`Equipo ${method === 'POST' ? 'creado' : 'actualizado'} exitosamente`);
        resetFormEquipo();
        loadEquipos();
    })
    .catch(err => {
        console.error("Error:", err);
        alert(err.message);
    });
}

function handleEditEquipo(id) {
    fetch(`${API_URL_EQUIPOS}/${id}`)
        .then(res => {
            if (!res.ok) throw new Error('Equipo no encontrado');
            return res.json();
        })
        .then(data => {
            equipoIdInput.value = data.id || '';
            equipoNombreInput.value = data.nombre || '';
            equipoEntrenadorSelect.value = data.entrenadorId || '';
            editandoEquipo = true;
            equipoTitle.textContent = "Editando Equipo";
            equipoNombreInput.focus();
        })
        .catch(err => {
            console.error("Error al cargar equipo:", err);
            alert("Error al cargar los datos: " + err.message);
        });
}

function handleDeleteEquipo(id) {
    if (confirm("¿Está seguro que desea eliminar este equipo?")) {
        fetch(`${API_URL_EQUIPOS}/${id}`, { 
            method: "DELETE" 
        })
        .then(res => {
            if (!res.ok) throw new Error('Error al eliminar');
            alert("Equipo eliminado exitosamente");
            loadEquipos();
        })
        .catch(err => {
            console.error("Error:", err);
            alert("Error al eliminar el equipo");
        });
    }
}

function resetFormEquipo() {
    formEquipo.reset();
    equipoIdInput.value = "";
    editandoEquipo = false;
    equipoTitle.textContent = "Nuevo Equipo";
}


// -------------------------------------
// --- POKÉMON (CRUD 3) ---
// -------------------------------------

function buscarPokemon() {
    const query = searchInput.value.toLowerCase().trim();
    if (!query) return;
    
    searchResultDiv.innerHTML = '<p>Buscando...</p>';
    cachePokemonBuscado = null;
    
    fetch(`${POKEAPI_URL}${query}`)
        .then(res => {
            if (!res.ok) throw new Error('Pokémon no encontrado en PokeAPI');
            return res.json();
        })
        .then(data => {
            cachePokemonBuscado = data; // Guardamos el objeto COMPLEJO de PokeAPI
            return fetch(API_URL_EQUIPOS); // Necesitamos los equipos de NUESTRA API
        })
        .then(res => res.json())
        .then(equipos => {
            const equipoOptions = equipos.length > 0 
                ? equipos.map(eq => `<option value="${eq.id}">${eq.nombre}</option>`).join('')
                : '<option value="" disabled>Crea un equipo primero</option>';
            
            const tipoPrincipal = cachePokemonBuscado.types[0].type.name;
            const tiposHtml = cachePokemonBuscado.types.map(t => getTipoSpan(t.type.name)).join('');

            searchResultDiv.innerHTML = `
                <div class="flex flex-col md:flex-row items-center gap-6 p-4 border rounded-lg ${getTipoClase(tipoPrincipal)} bg-opacity-20">
                    <img src="${cachePokemonBuscado.sprites.front_default}" alt="${cachePokemonBuscado.name}" class="w-32 h-32 bg-white bg-opacity-50 rounded-full border-4 border-white shadow-lg">
                    <div class="flex-1">
                        <h4 class="text-2xl font-bold capitalize text-black">${cachePokemonBuscado.name}</h4>
                        <div class="flex gap-2 mt-2">
                            ${tiposHtml}
                        </div>
                    </div>
                    <div class="flex-1 space-y-3">
                        <input type="text" id="pokemon-apodo" placeholder="Apodo (ej. Pika)" class="block w-full px-3 py-2 border border-gray-300 rounded-md">
                        <select id="pokemon-equipo-id-select" class="block w-full px-3 py-2 border border-gray-300 rounded-md">
                            <option value="">-- Asignar a Equipo --</option>
                            ${equipoOptions}
                        </select>
                        <button id="btn-capturar" class="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition" ${equipos.length === 0 ? 'disabled' : ''}>
                            ¡Capturar!
                        </button>
                    </div>
                </div>
            `;
            document.getElementById('btn-capturar').addEventListener('click', capturarPokemon);
        })
        .catch(err => {
            searchResultDiv.innerHTML = `<p class="text-red-600">Error: ${err.message}</p>`;
        });
}

function capturarPokemon() {
    if (!cachePokemonBuscado) return;
    
    const apodoInput = document.getElementById('pokemon-apodo');
    const equipoSelect = document.getElementById('pokemon-equipo-id-select');
    
    // 1. Leemos los datos de la PokeAPI (cacheados)
    const nombrePokemon = cachePokemonBuscado.name;
    const tipoPokemon = cachePokemonBuscado.types[0].type.name;
    const nivelPokemon = cachePokemonBuscado.base_experience || 5;
    const fotoUrlPokemon = cachePokemonBuscado.sprites.front_default; 

    // 2. Leemos los datos del formulario
    const apodo = (apodoInput.value || nombrePokemon).trim();
    const equipoId = parseInt(equipoSelect.value);

    if (!equipoId) {
        alert("Debes seleccionar un equipo para capturar el Pokémon.");
        return;
    }
     
    // 3. Creamos el objeto SIMPLE que entiende Spring Boot
    const data = {
        nombre: apodo,
        tipo: tipoPokemon,
        nivel: Math.floor(nivelPokemon / 2) || 5, // Aseguramos un nivel mínimo
        equipoId: equipoId,
        fotoUrl: fotoUrlPokemon 
    };
    
    // 4. Enviamos el objeto SIMPLE
    fetch(API_URL_POKEMON, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    .then(res => {
        if (!res.ok) throw new Error('Error al capturar');
        return res.json();
    })
    .then(() => {
        alert(`¡${data.nombre} capturado!`);
        searchResultDiv.innerHTML = "";
        cachePokemonBuscado = null;
        searchInput.value = '';
        loadPokemonCapturados(); // Recargamos la lista
    })
    .catch(err => {
        console.error("Error:", err);
        alert("Error al capturar el Pokémon.");
    });
}

function loadPokemonCapturados() {
    listaPokemonCapturados.innerHTML = '<p>Cargando capturas...</p>';
    
    Promise.all([
        fetch(API_URL_EQUIPOS).then(res => res.json()),
        fetch(API_URL_POKEMON).then(res => res.json())
    ])
    .then(([equipos, capturados]) => {
        equiposMap.clear();
        equipos.forEach(e => equiposMap.set(e.id, e.nombre));
        
        pokemonMap.clear(); 
        capturados.forEach(p => pokemonMap.set(p.id, p));
        
        mostrarPokemonCapturados(capturados);
    })
    .catch(err => {
        console.error("Error cargando Pokémon capturados:", err);
        listaPokemonCapturados.innerHTML = `<p class="text-red-500">Error al cargar. Verifica el servidor en ${API_URL_POKEMON}</p>`;
    });
}

function mostrarPokemonCapturados(capturados) {
    listaPokemonCapturados.innerHTML = "";
    if (!capturados || capturados.length === 0) {
        listaPokemonCapturados.innerHTML = '<p class="text-gray-500">Aún no has capturado ningún Pokémon.</p>';
        return;
    }
    
    capturados.forEach(pokemon => {
        const div = document.createElement("div");
        
        div.className = `p-4 rounded-lg shadow-md border ${getTipoClase(pokemon.tipo)} bg-opacity-20`;
        
        const nombreEquipo = equiposMap.get(pokemon.equipoId) || 'Sin equipo';
        
        // Usamos un placeholder si la fotoUrl es null o undefined
        const foto = pokemon.fotoUrl || `https://placehold.co/80x80/eeeeee/aaaaaa?text=?`;
        
        div.innerHTML = `
            <div class="flex items-center gap-4">
                
                <img src="${foto}" alt="${pokemon.nombre}" class="w-20 h-20 bg-white bg-opacity-50 rounded-full">
                
                <div class="flex-1">
                    <h5 class="text-xl font-bold text-black">${pokemon.nombre}</h5>
                    <p class="text-sm text-gray-700 capitalize">Nivel: ${pokemon.nivel}</p>
                    <p class="text-sm text-gray-600">Equipo: ${nombreEquipo}</p>
                    <div class="flex gap-1 mt-1">
                        ${getTipoSpan(pokemon.tipo)}
                    </div>
                </div>
            </div>
            <div class="flex gap-2 mt-4">
                <button class="btn-editar-pkmn bg-yellow-500 text-white px-3 py-1 rounded-md text-sm hover:bg-yellow-600 w-full" data-id="${pokemon.id}">Editar</button>
                <button class="btn-liberar-pkmn bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700 w-full" data-id="${pokemon.id}">Liberar</button>
            </div>
        `;
        listaPokemonCapturados.appendChild(div);
    });

    agregarEventListenersPokemon(); 
}

function agregarEventListenersPokemon() {
    document.querySelectorAll('#lista-pokemon-capturados .btn-editar-pkmn').forEach(btn => {
        btn.addEventListener('click', function() {
            handleEditPokemon(this.getAttribute('data-id'));
        });
    });
    document.querySelectorAll('#lista-pokemon-capturados .btn-liberar-pkmn').forEach(btn => {
        btn.addEventListener('click', function() {
            handleDeletePokemon(this.getAttribute('data-id'));
        });
    });
}

function handleEditPokemon(id) {
    const pk = pokemonMap.get(parseInt(id)); 
    if (!pk) return alert("Error: No se encontró el Pokémon.");

    const nuevoNombre = prompt("Nuevo nombre (apodo):", pk.nombre);
    if (nuevoNombre === null) return; 

    let equipoOptions = "";
    equiposMap.forEach((nombre, id) => { equipoOptions += `${id}: ${nombre}\n`; });
    const nuevoEquipoIdStr = prompt(`Asignar a nuevo equipo (Ingresa el ID):\n${equipoOptions}`, pk.equipoId);
    if (nuevoEquipoIdStr === null) return; 
    
    const nuevoEquipoId = parseInt(nuevoEquipoIdStr);
    if (!equiposMap.has(nuevoEquipoId)) {
        return alert("ID de equipo no válido.");
    }

    // Creamos el objeto
    const data = {
        id: pk.id,
        nombre: nuevoNombre.trim() || pk.nombre,
        equipoId: nuevoEquipoId,
        tipo: pk.tipo, 
        nivel: pk.nivel, 
        fotoUrl: pk.fotoUrl 
    };

    fetch(`${API_URL_POKEMON}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    .then(res => {
        if (!res.ok) throw new Error('Error al actualizar');
        return res.json();
    })
    .then(() => {
        alert("Pokémon actualizado exitosamente");
        loadPokemonCapturados();
    })
    .catch(err => {
        console.error("Error:", err);
        alert("Error al actualizar el Pokémon");
    });
}

function handleDeletePokemon(id) {
    if (confirm("¿Está seguro que desea liberar este Pokémon?")) {
        fetch(`${API_URL_POKEMON}/${id}`, { 
            method: "DELETE" 
        })
        .then(res => {
            if (!res.ok) throw new Error('Error al liberar');
            alert("Pokémon liberado exitosamente");
            loadPokemonCapturados();
            loadEncuentros(); // Recargar por si estaba en un encuentro
        })
        .catch(err => {
            console.error("Error:", err);
            alert("Error al liberar el Pokémon");
        });
    }
}


// -------------------------------------
// --- ENCUENTROS (CRUD 4) ---
// -------------------------------------

function abrirModalSeleccion(target) {
    seleccionActual = target;
    pokemonSelectModalList.innerHTML = '<p>Cargando...</p>';
    
    if (pokemonMap.size === 0) {
        pokemonSelectModalList.innerHTML = '<p>No hay Pokémon capturados.</p>';
    } else {
        let listHtml = "";
        pokemonMap.forEach(pk => {
            const foto = pk.fotoUrl || `https://placehold.co/64x64/eeeeee/aaaaaa?text=?`;
            listHtml += `
                <div class="pokemon-select-item p-2 border rounded-lg cursor-pointer hover:bg-gray-100 ${getTipoClase(pk.tipo)} bg-opacity-20" data-id="${pk.id}">
                    <img src="${foto}" alt="${pk.nombre}" class="w-16 h-16 mx-auto bg-white bg-opacity-50 rounded-full">
                    <p class="text-center font-semibold mt-1" data-id="${pk.id}">${pk.nombre}</p>
                    <p class="text-center text-sm text-gray-600" data-id="${pk.id}">Nvl: ${pk.nivel}</p>
                </div>
            `;
        });
        pokemonSelectModalList.innerHTML = listHtml;
    }
    pokemonSelectModal.style.display = 'block';

    // Asignar eventos a los items
    pokemonSelectModalList.querySelectorAll('.pokemon-select-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            seleccionarPokemon(parseInt(id));
        });
    });
}

function closePokemonSelectModal() {
    pokemonSelectModal.style.display = 'none';
}


function seleccionarPokemon(id) {
    const pokemon = pokemonMap.get(id); 
    if (!pokemon) return;
    
    const foto = pokemon.fotoUrl || `https://placehold.co/128x128/eeeeee/aaaaaa?text=?`;
    
    const html = `
        <div class="h-48 w-full rounded-lg flex items-center justify-center mb-2 ${getTipoClase(pokemon.tipo)} bg-opacity-20">
            <img src="${foto}" alt="${pokemon.nombre}" class="w-32 h-32 bg-white bg-opacity-50 rounded-full">
        </div>
        <p class="font-bold text-lg text-black">${pokemon.nombre}</p>
        <button class="btn-cambiar text-blue-600 text-sm hover:underline" data-target="${seleccionActual}">Cambiar</button>
    `;

    if (seleccionActual === 'pk1') {
        pk1 = pokemon;
        pk1Selection.innerHTML = html;
        pk1Selection.querySelector('.btn-cambiar').addEventListener('click', () => abrirModalSeleccion('pk1'));
    } else {
        pk2 = pokemon;
        pk2Selection.innerHTML = html;
        pk2Selection.querySelector('.btn-cambiar').addEventListener('click', () => abrirModalSeleccion('pk2'));
    }
    
    closePokemonSelectModal();
}

// Hacemos que la función sea 'async' y esperamos la recarga
async function guardarEncuentro() {
    if (!pk1 || !pk2) {
        alert("Debes seleccionar ambos Pokémon para simular el encuentro.");
        return;
    }
   
    // Desactivar el botón para evitar dobles clics
    btnSimularEncuentro.disabled = true;
    btnSimularEncuentro.textContent = "Simulando...";

    let ganador = null;
    if (pk1.nivel > pk2.nivel) {
        ganador = pk1;
    } else if (pk2.nivel > pk1.nivel) {
        ganador = pk2;
    } else {
        ganador = Math.random() < 0.5 ? pk1 : pk2;
    }
    
    const data = {
        fecha: new Date().toISOString().split('T')[0], 
        pokemon1Id: pk1.id, 
        pokemon2Id: pk2.id,
        ganadorId: ganador.id
    };

    // --- Usamos try/catch con async/await ---
    try {
        const res = await fetch(API_URL_ENCUENTROS, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (!res.ok) throw new Error('Error al registrar encuentro');
        
        await res.json(); 
        await loadEncuentros();
        resetFormEncuentro();

        btnSimularEncuentro.disabled = false;
        btnSimularEncuentro.textContent = "Simular Encuentro";
   
    } catch (err) {
        console.error("Error:", err);
        alert("Error al registrar el encuentro");
        
        btnSimularEncuentro.disabled = false;
        btnSimularEncuentro.textContent = "Simular Encuentro";
    }
}

function resetFormEncuentro() {
    pk1 = null;
    pk2 = null;
    pk1Selection.innerHTML = `
        <div class="bg-gray-200 h-48 w-full rounded-lg flex items-center justify-center mb-2"><span class="text-gray-500">PK1</span></div>
        <button class="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900 transition w-full">Elegir Pokémon 1</button>`;
    pk2Selection.innerHTML = `
        <div class="bg-gray-200 h-48 w-full rounded-lg flex items-center justify-center mb-2"><span class="text-gray-500">PK2</span></div>
        <button class="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900 transition w-full">Elegir Pokémon 2</button>`;
    
    pk1Selection.querySelector('button').addEventListener('click', () => abrirModalSeleccion('pk1'));
    pk2Selection.querySelector('button').addEventListener('click', () => abrirModalSeleccion('pk2'));

}

// Hacemos que esta función devuelva la Promesa (Promise)
function loadEncuentros() {
    listaEncuentros.innerHTML = '<tr><td colspan="3">Cargando historial...</td></tr>';
    
    return Promise.all([
        (pokemonMap.size > 0 ? Promise.resolve(Array.from(pokemonMap.values())) : fetch(API_URL_POKEMON).then(res => res.json())),
        fetch(API_URL_ENCUENTROS).then(res => res.json())
    ])
    .then(([capturados, encuentros]) => {
        if (pokemonMap.size === 0) {
            capturados.forEach(p => pokemonMap.set(p.id, p));
        }
        mostrarEncuentros(encuentros);
    })
    .catch(err => {
        console.error("Error cargando historial de encuentros:", err);
        listaEncuentros.innerHTML = `<tr><td colspan="3" class="text-red-500 p-4">Error al cargar. Verifica el servidor en ${API_URL_ENCUENTROS}</td></tr>`;
    });
}

function mostrarEncuentros(encuentros) {
    listaEncuentros.innerHTML = ""; 
    if (!encuentros || encuentros.length === 0) {
        listaEncuentros.innerHTML = '<tr><td colspan="3" class="text-center p-4 text-gray-500">No hay encuentros registrados.</td></tr>';
        return;
    }
    
    encuentros.forEach(en => {
        const tr = document.createElement("tr");
        tr.className = "hover:bg-gray-50";
        
        const p1 = pokemonMap.get(en.pokemon1Id); 
        const p2 = pokemonMap.get(en.pokemon2Id);
        const ganador = pokemonMap.get(en.ganadorId);
        
        const p1Html = p1 ? `<span class="font-semibold text-black">${p1.nombre}</span>` : '<i>(Liberado)</i>';
        const p2Html = p2 ? `<span class="font-semibold text-black">${p2.nombre}</span>` : '<i>(Liberado)</i>';
        
        const ganadorHtml = ganador 
            ? `<span class="font-bold text-green-700">${ganador.nombre}</span>` 
            : '<i>N/A</i>';
        
        const fechaLocal = en.fecha ? new Date(en.fecha + 'T00:00:00').toLocaleDateString() : 'N/A';

        tr.innerHTML = `
            <td class="border-b p-3">${fechaLocal}</td>
            <td class="border-b p-3">${p1Html} vs ${p2Html}</td>
            <td class="border-b p-3">${ganadorHtml}</td>
        `;
        
        listaEncuentros.appendChild(tr); 
    });
}