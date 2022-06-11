// Controles de roproducción accesibles
// Autor: Johan G()

// variables
var audio_id, sonidoMain, audio_volume = 1.0, toggle_btn, back_btn, time_p, advance_btn, alert_obj, volume_up, volume_down;
//ejecutamos las instrucciones al terminar de cargarse el documento
document.addEventListener("DOMContentLoaded", function () {
	// creamos un array con todos los elementos  con el id controls
	var elements = document.querySelectorAll("#controls");
	// recorremos el array para crear las asignaciones por elemento
	for (element of elements) {
		//guardamos en la variable id, el id de cada eqtiqueta audio
		let id = element.id;
		//añadimos al elemento audio el evento onTimeUpdate.
		element.setAttribute("onTimeUpdate", `audioTime("${id}");`);

		element.play()
		element.setAttribute("autoplay", "true");

		//añadimos la lista con botones de control luego del elemento audio. Primero creamos un nodo nuevo, le añadimos la lista de controles html y finalmente lo añadimos seguidamente al elemento audio con la función insertAfter.
		let new_element = document.createElement("div");
		new_element.innerHTML = `<div class="buttons_list" role="group" aria-label="Controles de reproducción">
			<button id="${id}_hksbtn" onClick='hotkeys("${id}", this.textContent);'>Mostrar los atajos del reproductor</button><br>
			<div id="${id}_hks" style="display:none;">
				<p>Una vez pulsado el botón de reproducción por primera vez, están disponibles los siguientes atajos:</p>
				<p>Adelantar; (Flecha derecha)</p>
				<p>Retroceder; (Flecha hisquierda)</p>
				<p>Subir volúmen; (Flecha arriba)</p>
				<p>Bajar volúmen; (Flecha abajo)</p>
				<p>Silenciar y quitar silencio; (m)</p>
				<p>Verbalizar el tiempo actual y total del audio en curso; (i)</p>
			</div>
			<button align="center" id="${id}_toggle" onClick='playPause("${id}");'>Pausar</button><br>
			<button align="left" id="${id}_back" onClick='timeBack();'>Retroceder 10 segundos</button>
			<span align="center" id="${id}_time" onClick='speak(this.textContent);'>0:00</span>
			<button align="right" id="${id}_advance" onClick='timeAdvance();'>Adelantar 10 segundos</button><br>
			<label>Velocidad de reproducción><input type="range" min="0" max="100" step="10" value="50" onChange='audioRate(this.value)' /></label>
			<button id="${id}_down" onClick='volumeDown();'>Bajar volúmen</button>
			<label>
			<input type="checkbox" id="${id}_toggle_mute" onChange='toggleMute();'>Silenciar sonido
			</label>
			<button id="${id}_up" onClick='volumeUp();'>Subir volúmen</button>
			<div id="${id}_alert" aria-live="assertive"></div>
		</div>`;
	insertAfter(element, new_element);
	}
});

function insertAfter(element, new_element) {
	if (element.nextSibling) {
		element.parentNode.insertBefore(new_element, element.nextSibling);
	} else {
		element.parentNode.appendChild(new_element);
	}
}

// función que asigna las variables globales los elementos a través de su id
function getElements(id) {
	audio_id = id;
	sonidoMain = document.querySelector(`#${id}`);
	toggle_btn = document.querySelector(`#${id}_toggle`);
	back_btn = document.querySelector(`#${id}_back`);
	time_p = document.querySelector(`#${id}_time`);
	advance_btn = document.querySelector(`#${id}_advance`);
	alert_obj = document.querySelector(`#${id}_alert`);
	volume_up = document.querySelector(`#${id}_up`);
	toggle_mute = document.querySelector(`#${id}_toggle_mute`);
	volume_down = document.querySelector(`#${id}_down`);
}

