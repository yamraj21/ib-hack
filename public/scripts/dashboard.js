var ran = false;
function openCal() {
  if(ran) return;
  var calendarEl = document.getElementById('calendar');

  var calendar = new FullCalendar.Calendar(calendarEl, {
    plugins: [ 'interaction', 'resourceTimeline' ],
    timeZone: 'UTC',
    defaultView: 'resourceTimelineDay',
    aspectRatio: 1,
    header: {
      left: 'prev,next',
      center: 'title',
      right: 'resourceTimelineDay,resourceTimelineWeek,resourceTimelineMonth'
    },
    defaultDate: '2016-01-07',
    editable: true,
    resourceLabelText: 'Users',
    resources: 'http://localhost:3000/dummyUser',
    events: 'http://localhost:3000/dummyTask'
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