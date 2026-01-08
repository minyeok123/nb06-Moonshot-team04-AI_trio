import axios from 'axios';

const GOOGLE_CALENDAR_API = 'https://www.googleapis.com/calendar/v3';

export class GoogleCalendar {
  static createCalendarEvent = async (
    accessToken: string,
    task: {
      title: string;
      description: string;
      startDate: Date;
      endDate: Date;
    },
  ) => {
    const event = {
      summary: task.title,
      description: task.description,
      start: { dateTime: task.startDate.toISOString() },
      end: { dateTime: task.endDate.toISOString() },
    };
    const res = await axios.post(`${GOOGLE_CALENDAR_API}/calendars/primary/events`, event, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res.data;
  };

  static updateCalendarEvent = async (
    accessToken: string,
    calendarEventId: string,
    task: {
      title: string;
      description: string;
      startDate: Date;
      endDate: Date;
    },
  ) => {
    const res = await axios.put(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events/${calendarEventId}`,
      {
        summary: task.title,
        description: task.description,
        start: { dateTime: task.startDate.toISOString() },
        end: { dateTime: task.endDate.toISOString() },
      },
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
    return res.data;
  };

  static deleteCalendarEvent = async (accessToken: string, calendarEventId: string) => {
    await axios.delete(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events/${calendarEventId}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );
  };
}
