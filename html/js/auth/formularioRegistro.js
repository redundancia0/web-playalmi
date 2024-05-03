$(document).ready(function() {
    var usernameInput = $('#username');
    var emailInput = $('#email');
    var passwordInput = $('#password');
    var confirmPasswordInput = $('#confirm_password');
    var btnRegister = $('#btn-register');
    var passwordMessage = $('#password-p');
    
    function checkCamposRellenados() {
        if (usernameInput.val().trim() !== '' && emailInput.val().trim() !== '' &&
            passwordInput.val().trim() !== '' && confirmPasswordInput.val().trim() !== '') {
            btnRegister.fadeIn();
        } else {
            btnRegister.fadeOut();
        }
    }
    
    function checkPasswordMatch() {
        var password = passwordInput.val().trim();
        var confirmPassword = confirmPasswordInput.val().trim();
        if (password !== '' && confirmPassword !== '') {
            if (password !== confirmPassword) {
                passwordMessage.text("Passwords don't match").css('color', 'red');
                btnRegister.prop('disabled', true);
            } else {
                passwordMessage.text("");
                btnRegister.prop('disabled', false);
            }
        } else {
            passwordMessage.text("");
        }
    }
    
    usernameInput.on('input', checkCamposRellenados);
    emailInput.on('input', checkCamposRellenados);
    passwordInput.on('input', function() {
        checkCamposRellenados();
        checkPasswordMatch();
    });
    confirmPasswordInput.on('input', function() {
        checkCamposRellenados();
        checkPasswordMatch();
    });
    
    $('form').submit(function(event) {
        if (passwordInput.val().trim() !== confirmPasswordInput.val().trim()) {
            event.preventDefault();
            passwordMessage.text("Passwords don't match").css('color', 'red');
            btnRegister.prop('disabled', true);
        }
    });
});