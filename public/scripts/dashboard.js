document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');
  
    var calendar = new FullCalendar.Calendar(calendarEl, {
      plugins: [ 'interaction', 'resourceTimeline' ],
      timeZone: 'UTC',
      defaultView: 'resourceTimelineDay',
      aspectRatio: 1.5,
      header: {
        left: 'prev,next',
        center: 'title',
        right: 'resourceTimelineDay,resourceTimelineWeek,resourceTimelineMonth'
      },
      editable: true,
      resourceLabelText: 'Rooms',
      resources: 'https://fullcalendar.io/demo-resources.json?with-nesting&with-colors',
      events: 'https://fullcalendar.io/demo-events.json?single-day&for-resource-timeline'
    });
  
    calendar.render();
  });