var list = JSON.parse(localStorage.getItem('hourly-planner')) || {};

var hoursOfDay = [];
for (var i = 9; i < 18; i++) {
    var hourStart = moment().startOf('day').add(i, 'hours').format('hh:mm a');
    hoursOfDay.push(hourStart);
};

// empty the HTML
$('#main').empty();

var renderRow = function (index, hour, list) {

    var plannerTime = $("<div>").addClass("col-2 d-flex flex-row p-0 border");
    var plannerEvent = $("<div>").addClass("col-7 d-flex flex-column p-0 border bg-light").attr("event-id", index);
    var plannerButton = $("<div>").addClass("col-1 d-flex flex-column p-0");
    var plannerRow = $("<div>")
        .addClass("row no-gutters")
        .attr("row-id", index)
        .css("height", "50px")
        .text(list[index]);
    plannerTime.append(hour);
    plannerEvent.append('<input id="event-input" type="text" class="form-control border-0 bg-light" placeholder="Event Details">');
    plannerButton.append('<button type="button" class="btn btn-info btn-lg"><span class="fas fa-save"> </span></button>');
    plannerRow.append(plannerTime, plannerEvent, plannerButton);
    $("#main").append(plannerRow);

};

$.each(hoursOfDay, function (index, hour) {
    renderRow(index, hour, list);

});

$('.btn').on('click', function (event) {
    // prevent default behavior of reloading the page 
    event.preventDefault();

    // getting the value of the event
    var saveIndex = $(this).closest(".row").attr("row-id");
    var savedText = $("#event-input").val();
    // ----- list.splice(saveIndex, 0, savedText);

    localStorage.setItem("hourly-planner", JSON.stringify(list));
})