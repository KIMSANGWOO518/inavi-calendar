/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState, useEffect, useCallback } from 'react';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { X, MapPin, Clock, Phone, Link, User, Lock, LogOut } from 'lucide-react';

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

    // 여기서 실제 인증 로직을 구현합니다
    // 예시: 간단한 하드코딩된 인증 (실제로는 API 호출)
    setTimeout(() => {
      if (username === 'test_2025' && password === '1234') {
        onLogin(username);
      } else if (username === 'poi_2025' && password === '1234') {
        onLogin(username);
      } else if (username === 'dynamic_2025' && password === '1234') {
        onLogin(username);
      } else if (username === 'gis_2025' && password === '1234') {
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
      <div className="h-full flex flex-col relative" style={{ minHeight: '100px' }}>
        <div className="absolute top-1 left-0 font-medium text-gray-800 text-sm">
          {info.dayNumberText}
        </div>
        
        <div className="flex-1 flex flex-col px-8 py-8 pt-12 pb-0 -mb-8">
          {festivalCount > 0 && (
            <div className="space-y-1 mt-auto">
              <div className="bg-blue-500 text-white text-xs text-center py-2 px-2 rounded border border-black font-medium">
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

// 메인 컴포넌트
export default function FestivalCalendar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<string>('');

  // 컴포넌트 마운트 시 로컬스토리지에서 인증 상태 확인
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
    // 세션스토리지에 저장 (브라우저 탭 닫으면 자동 로그아웃)
    sessionStorage.setItem('currentUser', username);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser('');
    sessionStorage.removeItem('currentUser');
  };

  // 인증되지 않은 경우 로그인 폼 표시
  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  // 인증된 경우 캘린더 표시
  return <FestivalCalendarContent currentUser={currentUser} onLogout={handleLogout} />;
}