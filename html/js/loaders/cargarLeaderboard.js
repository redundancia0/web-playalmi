$(document).ready(function() {
  $.ajax({
      url: '/topUsuarios',
      type: 'POST',
      success: function(response) {
          console.log('Éxito:', response);
          $('#leaderboardList').empty();
          response.data.forEach(function(usuario, index) {
              var listItem = $('<li>').addClass('leaderboard-item');
              var avatarImg = $('<img>').attr('src', usuario.avatar).attr('alt', 'Avatar').addClass('avatar');
              var playerNameSpan = $('<span>').addClass('player-name').text(usuario.nombre);
              var scoreSpan = $('<span>').addClass('score').text(usuario.puntuacion);

              listItem.append(avatarImg, playerNameSpan, scoreSpan);
              $('#leaderboardList').append(listItem);
          });
      },
      error: function(xhr, status, error) {
          console.error('Error:', error);
      }
  });
});
