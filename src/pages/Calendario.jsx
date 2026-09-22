import React, { useMemo, useState } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { AGENDAMENTOS_INICIAIS } from '../data/agendamentos';

// Setup localizer for date-fns
const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date()),
  getDay,
  locales,
});

export default function Calendario({ agendamentos: propAgendamentos, setAgendamentos: propSetAgendamentos }) {
  const [localAgendamentos, setLocalAgendamentos] = useState(AGENDAMENTOS_INICIAIS);

  const agendamentos = propAgendamentos || localAgendamentos;
  const setAgendamentos = propSetAgendamentos || setLocalAgendamentos;

  const events = useMemo(
    () =>
      agendamentos.map((a) => ({
        id: a.id,
        title: `${a.cliente} – ${a.proc}`,
        start: new Date(`${a.data}T${a.hora}`),
        end: (() => {
          const start = new Date(`${a.data}T${a.hora}`);
          const end = new Date(start);
          end.setMinutes(end.getMinutes() + (a.duracao || 60));
          return end;
        })(),
        allDay: false,
      })),
    [agendamentos]
  );

  // Optional: handle click on event
  const handleSelectEvent = (event) => {
    console.log('selected event', event);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Agenda</h2>
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        onSelectEvent={handleSelectEvent}
      />
    </div>
  );
}
