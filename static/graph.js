$(document).ready(function() {

    $(document).on('click', ".databut", function() {
        $('.data').show();
        $('.data_add').hide();
        $('.data_delete').hide();

    });
    $(document).on('click', ".add_data", function() {
        $('.data').hide();
        $('.data_add').show();
        $('.data_delete').hide();

    });
    $(document).on('click', ".del", function() {
        $('.data').hide();
        $('.data_add').hide();
        $('.data_delete').show();

    });


});