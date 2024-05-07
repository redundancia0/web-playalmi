$(document).ready(function() {
    $.ajax({
        url: '/perfil',
        type: 'POST',
        success: function(response) {
            console.log('Éxito:', response);
            console.log(response.data._id)
            $('#profile-idUser').text(response.data._id);
            $('#profile-name').text(response.data.nombre);
            $('#profile-email').text(response.data.correo);
            $('#profile-rank').text(parsearRango(response.data.rango));
            $('#profile-score').text(response.data.estadisticas.puntuacion);
            $('#profile-coins').text(response.data.estadisticas.monedas);
            $('#profile-created').text(parsearFecha(response.data.fecha_registro));
            $('#profile-logIn').text(parsearFecha(response.data.fecha_inicioSesion));

        },
        error: function(xhr, status, error) {
            console.error('Error:', error);
        }
    });

    obtenerPartidas();
});

function parsearFecha(fecha) {
    fechaRegistro = new Date(fecha);
    fechaFormateada = fechaRegistro.getFullYear() + '/' + (fechaRegistro.getMonth() + 1).toString().padStart(2, '0') + '/' + fechaRegistro.getDate().toString().padStart(2, '0');
    return fechaFormateada
}

function parsearRango(id_rango) {
    if (id_rango == 0) {
        return 'User';
    } else if (id_rango == 1) {
        return 'Admin';
    }
}

function obtenerPartidas(){
    $.ajax({
        url: '/obtenerPartidas5',
        type: 'GET',
        success: function(response) {
            if (response.status === 'success') {
                const partidas = response.data;
                const tbody = $('#recent-games-body');

                tbody.empty();

                partidas.forEach(function(partida) {
                    const date = new Date(partida.fecha);
                    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
                    const row = `<tr>
                                    <td>${formattedDate}</td>
                                    <td>${partida.puntuacion}</td>
                                    <td>${partida.monedas}</td>
                                 </tr>`;
                    tbody.append(row);
                });
            } else {
                console.error('Error al obtener las últimas partidas:', response.error);
            }
        },
        error: function(xhr, status, error) {
            console.error('Error al realizar la petición AJAX:', error);
        }
    });
}