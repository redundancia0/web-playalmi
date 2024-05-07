$('#downloadButton').click(function() {
  $(this).addClass('loading').text(`Downloading...`);
  setTimeout(function() {
    window.location.href = '/downloads/FactorySurfer.zip';
    $('#downloadButton').removeClass('loading').text('Download');
  }, 1200);;
});