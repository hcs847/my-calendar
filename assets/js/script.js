// checking if there are events in the local storage
var events = JSON.parse(localStorage.getItem("hourly-planner")) || [];

// creating a list of business hours
var hoursOfDay = [];
for (var i = 9; i < 18; i++) {
  var hourStart = moment().startOf("day").add(i, "hours").format("hh:mm a");
  hoursOfDay.push(hourStart);
}

// storing list of events in local storage
var storeEvents = function () {
  if (events.length === 0) {
    setInitialEvents();
  }
  localStorage.setItem("hourly-planner", JSON.stringify(events));
};

// creating an empty list of events to render to the page
var setInitialEvents = function () {
  for (var i = 0; i < 9; i++) {
    events[i] = {
      hour: hourStart,
      description: "",
    };
  }
};

// calculating hours passed since begining of work day
var currentTime = function () {
  var now = moment();
  var startOfDay = moment().startOf("day").add(9, "hours");
  var hoursPassed = now.diff(startOfDay, "hours");
  return hoursPassed;
};

// emptying the HTML before rendering
$("#main").empty();
storeEvents();

// rendering today's date
var currentDay = moment().format("dddd, MMMM Do");
$("#currentDay").text(currentDay);

// traversing through hours of day and redndering events in planner
$.each(hoursOfDay, function (index, hour) {
  renderRow(index, hour, events);
});

// function to render the planner
function renderRow(index, hour, list) {
  var plannerTime = $("<div>").addClass(
    "col-2 d-flex flex-row-reverse align-items-center p-0 border border-left-0"
  );
  var plannerEvent = $("<div>")
    .addClass("col-7 d-flex flex-column p-0 border")
    .attr("event-id", index);
  var plannerCard = $("<div>")
    .addClass("card event-item")
    .css("height", "50px");
  var plannerButton = $("<div>").addClass("col-1 d-flex flex-column p-0");
  var plannerRow = $("<div>")
    .addClass("row no-gutters")
    .attr("row-id", index)
    .css("height", "50px");
  var savedEvent = $("<p>")
    .addClass("event-item card-body m-0")
    .css("height", "50px");
  plannerTime.append(hour);

  // updating events based on saved list
  savedEvent.text(list[index].description);

  plannerCard.append(savedEvent);
  plannerEvent.append(plannerCard);

  updateBackground(index, savedEvent);
  plannerButton.append(
    '<button type="button" class="btn btn-info btn-lg"><span class="fas fa-save"> </span></button>'
  );
  plannerRow.append(plannerTime, plannerEvent, plannerButton);
  $("#main").append(plannerRow);
}

// changing background to red for current hour, grey => previous and green=>upcoming
function updateBackground(index, savedEvent) {
  if (currentTime() === index) {
    savedEvent.addClass("bg-danger");
  }
  if (currentTime() < index) {
    savedEvent.addClass("bg-success");
  }
  if (currentTime() > index) {
    savedEvent.addClass("bg-light");
  }
}

// editing or creating events when clicking on the event's p tag
$(".event-item").on("click", "p", function (event) {
  // prevent default behavior of reloading the page
  event.preventDefault();

  // extracting the text of the selected element
  var text = $(this).text();

  // enabling text input by turning the saved text into editable
  var textInput = $("<textarea>").addClass("form-control").val(text);
  $(this).replaceWith(textInput);

  textInput.trigger("focus");
});

// Saving updates when clicking on the save button
$(".btn").on("click", function (event) {
  // prevent default behavior of reloading the page
  event.preventDefault();

  // getting the value of the event
  var savedIndex = parseInt($(this).closest(".row").attr("row-id"));

  // traversing up to parent and down to relevant child to select the element
  var eventToUpdate = $(this).closest(".row").find("p");

  // extracting the newly entered text
  var savedText = $(this).closest(".row").find("p").text();

  // updating the list of objects with the new saved text
  events[savedIndex].description = savedText;

  // reapplying background conditions
  updateBackground(savedIndex, eventToUpdate);

  // saving changes in local storage
  storeEvents();
});

// automate refresh until end of day and clear before the next day
var auditTime = function () {};
