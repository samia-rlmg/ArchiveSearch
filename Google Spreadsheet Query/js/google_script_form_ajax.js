var $form = $('form#test-form'),
    url = 'https://script.google.com/macros/s/AKfycbyTOeGuAxEcoBu_oWWAtXH-oKDvQVxbv1bhM7PkkT3SvYIC_3Q/exec?field1=a'

$('#submit-form').on('click', function(e) {
  e.preventDefault();
  var jqxhr = $.ajax({
    url: url,
    method: "GET",
    dataType: "json",
    data: $form.serializeObject()
  }).success(
    console.log("Success")
  );
})
