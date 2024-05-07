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
                $('#change-msg').text(`Your avatar has changed successfully to ${parsearAvatar(avatarSeleccionado)}!`).css('color', 'green');
                console.log(response)
            },
            error: function(xhr, status, error) {
              console.error('Error:', error);
            }
          });
    });

    function parsearAvatar(avatarID){
        if (avatarID == 1){
            return 'bird';
        } else if (avatarID == 2){
            return 'tank';
        } else if (avatarID == 3){
            return 'armor'
        }
    }
});
