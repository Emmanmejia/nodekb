$(document).ready(function(){
  $('.delete-admin-product').on('click', function(e){
    $target = $(e.target);
    const id = $target.attr('data-id');

    var confirmation = confirm('Are You Sure?');

    if(confirmation){
      $.ajax({
        type:'DELETE',
        url: '/products/'+id,
        success: function(response){
          window.location.href='/admins/products';
        },
        error: function(err){
          console.log(err);
        }
      });
    } else {
      return false;
    }
  });
});

$(document).ready(function(){
  $('.delete-merchant-product').on('click', function(e){
    $target = $(e.target);
    const id = $target.attr('data-id');

    var confirmation = confirm('Are You Sure?');

    if(confirmation){
      $.ajax({
        type:'DELETE',
        url: '/products/'+id,
        success: function(response){
          window.location.href='/merchants/products';
        },
        error: function(err){
          console.log(err);
        }
      });
    } else {
      return false;
    }
  });
});

$(document).ready(function(){
  $('.approve-product').on('click', function(e){
    $target = $(e.target);
    const id = $target.attr('data-id');

    var confirmation = confirm('Are You Sure?');

    if(confirmation){
      $.ajax({
        type:'POST',
        url: '/products/approve/'+id,
        success: function(response){
          window.location.href='/admins/products';
        },
        error: function(err){
          console.log(err);
        }
      });
    } else {
      return false;
    }
  });
});

$(function(){
  $('[data-toggle="tooltip"]').tooltip()
})

$('#myModal').on('shown.bs.modal', function () {
  $('#myInput').trigger('focus')
})
