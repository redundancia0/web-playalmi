$(document).ready(function() {
  let url = "http://localhost:8080/api"

  $.ajax({
    url: `${url}/usuarios`,
    type: 'GET',
    success: function(response) {
      console.log(response)
      handleUserListResponse(response);
    },
    error: function(xhr, status, error) {
      console.error('Error:', error);
    }
  });


  $('#edit-user-modal').on('click', '#cancel-changes-btn', function() {
    $('#edit-user-modal').modal('hide');
  });

  $('#edit-user-modal').on('click', '#save-changes-btn', function() {
    var userId = $(this).closest('.modal-content').find('#username').data('id');
    var updatedUserData = {
      monedas: $('#edit-user-modal').find('#coins').val(),
      puntuacion: $('#edit-user-modal').find('#score').val(),
      idUsuario: userId
    };

    console.log(updatedUserData);

    $.ajax({
      url: `${url}/usuarios/findbyid/${userId}`,
      type: 'POST', // Cambiado a 'PUT' para actualizar los datos del usuario
      data: updatedUserData,
      success: function(response) {
        console.log('User data updated successfully:', response);
        $('#edit-user-modal').modal('hide');
        reloadUserList();
      },
      error: function(xhr, status, error) {
        console.error('Error updating user data:', error);
      }
    });
  });

  function reloadUserList() {
    $.ajax({
      url: '/userList',
      type: 'POST',
      success: function(response) {
        console.log(response)
        handleUserListResponse(response);
      },
      error: function(xhr, status, error) {
        console.error('Error reloading user list:', error);
      }
    });
  }

  function handleUserListResponse(response) {
    console.log('Success:', response);
    if (response.status === "success") {
      console.log("Data loaded");
      displayUserTable(response.data);
      attachEditButtonListeners(response.data);
      attachRemoveButtonListeners(response.data);
    } else {
      console.log("Invalid response");
    }
  }

  function displayUserTable(users) {
    var tableHtml = '<table class="table"><thead><tr><th>Name</th><th>Coins</th><th>Score</th><th>Rank</th><th>Action</th></tr></thead><tbody>';
    users.forEach(function(user) {
      tableHtml += '<tr><td>' + user.nombre + '</td><td>' + user.estadisticas.monedas + '</td><td>' + user.estadisticas.puntuacion + '</td><td>' + parsearRango(user.rango) + '</td><td><button class="btn btn-primary btn-edit" data-id="' + user._id + '"><i class="bi bi-pencil-square"></i></button> <button class="btn btn-danger btn-remove" data-id="' + user._id + '"><i class="bi bi-trash3-fill"></i></button></td></tr>';
    });
    tableHtml += '</tbody></table>';
    $('.users-table').html(tableHtml);
  }

  function attachEditButtonListeners(users) {
    $('.btn-edit').click(function() {
      var userId = $(this).data('id');
      console.log("Edit user button clicked for user with id: " + userId);
      showEditModal(userId, users);
    });
  }

  function attachRemoveButtonListeners(users) {
    $('.btn-remove').click(function() {
      var userId = $(this).data('id');
      console.log("Remove user button clicked for user with id: " + userId);
      showRemoveModal(userId, users)
      
/*       $.ajax({
        url: '/removeUser',
        type: 'POST',
        data: { idUsuario: userId },
        success: function(response) {
          console.log('User data removed successfully:', response);
          reloadUserList();
        },
        error: function(xhr, status, error) {
          console.error('Error removing user data:', error);
        }
      }); */
    });
  }

  function parsearRango(id_rango) {
    if (id_rango == 0) {
      return 'User';
    } else if (id_rango == 1) {
      return 'Admin';
    }
  }

  function updateUser(userId, updatedUserData) {
    $.ajax({
      url: `${url}/usuarios/findbyid/${userId}`,
      type: 'PUT',
      data: updatedUserData,
      success: function(response) {
        console.log('User data updated successfully:', response);
        $('#edit-user-modal').modal('hide');
        reloadUserList();
      },
      error: function(xhr, status, error) {
        console.error('Error updating user data:', error);
      }
    });
  }

  function showEditModal(userId, users) {
    var userData = getUserData(userId, users);
    if (userData) {
      $('#edit-user-modal .modal-body').html(`
        <h2 id="modal-h2">Edit User</h2>
        <label for="username">Username:</label><br>
        <input type="text" id="username" name="username" value="${userData.nombre}" disabled data-id="${userId}"><br>
        <label for="coins">Coins:</label><br>
        <input type="text" id="coins" name="coins" value="${userData.estadisticas.monedas}"><br>
        <label for="score">Score:</label><br>
        <input type="text" id="score" name="score" value="${userData.estadisticas.puntuacion}"><br>
        <button type="button" id="save-changes-btn-modal" class="btn btn-save">Save changes</button>
        <button type="button" id="cancel-changes-btn-modal" class="btn btn-cancel">Cancel</button>
      `);
      $('#edit-user-modal').modal('show');

      // Manejar clic en el botón 'Save changes' del modal de edición
      $('#save-changes-btn-modal').click(function() {
        var userId = $('#username').data('id');
        var updatedUserData = {
          monedas: $('#coins').val(),
          puntuacion: $('#score').val(),
          idUsuario: userId
        };

        console.log("Save changes button clicked for user with id: " + userId);
        console.log("Updated user data:", updatedUserData);

        // Aquí puedes llamar a tu función de actualización de datos
        updateUser(userId, updatedUserData);
      });

      // Manejar clic en el botón 'Cancel' del modal de edición
      $('#cancel-changes-btn-modal').click(function() {
        console.log("Cancel changes button clicked");
        $('#edit-user-modal').modal('hide');
      });
    } else {
      console.error("User data not found for user with id: " + userId);
    }
  }

  function attachRemoveButtonListeners(users) {
    $('.btn-remove').click(function() {
      var userId = $(this).data('id');
      console.log("Remove user button clicked for user with id: " + userId);
      showRemoveModal(userId, users);
    });
  }

  function showRemoveModal(userId, users) {
    var userData = getUserData(userId, users);
    if (userData) {
      $('#eliminar-modal .modal-body').html('<h2 id="modal-h2">Do you want to remove user: ' + userData.nombre + '?</h2><div class="botones-borrar"><button type="button" id="btn-yes" class="btn btn-danger">Yes</button><button type="button" id="btn-no" class="btn btn-secondary" data-dismiss="modal">No</button></div>');
      $('#eliminar-modal').modal('show');

      $('#btn-yes').click(function() {
        console.log("User removal confirmed for user with id: " + userId);

         $.ajax({
           url: `${url}/usuarios/findbyid/${userId}`,
           type: 'DELETE',
  /*          data: { idUsuario: userId }, */
           success: function(response) {
             console.log('User data removed successfully:', response);
             reloadUserList();
           },
           error: function(xhr, status, error) {
             console.error('Error removing user data:', error);
           }
        });

        // Ocultar el modal después de eliminar
        $('#eliminar-modal').modal('hide');
      });
    } else {
      console.error("User data not found for user with id: " + userId);
    }
  }

  function getUserData(userId, users) {
    for (var i = 0; i < users.length; i++) {
      if (users[i]._id == userId) {
        return users[i];
      }
    }
    return null;
  }

});
