$(document).ready(function() {
    $.ajax({
      url: '/navbar',
      type: 'POST',
      data: { pagina: 'home'},
      success: function(response) {
        console.log('Éxito:', response);
        if (response !== "invalido") {
          console.log("ha cargado");
          $('nav').html(response);
          $('.btn-join').remove();
        }
      },
      error: function(xhr, status, error) {
        console.error('Error:', error);
      }
    });
  });
  