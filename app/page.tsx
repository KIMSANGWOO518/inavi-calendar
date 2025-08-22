/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState, useEffect, useCallback } from 'react';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { Calendar, X, MapPin, Clock, Phone, Link } from 'lucide-react';

// Festival 타입 정의
interface Festival {
  festival_name: string;
  period?: string;
  region?: string;
  detailed_location?: string;
  contact?: string;
  URL?: string;
}

// period 문자열을 파싱하여 날짜 배열로 변환 (컴포넌트 외부에 선언)
const parsePeriodToDates = (period: string): Date[] => {
  const dates: Date[] = [];
  
  // 다양한 period 형식 처리
  if (period.includes('~')) {
    // "2024-01-01 ~ 2024-01-03" 형식
    const [startStr, endStr] = period.split('~').map((s: string) => s.trim());
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

export default function FestivalCalendar() {
  const [events, setEvents] = useState<never[]>([]);
  const [festivalsByDate, setFestivalsByDate] = useState<{[key: string]: Festival[]}>({});
  const [selectedDate, setSelectedDate] = useState<{date: string; festivals: Festival[]} | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentViewDate, setCurrentViewDate] = useState(new Date());

  // loadFestivalData를 useCallback으로 감싸서 의존성 문제 해결
  const loadFestivalData = useCallback(async () => {
    try {
      const url = 'https://raw.githubusercontent.com/KIMSANGWOO518/inavi-calendar/main/json/festival5.json';
      const response = await fetch(url);
      const data: Festival[] = await response.json();
      
      // period를 기준으로 날짜별로 축제 데이터 그룹화
      const festivalsByDateMap: {[key: string]: Festival[]} = {};
      
      data.forEach((festival: Festival) => {
        if (festival.period) {
          // period에서 날짜 범위를 파싱
          const dateRange = parsePeriodToDates(festival.period);
          
          dateRange.forEach((date: Date) => {
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
  }, []); // 의존성 배열 추가

  useEffect(() => {
    loadFestivalData();
  }, [loadFestivalData]); // loadFestivalData를 의존성에 추가

  // handleDateClick 함수를 실제로 사용 (FullCalendar의 dateClick 이벤트에 연결)
  const handleDateClick = (info: { dateStr: string }) => {
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

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // getCurrentMonthStats 함수를 실제로 사용 (통계 표시용)
  const getCurrentMonthStats = () => {
    const year = currentViewDate.getFullYear();
    const month = currentViewDate.getMonth();
    
    let totalFestivals = 0;
    let festivalDays = 0;
    
    // 해당 월의 모든 날짜 확인
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toISOString().split('T')[0];
      const festivalsForDate = festivalsByDate[dateStr];
      
      if (festivalsForDate && festivalsForDate.length > 0) {
        totalFestivals += festivalsForDate.length;
        festivalDays++;
      }
    }
    
    return { totalFestivals, festivalDays };
  };

  const renderDayCellContent = (info: { date: Date; dayNumberText: string }) => {
    const dateStr = info.date.toISOString().split('T')[0];
    const festivalsForDate = festivalsByDate[dateStr];
    const festivalCount = festivalsForDate ? festivalsForDate.length : 0;
    
    return (
      <div className="h-full flex flex-col relative" style={{ minHeight: '100px' }}>
        {/* 날짜 숫자 - 왼쪽 상단 */}
        <div className="absolute top-1 left-0 font-medium text-gray-800 text-sm">
          {info.dayNumberText}
        </div>
        
        {/* 축제 정보 표시 영역 - 하단에 블럭으로 쌓기 */}
        <div className="flex-1 flex flex-col px-8 py-8 pt-12 pb-0 -mb-8">
          {festivalCount > 0 && (
            <div className="space-y-1 mt-auto">
              {/* 진행중 00건 */}
              <div className="bg-blue-500 text-white text-xs text-center py-2 px-2 rounded border border-black font-medium">
                진행중 {festivalCount}건
              </div>
              
              {/* 상세정보 버튼 */}
              <button
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  setSelectedDate({
                    date: dateStr,
                    festivals: festivalsForDate
                  });
                  setShowModal(true);
                }}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs text-center py-2 px-2 rounded border border-black transition-colors font-medium"
              >
                상세정보
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const handleDatesSet = (dateInfo: { view: { currentStart: Date } }) => {
    setCurrentViewDate(dateInfo.view.currentStart);
  };

  // 현재 월 통계 가져오기
  const monthStats = getCurrentMonthStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div style={{ 
      transform: 'scale(1.0)', 
      transformOrigin: 'center',
      width: '100%',
      height: '100%'
    }}>
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
            dayCellContent={renderDayCellContent}
            dateClick={handleDateClick}
            datesSet={handleDatesSet}
            height={800}
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
                {selectedDate.festivals.map((festival: Festival, index: number) => (
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
          
                      {festival.URL && (
                        <div className="flex items-center">
                          <Link size={16} className="mr-2 text-gray-500" />
                          <a
                            href={festival.URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            페이지로 이동
                          </a>
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
    </div>
  );
}