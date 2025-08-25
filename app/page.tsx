/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState, useEffect, useCallback } from 'react';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { X, MapPin, Clock, Phone, Link, User, Lock, LogOut } from 'lucide-react';

// 전역 스타일을 위한 스타일 태그 추가
const GlobalStyles = () => (
  <style jsx global>{`
    /* 방안 1: 텍스트 줄바꿈 방지 */
    .festival-box {
      white-space: nowrap !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      display: block !important;
      min-width: 60px !important;
    }
    
    /* 방안 2: Flexbox로 가로 정렬 고정 */
    .fc-daygrid-day-frame {
      display: flex !important;
      flex-direction: column !important;
      min-height: 120px !important;
    }
    
    .festival-container {
      display: flex !important;
      flex-direction: column !important;
      flex-wrap: nowrap !important;
      width: 100% !important;
      gap: 4px !important;
    }
    
    /* 방안 3: 셀 크기 - 스크롤 없이 화면에 맞춤 */
    .fc-daygrid-day {
      min-height: 90px !important;
      /* min-width 제거하여 화면 너비에 맞게 자동 조절 */
    }
    
    /* 작은 화면에서도 레이아웃 유지 */
    @media (max-width: 768px) {
      .festival-box {
        font-size: 10px !important;
        padding: 4px 2px !important;
        min-width: 50px !important;
      }
    }
    
    /* 날짜 번호 스타일 */
    .fc-daygrid-day-number {
      position: absolute !important;
      top: 1px !important;
      bottom: auto !important;
      left: 4px !important;
      right: 4px !important;
      font-weight: 500;
      color: #374151;
    }
    
    /* 버튼 호버 효과 개선 */
    .detail-btn {
      transition: all 0.2s ease;
    }
    
    .detail-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    /* 스크롤바 제거 - 전체 내용이 보이도록 */
    .fc-scroller {
      overflow: visible !important;
    }
    
    .fc-scroller-harness {
      overflow: visible !important;
    }
    
    /* 캘린더 전체 높이 고정 */
    .fc-view-harness {
      min-height: 600px !important;
    }
    
    /* 캘린더 전체 너비 - 스크롤 없이 전체 표시 */
    .fc {
      min-width: 100% !important;
      width: 100% !important;
    }
    
    /* 캘린더 테이블이 전체 너비 사용 */
    .fc-daygrid {
      width: 100% !important;
    }
    
    .fc-daygrid-body {
      width: 100% !important;
    }
    
    /* 테이블 레이아웃 고정 - 셀 너비 균등 분배 */
    .fc-scrollgrid-sync-table {
      width: 100% !important;
      table-layout: fixed !important;
    }
  `}</style>
);

// Festival 타입 정의
interface Festival {
  festival_name: string;
  period?: string;
  region?: string;
  detailed_location?: string;
  contact?: string;
  URL?: string;
}

