// checking if there are events in the local storage
var events = JSON.parse(localStorage.getItem("hourly-planner")) || [];

// creating a list of business hours
var hoursOfDay = [];
for (var i = 9; i < 18; i++) {
  var hourStart = moment().startOf("day").add(i, "hours").format("hh:mm a");
  hoursOfDay.push(hourStart);
}

// calculating hours passed since begining of work day
var getHours = function () {
  var now = moment();
  var startOfDay = moment().startOf("day").add(9, "hours");
  var hoursPassed = now.diff(startOfDay, "hours");
  return hoursPassed;
};

// storing list of events in local storage
var storeEvents = function () {
  // when accessing for the first time or on a new day
  // initializing the array of evenet objects
  if (events.length === 0 || getHours() === 0) {
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
    "col-1 d-flex flex-row-reverse align-items-center px-2 border border-left-0"
  );
  var plannerEvent = $("<div>")
    .addClass("col-8 d-flex flex-column p-0 border")
    .attr("event-id", index);
  var plannerCard = $("<div>")
    .addClass("card event-item p-0")
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
  if (getHours() === index) {
    savedEvent.addClass("bg-danger");
  }
  if (getHours() < index) {
    savedEvent.addClass("bg-success");
  }
  if (getHours() > index) {
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
  console.log("this is event To update: ", eventToUpdate);
  // extracting the newly entered text
  var savedText = $(this).closest(".row").find("p").text();

  // updating the list of objects with the new saved text
  events[savedIndex].description = savedText;

  // re-applying background conditions after changing the element
  updateBackground(savedIndex, eventToUpdate);
  // re-applying background conditions after changing the element
  updateBackground(savedIndex, eventToUpdate);

  // saving changes to local storage
  storeEvents();
});

// save changes when leaving the textarea box
$(".event-item").on("blur", "textarea", function () {
  var text = $(this).val().trim();
  var index = $(this).closest(".row").attr("row-id");
  $(this).text(text);
  events[index].description = text;

  // saving changes to local storage
  storeEvents();

  // recreate the p element
  var eventEl = $("<p>")
    .addClass("event-item card-body m-0")
    .css("height", "50px")
    .text(text);

  // replace textarea with p element
  $(this).replaceWith(eventEl);
});

// automate refresh of backgrounds to run every 2 minutes
setInterval(function () {
  $(".event-item p").each(function (index, e) {
    // run the update background function for the selected event
    // which is converted to a jQuery elemnt
    updateBackground(index, $(e));
  });
}, 1000 * 60 * 2);
