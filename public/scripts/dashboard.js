var ran = false;
function openCal() {
  if(ran) return;
  var calendarEl = document.getElementById('calendar');
  var projectName = document.getElementById('project-name');
  console.log(projectName);
  var calendar = new FullCalendar.Calendar(calendarEl, {
    plugins: [ 'interaction', 'resourceTimeline' ],
    timeZone: 'UTC',
    defaultView: 'resourceTimelineDay',
    aspectRatio: 1,
    header: {
      left: 'prev,next',
      center: 'title',
      right: 'resourceTimelineDay'
    },
    // defaultDate: '2016-01-07',
    minTime: '10:00:00',
    maxTime: '20:00:00',
    editable: true,
    resourceLabelText: 'Users',
    resources: 'http://localhost:3000/dummyUser', // for users
    events: 'http://localhost:3000/dummyTask' // task associate with user
  });
  calendar.render();
  ran = true;
}
document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('#todays-task');
  var instances = M.Modal.init(elems, {
    onOpenEnd: function() {
      openCal();
    }
  });
});
// create form
document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('#create-project');
  var instances = M.Modal.init(elems);
});
// get all project modal
document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('#all_project');
  // make an ajax request
  console.log(elems[0]);
  var instances = M.Modal.init(elems);
});