// Función que Contiene todos los atajos de teclado y lo asigna a cada botón
function addHotkeys(id) {
	shortcut.add("up", volumeUp, 
		 {
		'propagate':true,
		'target': document.querySelector(".controles")
		});
		volume_up.setAttribute("aria-keyshortcuts", "Flecha arriba");
		shortcut.add("m", toggleMute, 
		{
	   'propagate':true,
	   'target': document.querySelector(".controles")
	   });
	   toggle_mute.setAttribute("aria-keyshortcuts", "M");

	   shortcut.add("down", volumeDown, 
	   {
	  'propagate':true,
	  'target': document.querySelector(".controles")
	  });
	  volume_down.setAttribute("aria-keyshortcuts", "Flecha abajo");

	  shortcut.add("Space", playPause,
	  {
	 'propagate':true,
	 'target': document.querySelector(".controles")
	 });
	 toggle_btn.setAttribute("aria-keyshortcuts", "Espacio");
	 toggle_btn.focus()

	 shortcut.add("left", timeBack,
	 {
	'propagate':true,
	'target': document.querySelector(".controles")
	});
	back_btn.setAttribute("aria-keyshortcuts", "Flecha hisquierda");

time_p.setAttribute("accesskey", "i");

shortcut.add("right", timeAdvance,
{
'propagate':true,
'target': document.querySelector(".controles")
});
advance_btn.setAttribute("aria-keyshortcuts", "Flecha derecha");

	}
	sonidoMain.addEventListener("ended", function() {
		toggle_btn.innerHTML = "Volver a reproducir";
		toggle_btn.title = "Volver a reproducir";
		speak("Finalizado");
		toggle_btn.focus()
	});

function playPause(id) {
	if (id != audio_id) {
		getElements(id);
		addHotkeys(id);
	}
	(sonidoMain.paused)? play() : pause()
}

function play() {
	sonidoMain.play();
	toggle_btn.innerHTML = "Pausar";
	toggle_btn.title= "Pausar";
}

function pause() {
	sonidoMain.pause();
	toggle_btn.innerHTML = "Reproducir";
	toggle_btn.title= "Reproducir";
}

function audioTime(id) {
	let minutos = parseInt(sonidoMain.duration / 60, 10);
	var segundos = parseInt(sonidoMain.duration % 60);
	var segundos = (segundos < 10)? `0${segundos}` : segundos;
	let ACT_minutos = parseInt(sonidoMain.currentTime / 60, 10);
	var ACT_segundos = parseInt(sonidoMain.currentTime % 60);
	var ACT_segundos = (ACT_segundos < 10)? `0${ACT_segundos}` : ACT_segundos;
	time_p.innerHTML = `${ACT_minutos}:${ACT_segundos} de ${minutos}:${segundos}`;
}

function timeAdvance() {
	sonidoMain.currentTime += 10.0;
	let time_capture = time_p.textContent;
	//speak(time_capture);
}

function timeBack() {
	sonidoMain.currentTime -= 10;
	let time_capture = time_p.textContent;
	//speak(time_capture);
}

function speak(str) {
	alert_obj.textContent = str;
	setTimeout(() => alert_obj.textContent = "", 50);
}

function audioRate(value) {
	let values = {"0":0.75, "10":0.80, "20":0.85, "30":0.90, "40":0.95, "50":1.0, "60":1.1, "70":1.2, "80":1.3, "90":1.4, "100":1.5};
	sonidoMain.playbackRate = values[value];
}

function volumeUp() {
	if (audio_volume < 1.0) {
		audio_volume += 0.1;
		sonidoMain.volume = audio_volume;
	} else {
		speak("volúmen máximo");
	}
}

function volumeDown() {
	if (audio_volume > 0.1) {
		audio_volume -= 0.1;
		sonidoMain.volume = audio_volume;
	} else {
		speak("Volúmen mínimo");
	}
}

function toggleMute() {
	if (sonidoMain.muted == false) {
		sonidoMain.muted = true;
		speak("silenciado");
	} else {
		sonidoMain.muted = false;
		speak("no silenciado");
	}
}

function hotkeys(id, text) {
	if (text == "Mostrar los atajos del reproductor") {
		document.getElementById(`${id}_hksbtn`).textContent = "Ocultar los atajos del reproductor";
		document.getElementById(`${id}_hks`).removeAttribute("style");
	} else {
			document.getElementById(`${id}_hksbtn`).textContent = "Mostrar los atajos del reproductor";
			document.getElementById(`${id}_hks`).setAttribute("style", "display:none");
	}
}
// Linia final