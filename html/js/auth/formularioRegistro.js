$(document).ready(function() {
    var btnRegister = $('#btn-register');
    var passwordMessage = $('#password-p');
    var avatarInputs = $('input[name="avatar"]');

    function checkFields() {
        var username = $('#username').val().trim();
        var email = $('#email').val().trim();
        var password = $('#password').val().trim();
        var confirmPassword = $('#confirm_password').val().trim();
        var isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        var passwordsMatch = password === confirmPassword;
        var isAvatarSelected = avatarInputs.is(":checked");

        if (username && email && password && confirmPassword && isValidEmail && passwordsMatch && isAvatarSelected) {
            btnRegister.fadeIn();
            passwordMessage.text('');
            btnRegister.prop('disabled', false);
        } else {
            btnRegister.fadeOut();
            if (!isValidEmail) {
                passwordMessage.text('Invalid email format').css('color', 'red');
            } else if (!passwordsMatch) {
                passwordMessage.text("Passwords don't match").css('color', 'red');
            } else if (!isAvatarSelected) {
                passwordMessage.text("Please select an avatar").css('color', 'red');
            } else {
                passwordMessage.text('');
            }
            btnRegister.prop('disabled', true);
        }
    }

    // Event listeners for input fields and avatar checkboxes
    $('#username, #email, #password, #confirm_password').on('input', checkFields);
    avatarInputs.on('change', checkFields);

    // Form submission handler
    $('form').submit(function(event) {
        event.preventDefault();
        var formData = new FormData(this);
        $.ajax({
            type: 'POST',
            url: '/register',
            data: formData,
            contentType: false,
            processData: false,
            success: function(response) {
                if (response.message === "User registered successfully") {
                    window.location.replace('/login');
                }
            },
            error: function(xhr, status, error) {
                console.error(xhr.responseText);
                var errorMessage = JSON.parse(xhr.responseText).message;
                passwordMessage.text(errorMessage).css('color', 'red');
            }
        });
    });
});
