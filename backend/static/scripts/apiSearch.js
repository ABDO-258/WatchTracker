$(document).ready(function () {
    $('openFormBtn').click(function () {
        $('#search-form').toggle();
    });

    $('#search-form').submit(function (event) {
        event.preventDefault();
        var query = $('#query').val();
        var type = $('#type').val();
        var apiKey = '02b8aead503b7db689db95a3fa599473'; // Replace with your actual API key
        var apiUrl = 'https://api.themoviedb.org/3/search/' + type;
        $.ajax({
            type: 'GET',
            url: apiUrl,
            data: {
                api_key: apiKey,
                query: query
            },
            success: function (response) {
                displayResults(response.results);
            },
            error: function (xhr, status, error) {
                console.error(error);
            }
        });
    });

    function displayResults(results) {
        var resultsDiv = $('#results');
        resultsDiv.empty();
        results.forEach(function (result) {
            var title = result.title || result.name; // Use title for movies, name for TV shows
            var id = result.id;
            var type = result.media_type;
            var listItem = $('<div>').text(title + ' (ID: ' + id + ', Type: ' + type + ')');
            var addButton = $('<button>').text('Add to Watchlist').attr('data-show-id', id);
            listItem.append(addButton);
            resultsDiv.append(listItem);

            // Attach click event listener to the add button
            addButton.click(function () {
                var showId = $(this).attr('data-show-id');
                addShowToWatchlist(showId);
            });
        });
    }

    function addShowToWatchlist(showId) {
        var apiUrl = '/api/watchlist/add/' + showId; // Endpoint for adding show to watchlist
        $.ajax({
            type: 'POST',
            url: apiUrl,
            contentType: 'application/json',
            success: function (response) {
                alert(response.message); // Display success message
            },
            error: function (xhr, status, error) {
                console.error(error);
                alert('Error adding show to watchlist'); // Display error message
            }
        });
    }
});