$(document).ready(function() {
    $.ajax({
      url: '/navbar',
      type: 'POST',
      data: { pagina: 'admin'},
      success: function(response) {
        console.log('Éxito:', response);
        if (response !== "invalido") {
          console.log("ha cargado");
          $('nav').html(response);
        }
      },
      error: function(xhr, status, error) {
        console.error('Error:', error);
      }
    });
  });
  