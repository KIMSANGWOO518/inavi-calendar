'use client'

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'

const sampleEvents = [
  {
    title: '부산 축제',
    date: '2025-06-25',
    extendedProps: {
      location: '해운대 해수욕장',
      description: '부산에서 열리는 여름 대표 축제입니다.',
      url: 'https://www.naver.com'
    }
  },
  {
    title: '불꽃 축제',
    date: '2025-06-10',
    extendedProps: {
      location: '여의도 한강공원',
      description: '세계 불꽃 팀이 참가하는 대규모 불꽃놀이 이벤트.',
      url: 'https://www.naver.com'
    }
  }
];

export default function Home() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">축제 캘린더</h1>
      
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        editable={true}
        selectable={true}
        events={sampleEvents}
        
        // 커서 올렸을 때 툴팁 설정
          eventDidMount={(info) => {
  const { location, description, url } = info.event.extendedProps;
  if (location || description) {
    tippy(info.el, {
      content: `<strong>${info.event.title}</strong><br/>📍 ${location}<br/>📝 ${description}<br/>📝<a
  href=${url}
  target="_blank"
  rel="noopener noreferrer"
  className="text-blue-500 hover:underline"
>
  ${url}
</a>`,
      allowHTML: true,
      placement: 'top',
      delay: [0, 0],           
      hideOnClick: true,       
      interactive: true,       
    });

}}}

      />
    </div>
  );
}
