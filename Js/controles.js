// Controles de roproducción accesibles
// Autor: Johan G()

// variables
var sonidoMain, audio_volume = 1.0, toggle_btn, back_btn, time_p, advance_btn, alert_obj, volume_up, volume_down;
//ejecutamos las instrucciones al terminar de cargarse el documento

document.addEventListener("DOMContentLoaded", function () {

	// creamos un array con todos los elementos  de audio
	var elements = document.querySelectorAll("audio");
	// recorremos el array para crear las asignaciones por elemento
	for (element of elements) {
		//añadimos al elemento audio el evento onTimeUpdate.
		element.setAttribute("onTimeUpdate", `audioTime("${id}");`);

	}
});

// función que asigna las variables globales los elementos a través de su id

	sonidoMain = document.querySelector("audio");
	toggle_btn = document.querySelector("#toggle");
	back_btn = document.querySelector("#back");
	time_p = document.querySelector("#time");
	advance_btn = document.querySelector("#advance");
	alert_obj = document.querySelector("#alert");
	volume_up = document.querySelector("#up");
	toggle_mute = document.querySelector("#toggle_mute");
	volume_down = document.querySelector("#down");

// Función que Contiene todos los atajos de teclado y lo asigna a cada botón
function addHotkeys() {
	shortcut.add("up", function() {
		volume_up.click();
	}, {
		'propagate':true,
		'target': document.querySelector(".controles")
		});
		volume_up.setAttribute("aria-keyshortcuts", "Flecha arriba");
		shortcut.add("m", function() {
			toggle_mute.click();
		}, {
	   'propagate':true,
	   'target': document.querySelector(".controles")
	   });
	   toggle_mute.setAttribute("aria-keyshortcuts", "M");

	   shortcut.add("down", function() {
		volume_down.click();
	   }, {
	  'propagate':true,
	  'target': document.querySelector(".controles")
	  });
	  volume_down.setAttribute("aria-keyshortcuts", "Flecha abajo");

	  shortcut.add("Space", function() {
		if(sonidoMain.paused) { 
			toggle_btn.click();
			speak("Reproduciendo");
		} else {
			toggle_btn.click();
			speak("Pausado")
		}
	  },{
	 'propagate':true,
	 'target': document.querySelector(".controles")
	 });
	 toggle_btn.setAttribute("aria-keyshortcuts", "Espacio");

	 shortcut.add("left", function() {
		back_btn.click();
	 },{
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
	document.addEventListener("DOMContentLoaded", addHotkeys);
	
	sonidoMain.addEventListener("ended", function() {
		toggle_btn.innerHTML = "Volver a reproducir";
		toggle_btn.title = "Volver a reproducir";
		speak("Finalizado");
		toggle_btn.focus()
	});
	sonidoMain.addEventListener("pause", () => {
		toggle_btn.innerHTML="Reproducir"
		toggle_btn.title="Reproducir";
	});
	sonidoMain.addEventListener("play", () => {
		toggle_btn.innerHTML="Pausar"
		toggle_btn.title="Pausar";
	});

function playPause() {
	(sonidoMain.paused)? play() : pause()
	navigator.vibrate(50);
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

function audioTime() {
	let minutos = parseInt(sonidoMain.duration / 60, 10);
	var segundos = parseInt(sonidoMain.duration % 60);
	var segundos = (segundos < 10)? `0${segundos}` : segundos;
	let ACT_minutos = parseInt(sonidoMain.currentTime / 60, 10);
	var ACT_segundos = parseInt(sonidoMain.currentTime % 60);
	var ACT_segundos = (ACT_segundos < 10)? `0${ACT_segundos}` : ACT_segundos;
	document.querySelector("#time").innerHTML = `${ACT_minutos}:${ACT_segundos} de ${minutos}:${segundos}`;
}

function timeAdvance() {
	sonidoMain.currentTime += 10.0;
	let time_capture = document.querySelector("#time").textContent;
	//speak(time_capture);
}

function timeBack() {
	sonidoMain.currentTime -= 10;
	let time_capture = document.querySelector("#time").textContent;
	//speak(time_capture);
}

function speak(str) {
	alert_obj.textContent = str;
	setTimeout(() => alert_obj.textContent = "", 50);
}

function audioRate(value) {
	let values = {"0":0.75, "10":0.80, "20":0.85, "30":0.90, "40":0.95, "50":1.0, "60":1.1, "70":1.2, "80":1.3, "90":1.4, "100":1.5};
	sonidoMain.playbackRate = values[value];
	if (sonidoMain.playbackRate  == 0.75) speak("Muy lento")
	if (sonidoMain.playbackRate  == 0.90) speak("Lento")
	if (sonidoMain.playbackRate  == 1) speak("Velosidad normal")
	if (sonidoMain.playbackRate  == 1.2) speak("Rápido");
	if (sonidoMain.playbackRate  == 1.5) speak("muy rápido");
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
	if (audio_volume > 0.2) {
		audio_volume -= 0.1;
		sonidoMain.volume = audio_volume;
	} else {
		speak("Volúmen mínimo");
		navigator.vibrate(500);
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

function hotkeys(text) {
	navigator.vibrate([100, 50, 100])
	if (text == "Mostrar los atajos del reproductor") {
		document.getElementById("hksbtn").textContent = "Ocultar los atajos del reproductor";
		document.getElementById("hks").removeAttribute("style");
		speak("Se está mostrando la lista de comandos por teclas en la parte de abajo de este botón.")
	} else {
		document.getElementById("hksbtn").textContent = "Mostrar los atajos del reproductor";
		document.getElementById("hks").setAttribute("style", "display:none");
		speak("Se a ocultado la lista de comandos.")
	}

	}
// Linia final
