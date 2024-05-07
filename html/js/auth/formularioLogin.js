let url = "http://localhost:8080/api"

$(document).ready(function() {
    var usuarioInput = $('#usuario');
    var claveInput = $('#clave');
    var btnLogin = $('#btn-login');
    
    function checkCamposRellenados() {
        if (usuarioInput.val().trim() !== '' && claveInput.val().trim() !== '') {
            $('.button-container').fadeIn();
        } else {
            $('.button-container').fadeOut();
        }
    }
    
    usuarioInput.on('input', checkCamposRellenados);
    claveInput.on('input', checkCamposRellenados);

/*     $('#btn-login').on('click', function() {
        var usuario = $('#usuario').val();
        var clave = $('#clave').val();

        $.ajax({
            url: `${url}/usuarios/login/`,
            method: 'POST',
            data: {
                nombre: usuario,
                clave: clave
            },
            success: function(response) {
                console.log(response);
                window.location.href = '/';
            },
            error: function(xhr, status, error) {
                console.error(error);
                alert('Error al iniciar sesión. Verifica tus credenciales.');
            }
        });
    }); */
});