// 로그인 컴포넌트
function LoginForm({ onLogin }: { onLogin: (username: string) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      if (username === 'test_2025' && password === '1234') {
        onLogin(username);
      } else if (username === 'poi_2025' && password === '4321') {
        onLogin(username);
      } else if (username === 'dynamic_2025' && password === '1234') {
        onLogin(username);
      } else if (username === 'gis_2025' && password === '4321') {
        onLogin(username);
      } else if (username === 'park_2025' && password === '4321') {
        onLogin(username);
      } else {
        setError('아이디 또는 비밀번호가 올바르지 않습니다.');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex justify-center mb-8">
          <img 
            src="https://raw.githubusercontent.com/KIMSANGWOO518/inavi-calendar/main/image/inavi_logo.png" 
            alt="iNavi Logo" 
            className="h-16 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
          공간플랫폼개발그룹<br />축제달력 로그인
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="inline w-4 h-4 mr-1" />
              아이디
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="아이디를 입력하세요"
              required
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Lock className="inline w-4 h-4 mr-1" />
              비밀번호
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="비밀번호를 입력하세요"
              required
              disabled={isLoading}
            />
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </form>
        
        <div className="mt-6 text-right text-sm text-gray-500">
          <p>이용문의: Dynamic팀 김상우</p>
        </div>
      </div>
    </div>
  );
}

// period 문자열을 파싱하여 날짜 배열로 변환
const parsePeriodToDates = (period: string): Date[] => {
  const dates: Date[] = [];
  
  if (period.includes('~')) {
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
    const date = new Date(period);
    if (!isNaN(date.getTime())) {
      dates.push(date);
    }
  }
  
  return dates;
};

// 메인 캘린더 컴포넌트
function FestivalCalendarContent({ currentUser, onLogout }: { currentUser: string; onLogout: () => void }) {
  const [events, setEvents] = useState<never[]>([]);
  const [festivalsByDate, setFestivalsByDate] = useState<{[key: string]: Festival[]}>({});
  const [selectedDate, setSelectedDate] = useState<{date: string; festivals: Festival[]} | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentViewDate, setCurrentViewDate] = useState(new Date());

  const loadFestivalData = useCallback(async () => {
    try {
      const url = 'https://raw.githubusercontent.com/KIMSANGWOO518/inavi-calendar/main/json/festival5.json';
      const response = await fetch(url);
      const data: Festival[] = await response.json();
      
      const festivalsByDateMap: {[key: string]: Festival[]} = {};
      
      data.forEach((festival: Festival) => {
        if (festival.period) {
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
      setEvents([]);
      setLoading(false);
    } catch (error) {
      console.error('축제 데이터 로드 실패:', error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFestivalData();
  }, [loadFestivalData]);

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

  const getCurrentMonthStats = () => {
    const year = currentViewDate.getFullYear();
    const month = currentViewDate.getMonth();
    
    let totalFestivals = 0;
    let festivalDays = 0;
    
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
      <div className="h-full flex flex-col relative" style={{ minHeight: '90px' }}>
        <div className="fc-daygrid-day-number">
          {info.dayNumberText}
        </div>
        
        <div className="flex-1 flex items-end p-1 pb-1">
          {festivalCount > 0 && (
            <div className="festival-container w-full">
              <div className="festival-box bg-blue-500 text-white text-xs text-center py-1 px-1 rounded border border-black font-medium mt-9">
                진행중 {festivalCount}건
              </div>
              
              <button
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  setSelectedDate({
                    date: dateStr,
                    festivals: festivalsForDate
                  });
                  setShowModal(true);
                }}
                className="festival-box detail-btn w-full bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs text-center py-1 px-1 rounded border border-black transition-colors font-medium"
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

  const monthStats = getCurrentMonthStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <GlobalStyles />
      <div style={{ 
        transform: 'scale(1.0)', 
        transformOrigin: 'center',
        width: '100%',
        height: '100%'
      }}>
        <div className="p-4 max-w-full mx-auto">
          {/* 헤더에 로그아웃 버튼 추가 */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <img 
                src="https://raw.githubusercontent.com/KIMSANGWOO518/inavi-calendar/main/image/inavi_logo.png" 
                alt="iNavi Logo" 
                className="mr-2 w-30 h-30 object-contain"
                onError={(e) => {
                  console.error('이미지 로드 실패:', e);
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <h1 className="text-3xl font-bold text-gray-800">공간플랫폼개발그룹 축제달력</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                <User className="inline w-4 h-4 mr-1" />
                {currentUser}님
              </span>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition text-sm font-medium text-gray-700"
              >
                <LogOut className="w-4 h-4" />
                로그아웃
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-visible">
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              editable={false}
              selectable={true}
              events={events}
              dayCellContent={renderDayCellContent}
              dateClick={handleDateClick}
              datesSet={handleDatesSet}
              aspectRatio={1.6}
              contentHeight="auto"
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
    </>
  );
}

// 메인 컴포넌트
export default function FestivalCalendar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<string>('');

  useEffect(() => {
    const savedUser = sessionStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(savedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (username: string) => {
    setCurrentUser(username);
    setIsAuthenticated(true);
    sessionStorage.setItem('currentUser', username);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser('');
    sessionStorage.removeItem('currentUser');
  };

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return <FestivalCalendarContent currentUser={currentUser} onLogout={handleLogout} />;
}