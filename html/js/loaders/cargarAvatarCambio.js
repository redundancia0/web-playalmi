$(document).ready(function() {
    $('input[name="avatar"]').change(function() {
        $('#btn-avatar').fadeIn();
    });

    $('#btn-avatar').click(function() {
        var avatarSeleccionado = $('input[name="avatar"]:checked').val();
        var userID = $('#profile-idUser').text();
        console.log('Se hizo clic en el botón de avatar:', avatarSeleccionado);
        $.ajax({
            url: '/updateUserAvatar',
            type: 'POST',
            data: { avatar: avatarSeleccionado, idUsuario: userID},
            success: function(response) {
                console.log(response)
            },
            error: function(xhr, status, error) {
              console.error('Error:', error);
            }
          });
    });
});
