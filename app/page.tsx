'use client'

import React, { useState, useEffect } from 'react';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { Calendar, X, MapPin, Clock, Phone } from 'lucide-react';

export default function FestivalCalendar() {
  const [events, setEvents] = useState([]);
  const [festivalsByDate, setFestivalsByDate] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFestivalData();
  }, []);

  const loadFestivalData = async () => {
    try {
      const url = 'https://raw.githubusercontent.com/KIMSANGWOO518/inavi-calendar/main/festival.json';
      const response = await fetch(url);
      const data = await response.json();
      
      // period를 기준으로 날짜별로 축제 데이터 그룹화
      const festivalsByDateMap = {};
      
      data.forEach((festival) => {
        if (festival.period) {
          // period에서 날짜 범위를 파싱
          const dateRange = parsePeriodToDates(festival.period);
          
          dateRange.forEach(date => {
            const dateStr = date.toISOString().split('T')[0];
            
            if (!festivalsByDateMap[dateStr]) {
              festivalsByDateMap[dateStr] = [];
            }
            
            festivalsByDateMap[dateStr].push(festival);
          });
        }
      });
      
      setFestivalsByDate(festivalsByDateMap);
      setEvents([]); // 이벤트 표시 제거
      setLoading(false);
    } catch (error) {
      console.error('축제 데이터 로드 실패:', error);
      setLoading(false);
    }
  };

  // period 문자열을 파싱하여 날짜 배열로 변환
  const parsePeriodToDates = (period) => {
    const dates = [];
    
    // 다양한 period 형식 처리
    if (period.includes('~')) {
      // "2024-01-01 ~ 2024-01-03" 형식
      const [startStr, endStr] = period.split('~').map(s => s.trim());
      const startDate = new Date(startStr);
      const endDate = new Date(endStr);
      
      if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
          dates.push(new Date(currentDate));
          currentDate.setDate(currentDate.getDate() + 1);
        }
      }
    } else if (period.includes('-')) {
      // "2024-01-01" 형식 (단일 날짜)
      const date = new Date(period);
      if (!isNaN(date.getTime())) {
        dates.push(date);
      }
    }
    
    return dates;
  };

  const handleDateClick = (info) => {
    const dateStr = info.dateStr;
    const festivalsForDate = festivalsByDate[dateStr];
    
    if (festivalsForDate && festivalsForDate.length > 0) {
      setSelectedDate({
        date: dateStr,
        festivals: festivalsForDate
      });
      setShowModal(true);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderDayCellContent = (info) => {
    const dateStr = info.date.toISOString().split('T')[0];
    const festivalsForDate = festivalsByDate[dateStr];
    
    return (
      <div className="relative h-full">
        <div className="text-center">
          {info.dayNumberText}
        </div>
        {festivalsForDate && festivalsForDate.length > 0 && (
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
            <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
              {festivalsForDate.length}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex items-center mb-6">
        <Calendar className="mr-2 text-blue-600" size={32} />
        <h1 className="text-3xl font-bold text-gray-800">축제 캘린더</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          editable={false}
          selectable={true}
          events={events}
          dateClick={handleDateClick}
          dayCellContent={renderDayCellContent}
          height="auto"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth'
          }}
          locale="ko"
          dayMaxEvents={false}
          moreLinkText="더보기"
        />
      </div>

      {/* 축제 목록 모달 */}
      {showModal && selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold text-gray-800">
                {formatDate(selectedDate.date)} 축제 목록
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              {selectedDate.festivals.map((festival, index) => (
                <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <h3 className="font-semibold text-lg text-gray-800 mb-2">
                    {festival.festival_name}
                  </h3>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    {festival.period && (
                      <div className="flex items-center">
                        <Clock size={16} className="mr-2 text-gray-500" />
                        <span>{festival.period}</span>
                      </div>
                    )}

                    {festival.region && (
                      <div className="flex items-center">
                        <MapPin size={16} className="mr-2 text-gray-500" />
                        <span>{festival.region}</span>
                      </div>
                    )}
                    
                    {festival.detailed_location && (
                      <div className="flex items-start">
                        <MapPin size={16} className="mr-2 text-gray-500 mt-0.5" />
                        <span>{festival.detailed_location}</span>
                      </div>
                    )}
                    
                    {festival.contact && (
                      <div className="flex items-center">
                        <Phone size={16} className="mr-2 text-gray-500" />
                        <span>{festival.contact}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}