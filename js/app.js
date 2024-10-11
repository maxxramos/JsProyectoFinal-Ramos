let reservas = [];

// obtener las reservas del archivo JSON usando fetch
function obtenerReservas() {
  fetch('./data/reservas.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al cargar las reservas');
      }
      return response.json();
    })
    .then(data => {
      reservas = data;
      mostrarReservas();
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

//  mostrar reservas
function mostrarReservas() {
  const divConfirmacion = document.querySelector('#confirmacion');
  divConfirmacion.innerHTML = '<h2>Reservas confirmadas:</h2>';

  reservas.forEach((reserva) => {
    const { nombre, apellido, servicio, fecha, hora, id } = reserva; 

    const textoReserva = document.createElement('p');
    textoReserva.textContent = `Cliente: ${nombre} ${apellido} - Servicio: ${servicio} - Fecha: ${fecha} - Hora: ${hora}`;

    // btn para borrar reserva
    const botonBorrar = document.createElement('button');
    botonBorrar.textContent = '❌';
    botonBorrar.addEventListener('click', () => {
      eliminarReserva(id);
    });

    textoReserva.appendChild(botonBorrar);
    divConfirmacion.appendChild(textoReserva);
  });
}

// funcion eliminar reserva
function eliminarReserva(id) {
  reservas = reservas.filter(reserva => reserva.id !== id);
  mostrarReservas();

 
  Toastify({
    text: "Reserva eliminada exitosamente",
    duration: 3000, // Duración de 3 segundos
    gravity: "top", // Posición
    position: "right", 
    backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)", 
  }).showToast();
}

// manejo del formulario de reserva
document.querySelector('#formularioReserva').addEventListener('submit', function(evento) {
  evento.preventDefault();

  const nombre = document.querySelector('#nombre').value;
  const apellido = document.querySelector('#apellido').value;
  const servicio = document.querySelector('#servicio').value;
  const fecha = document.querySelector('#fecha').value;
  const hora = document.querySelector('#hora').value;

  // validacion de fecha y hora
  const fechaActual = new Date().toISOString().split('T')[0];
  if (fecha < fechaActual) {
    document.querySelector('#confirmacion').innerText = 'No puedes seleccionar una fecha pasada.';
    return;
  }

  if (hora < '09:00' || hora > '18:00') {
    document.querySelector('#confirmacion').innerText = 'El horario debe estar entre las 9:00 y las 18:00.';
    return;
  }

  // verificar que no exista una reserva para el mismo horario y fecha
  const reservaExistente = reservas.find(reserva => reserva.fecha === fecha && reserva.hora === hora);
  if (reservaExistente) {
    document.querySelector('#confirmacion').innerText = 'Este horario ya está reservado.';
    return;
  }

  const nuevaReserva = {
    nombre,
    apellido,
    servicio,
    fecha,
    hora,
    id: Date.now()
  };

  reservas.push(nuevaReserva);
  
  // mostrar confirmación de reserva
  document.querySelector('#confirmacion').innerText = `¡Gracias, ${nombre} ${apellido}! Tu reserva para ${servicio} el ${fecha} a las ${hora} ha sido confirmada.`;
  mostrarReservas();

  // mostrar notificación con Toastify al agregar una nueva reserva
  Toastify({
    text: "Reserva agregada exitosamente",
    duration: 3000,
    gravity: "top", 
    position: "right", 
    backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
  }).showToast();
});

// al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
  obtenerReservas(); // 
});
