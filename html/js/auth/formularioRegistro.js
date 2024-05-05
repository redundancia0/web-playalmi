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

    function validarEmail(email) {
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function checkEmailFormat() {
        var email = emailInput.val().trim();
        if (email !== '') {
            if (!validarEmail(email)) {
                passwordMessage.text("Invalid email format").css('color', 'red');
                btnRegister.prop('disabled', true);
            } else {
                passwordMessage.text("");
                btnRegister.prop('disabled', false);
            }
        } else {
            passwordMessage.text("");
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
    emailInput.on('input', function() {
        checkCamposRellenados();
        checkEmailFormat();
    });
    passwordInput.on('input', function() {
        checkCamposRellenados();
        checkPasswordMatch();
    });
    confirmPasswordInput.on('input', function() {
        checkCamposRellenados();
        checkPasswordMatch();
    });
    
    $('form').submit(function(event) {
        event.preventDefault();
        
        var username = $('#username').val();
        var email = $('#email').val();
        var password = $('#password').val();
        var confirm_password = $('#confirm_password').val();
        
        $.ajax({
            type: 'POST',
            url: '/register',
            data: {
                username: username,
                email: email,
                password: password,
                confirm_password: confirm_password
            },
            success: function(response){
                if (response.message == "User registered successfully"){
                    window.location.replace('/login')
                }
            },
            error: function(xhr, status, error){
                console.error(xhr.responseText);
                var errorMessage = JSON.parse(xhr.responseText).message;
                if (errorMessage == "El nombre de usuario o el correo electrónico ya están en uso"){
                    passwordMessage.text("Email address or username is in use!").css('color', 'red');
                } else{
                    passwordMessage.text(errorMessage).css('color', 'red');
                }
            }
        });
    });
});
