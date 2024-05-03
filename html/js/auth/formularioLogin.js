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
});