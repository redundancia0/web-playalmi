$(document).ready(function() {
    $('input[name="avatar"]').change(function() {
        $('#btn-avatar').fadeIn(); // Muestra el botón de avatar cuando se selecciona un avatar
    });

    // Evento para el botón de avatar
    $('#btn-avatar').click(function() {
        var avatarSeleccionado = $('input[name="avatar"]:checked').val();
        console.log('Se hizo clic en el botón de avatar:', avatarSeleccionado);
        // Aquí puedes agregar la lógica para cambiar el avatar
        // Por ejemplo, puedes enviar una solicitud AJAX para actualizar el avatar en el backend
    });
});
