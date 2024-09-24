let reservas = [];

document.addEventListener('DOMContentLoaded', () => {
  const reservasGuardadas = localStorage.getItem('reservas');
  if (reservasGuardadas) {
    reservas = JSON.parse(reservasGuardadas);
    mostrarReservas();
  }
});

document.querySelector('#formularioReserva').addEventListener('submit', function(evento) {
  evento.preventDefault();

 
  const nombre = document.querySelector('#nombre').value;
  const apellido = document.querySelector('#apellido').value;
  const servicio = document.querySelector('#servicio').value;
  const fecha = document.querySelector('#fecha').value;
  const hora = document.querySelector('#hora').value;

  // Validación de fecha y hora
  const fechaActual = new Date().toISOString().split('T')[0];
  if (fecha < fechaActual) {
    alert('No puedes seleccionar una fecha pasada.');
    return;
  }

  if (hora < '09:00' || hora > '18:00') {
    alert('El horario debe estar entre las 9:00 y las 18:00.');
    return;
  }

  // Verificar que no exista una reserva para el mismo horario y fecha
  const reservaExistente = reservas.find(reserva => reserva.fecha === fecha && reserva.hora === hora);
  if (reservaExistente) {
    alert('Este horario ya está reservado.');
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

  
  reservas.push({ ...nuevaReserva });

  localStorage.setItem('reservas', JSON.stringify(reservas));

  document.querySelector('#confirmacion').innerText = `¡Gracias, ${nombre} ${apellido}! Tu reserva para ${servicio} el ${fecha} a las ${hora} ha sido confirmada.`;

  
  mostrarReservas();
});

// fun para mostrar reservas
function mostrarReservas() {
  const divConfirmacion = document.querySelector('#confirmacion');
  divConfirmacion.innerHTML = '<h2>Reservas confirmadas:</h2>';

  reservas.forEach((reserva) => {
    const { nombre, apellido, servicio, fecha, hora } = reserva; 

    const textoReserva = document.createElement('p');
    textoReserva.textContent = `Cliente: ${nombre} ${apellido} - Servicio: ${servicio} - Fecha: ${fecha} - Hora: ${hora}`;

    // btn para borrar reserva
    const botonBorrar = document.createElement('button');
    botonBorrar.textContent = '❌';
    botonBorrar.addEventListener('click', () => {
      eliminarReserva(reserva.id);
    });

    textoReserva.appendChild(botonBorrar);
    divConfirmacion.appendChild(textoReserva);
  });
}

// Función para eliminar una reserva
function eliminarReserva(id) {
  reservas = reservas.filter(({ id: reservaId }) => reservaId !== id);
  localStorage.setItem('reservas', JSON.stringify(reservas));
  mostrarReservas();
}

// Filtrar reservas por fecha
function filtrarReservasPorFecha(fecha) {
  return reservas.filter(reserva => reserva.fecha === fecha);
}

// Ejemplo de uso
document.querySelector('#fecha').addEventListener('change', (evento) => {
  const fecha = evento.target.value;
  const reservasFiltradas = filtrarReservasPorFecha(fecha);
  console.log('Reservas para esta fecha:', reservasFiltradas);
});
