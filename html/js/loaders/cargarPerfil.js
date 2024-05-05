$(document).ready(function() {
    $.ajax({
        url: '/perfil',
        type: 'POST',
        success: function(response) {
            console.log('Éxito:', response);
            $('#profile-name').text(response.data.nombre);
            $('#profile-email').text(response.data.correo);
            $('#profile-rank').text(parsearRango(response.data.rango));
            $('#profile-score').text(response.data.puntuacion);
            $('#profile-coins').text(response.data.monedas);

        },
        error: function(xhr, status, error) {
            console.error('Error:', error);
        }
    });
});

function parsearRango(id_rango) {
    if (id_rango == 0) {
        return 'User';
    } else if (id_rango == 1) {
        return 'Admin';
    }
}
