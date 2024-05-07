$(document).ready(function() {
  $.ajax({
    url: '/userList',
    type: 'POST',
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

    console.log(updatedUserData)

    $.ajax({
      url: '/updateUser',
      type: 'POST',
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
      attachRemoveButtonListeners();
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

  function attachRemoveButtonListeners() {
    $('.btn-remove').click(function() {
      var userId = $(this).data('id');
      console.log("Remove user button clicked for user with id: " + userId);
      
      $.ajax({
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
      });
    });
  }

  function parsearRango(id_rango) {
    if (id_rango == 0) {
      return 'User';
    } else if (id_rango == 1) {
      return 'Admin';
    }
  }

  function showEditModal(userId, users) {
    var userData = getUserData(userId, users);
    if (userData) {
      $('#edit-user-modal .modal-body').html('<h2 id="modal-h2">Edit User</h2><label for="username">Username:</label><br><input type="text" id="username" name="username" value="' + userData.nombre + '" disabled data-id="' + userId + '"><br><label for="coins">Coins:</label><br><input type="text" id="coins" name="coins" value="' + userData.estadisticas.monedas + '"><br><label for="score">Score:</label><br><input type="text" id="score" name="score" value="' + userData.estadisticas.puntuacion + '"><br>                <button type="button" id="save-changes-btn" class="btn-save">Save changes</button><button type="button" id="cancel-changes-btn" class="btn-cancel">Cancel</button>');
      $('#edit-user-modal').modal('show');
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
