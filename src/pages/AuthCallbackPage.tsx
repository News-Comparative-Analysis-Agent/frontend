import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const AuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // 1. URL 쿼리 파라미터에서 토큰 추출 (서버에서 'token' 또는 'accessToken'으로 보내준다고 가정)
    const token = searchParams.get('token') || searchParams.get('accessToken');

    if (token) {
      // 2. localStorage에 토큰 저장
      localStorage.setItem('accessToken', token);
      console.log('로그인 성공: 토큰이 저장되었습니다.');
      
      // 3. 메인 페이지로 이동
      navigate('/');
    } else {
      console.error('로그인 실패: 토큰이 URL에 없습니다.');
      // 실패 시 로그인 페이지로 다시 이동
      navigate('/login');
    }
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-slate-600 font-medium">로그인 처리 중입니다...</p>
      </div>
    </div>
  );
};

export default AuthCallbackPage;
