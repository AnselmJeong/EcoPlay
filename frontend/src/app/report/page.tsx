'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { reportAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface GameData {
  round: number;
  donation?: number;
  received_amount?: number;
  return_amount?: number;
  investment?: number;
  current_balance?: number;
  partner_contribution?: number;
}

interface StatsCard {
  title: string;
  value: string;
  unit: string;
  highlight?: boolean;
}

export default function ReportPage() {
  const [publicGoodsData, setPublicGoodsData] = useState<GameData[]>([]);
  const [trustGameReceiverData, setTrustGameReceiverData] = useState<GameData[]>([]);
  const [trustGameTrusteeData, setTrustGameTrusteeData] = useState<GameData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getMedicalRecordNumber, user, loading: authLoading } = useAuth();

  useEffect(() => {
    // Auth 상태가 로딩 중이면 기다림
    if (authLoading) return;
    
    // Auth 로딩이 완료된 후 데이터 로드
    loadGameData();
  }, [authLoading]);

  const loadGameData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 디버깅: 사용자 정보 확인
      console.log('Auth Loading:', authLoading);
      console.log('User:', user);
      console.log('User email:', user?.email);
      
      const medicalRecordNumber = getMedicalRecordNumber();
      console.log('Medical Record Number:', medicalRecordNumber);
      
      if (!medicalRecordNumber) {
        throw new Error('사용자 정보를 찾을 수 없습니다. 다시 로그인해주세요.');
      }

      // 백엔드 API에서 게임 데이터 가져오기
      console.log('백엔드 API에서 데이터 조회 시작...');
      
      try {
        const pgReport = await reportAPI.getPublicGoodsReport();
        console.log('Public Goods Report:', pgReport);
        setPublicGoodsData(pgReport.rounds || []);
      } catch (pgError) {
        console.error('Public Goods 데이터 조회 오류:', pgError);
        setPublicGoodsData([]);
      }

      try {
        const tgReport = await reportAPI.getTrustGameReport();
        console.log('Trust Game Report:', tgReport);
        
        // 역할별로 데이터 분리 - Firebase role 기준
        const trusteeGameData = tgReport.rounds?.filter((round: any) => round.role === 'trustee') || [];
        const trustorGameData = tgReport.rounds?.filter((round: any) => round.role === 'trustor') || [];
        
        console.log('Trustee Game Data (User는 Trustee):', trusteeGameData.length);
        console.log('Trustor Game Data (User는 Trustor):', trustorGameData.length);
        
        setTrustGameReceiverData(trusteeGameData);  // User가 Trustee인 게임 (10라운드)
        setTrustGameTrusteeData(trustorGameData);   // User가 Trustor인 게임 (40라운드)
      } catch (tgError) {
        console.error('Trust Game 데이터 조회 오류:', tgError);
        setTrustGameReceiverData([]);
        setTrustGameTrusteeData([]);
      }

      console.log('모든 데이터 조회 완료');
    } catch (error: any) {
      console.error('Failed to load game data:', error);
      setError(error.message || '게임 데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const calculatePublicGoodsStats = (): StatsCard[] => {
    if (publicGoodsData.length === 0) return [];
    
    const avgDonation = publicGoodsData.reduce((sum, d) => sum + (d.donation || 0), 0) / publicGoodsData.length;
    const avgPartnerContrib = publicGoodsData.reduce((sum, d) => sum + (d.partner_contribution || 0), 0) / publicGoodsData.length / 4;
    const totalEarnings = publicGoodsData.reduce((sum, d) => sum + (d.current_balance || 0), 0);
    const avgEarnings = totalEarnings / publicGoodsData.length;

    return [
      { title: '당신의\n평균 기부액', value: avgDonation.toFixed(0), unit: '포인트' },
      { title: '상대방의\n평균 기부액', value: avgPartnerContrib.toFixed(0), unit: '포인트', highlight: true },
      { title: '당신의\n총 수익', value: totalEarnings.toFixed(1), unit: '포인트' },
      { title: '라운드 당\n평균 수익', value: avgEarnings.toFixed(1), unit: '포인트' },
    ];
  };

  const calculateTrustGameStats = (data: GameData[]): StatsCard[] => {
    if (data.length === 0) return [];
    
    const avgInvestment = data.reduce((sum, d) => sum + (d.investment || 0), 0) / data.length;
    const avgReceived = data.reduce((sum, d) => sum + (d.received_amount || 0), 0) / data.length;
    const avgReturn = data.reduce((sum, d) => sum + (d.return_amount || 0), 0) / data.length;
    const totalEarnings = data.reduce((sum, d) => sum + (d.current_balance || 0), 0);
    const maxBalance = data.length > 0 ? Math.max(...data.map(d => d.current_balance || 0)) : 0;

    return [
      { title: '상대가 보낸\n포인트', value: avgInvestment.toFixed(2), unit: '포인트' },
      { title: '당신이 돌려준\n포인트', value: avgReturn.toFixed(2), unit: '포인트', highlight: true },
      { title: '당신의\n순수익', value: avgReceived.toFixed(0), unit: '포인트' },
      { title: '당신의\n총 수익', value: totalEarnings.toFixed(2), unit: '포인트', highlight: true },
      { title: '당신의\n최고 라운드 수익', value: maxBalance.toFixed(0), unit: '포인트' },
    ];
  };

  // User가 Trustee인 게임 (받아서 돌려주는 역할) 통계
  const calculateTrusteeGameStats = (data: GameData[]): StatsCard[] => {
    if (data.length === 0) return [];
    
    const avgReceived = data.reduce((sum, d) => sum + (d.received_amount || 0), 0) / data.length;
    const avgReturned = data.reduce((sum, d) => sum + (d.return_amount || 0), 0) / data.length;
    const avgKept = data.reduce((sum, d) => sum + (d.current_balance || 0), 0) / data.length;
    const totalKept = data.reduce((sum, d) => sum + (d.current_balance || 0), 0);

    return [
      { title: 'Bot이 보낸\n평균 포인트', value: avgReceived.toFixed(1), unit: '포인트' },
      { title: '당신이 돌려준\n평균 포인트', value: avgReturned.toFixed(1), unit: '포인트', highlight: true },
      { title: '라운드 당\n평균 수익', value: avgKept.toFixed(1), unit: '포인트' },
      { title: '당신의\n총 수익', value: totalKept.toFixed(1), unit: '포인트', highlight: true },
    ];
  };

  // User가 Trustor인 게임 (투자하는 역할) 통계  
  const calculateTrustorGameStats = (data: GameData[]): StatsCard[] => {
    if (data.length === 0) return [];
    
    const avgInvestment = data.reduce((sum, d) => sum + (d.investment || 0), 0) / data.length;
    const avgReceived = data.reduce((sum, d) => sum + (d.received_amount || 0), 0) / data.length;
    const totalProfit = data.reduce((sum, d) => sum + (d.current_balance || 0), 0);
    const avgProfit = totalProfit / data.length;

    return [
      { title: '당신의 평균\n투자 포인트', value: avgInvestment.toFixed(1), unit: '포인트', highlight: true },
      { title: 'Bot이 돌려준\n평균 포인트', value: avgReceived.toFixed(1), unit: '포인트' },
      { title: '당신의\n총 수익', value: totalProfit.toFixed(1), unit: '포인트', highlight: true },
      { title: '라운드 당\n평균 수익', value: avgProfit.toFixed(1), unit: '포인트' },
    ];
  };

  const formatChartData = (data: GameData[], type: 'public-goods' | 'trust-game', gameVersion?: 'trustee' | 'trustor', chartType?: 'left' | 'right') => {
    if (type === 'public-goods') {
      return data.map(d => ({
        round: d.round,
        '당신의 수익': d.current_balance,
        '당신의 기부액': d.donation,
      }));
    } else {
      // Trust Game - 게임 버전과 차트 위치에 따라 다른 데이터 표시
      if (gameVersion === 'trustor') {
        // User가 Trustor인 게임 (투자하는 사람)
        if (chartType === 'left') {
          // 왼쪽 차트: 보낸 포인트와 돌려받은 포인트
          return data.map(d => ({
            round: d.round,
            '보낸 포인트': d.investment,
            '돌려받은 포인트': d.received_amount,
          }));
        } else {
          // 오른쪽 차트: 사용자와 Bot의 순수익 비교
          return data.map(d => ({
            round: d.round,
            '당신의 순손익': d.current_balance,
            'Bot의 순수익': d.investment ? ((d.investment * 3) - (d.received_amount || 0)) : 0, // Bot이 받은 금액(투자액×3) - Bot이 돌려준 금액
          }));
        }
      } else {
        // User가 Trustee인 게임 (받아서 돌려주는 사람)
        if (chartType === 'left') {
          // 왼쪽 차트: 보낸 포인트와 돌려준 포인트
          return data.map(d => ({
            round: d.round,
            '보낸 포인트': d.received_amount,
            '돌려준 포인트': d.return_amount,
          }));
        } else {
          // 오른쪽 차트: 사용자와 Bot의 순수익 비교
          return data.map(d => ({
            round: d.round,
            '당신의 순수익': d.current_balance,
            'Bot의 순수익': d.return_amount ? ((d.return_amount || 0) - ((d.received_amount || 0) / 3)) : -((d.received_amount || 0) / 3), // Bot이 돌려받은 금액 - Bot이 실제 투자한 금액(received_amount/3)
          }));
        }
      }
    }
  };

  if (authLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-lg">인증 상태 확인 중...</div>
        </div>
      </div>
    );
  }

  // 로그인되지 않은 경우
  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-lg text-red-600 mb-4">로그인이 필요합니다</div>
            <div className="text-sm text-gray-600 mb-4">
              게임 결과를 보려면 먼저 로그인해주세요.
            </div>
            <button 
              onClick={() => window.location.href = '/'}
              className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/80"
            >
              메인 페이지로 이동
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-lg">로딩 중...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-lg text-red-600 mb-4">오류가 발생했습니다</div>
            <div className="text-sm text-gray-600 mb-4">{error}</div>
            {/* 디버깅 정보 */}
            <div className="text-xs text-gray-500">
              사용자: {getMedicalRecordNumber()} | 이메일: {user?.email}
            </div>
            <button 
              onClick={loadGameData}
              className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/80"
            >
              다시 시도
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">게임 결과 분석</h1>
        <p className="text-muted-foreground">다양한 신뢰 게임에서 당신의 성과를 분석하여 보여드립니다.</p>
        {/* 디버깅 정보 표시 */}
        <div className="text-xs text-gray-500">
          사용자: {getMedicalRecordNumber()} | 이메일: {user?.email}
        </div>
      </div>

      <Tabs defaultValue="public-goods" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="public-goods">
            Public Goods ({publicGoodsData.length}/10)
          </TabsTrigger>
          <TabsTrigger value="trust-game-receiver">
            신뢰게임 - 당신이 Trustee인 버전 ({trustGameReceiverData.length}/10)
          </TabsTrigger>
          <TabsTrigger value="trust-game-trustee">
            신뢰게임 - 당신이 Trustor인 버전 ({trustGameTrusteeData.length}/40)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="public-goods" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>공공재게임 결과 분석</CardTitle>
              <CardDescription>
                총 {publicGoodsData.length}라운드 완료 (최대 10라운드)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {publicGoodsData.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {calculatePublicGoodsStats().map((stat, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg text-center ${
                          stat.highlight 
                            ? 'bg-purple-200 text-purple-800' 
                            : 'bg-purple-100 text-purple-700'
                        }`}
                      >
                        <div className="text-sm font-medium whitespace-pre-line mb-2">
                          {stat.title}
                        </div>
                        <div className="text-2xl font-bold">
                          {stat.value} <span className="text-sm font-normal">{stat.unit}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold">당신의 기부액과 수익</h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={formatChartData(publicGoodsData, 'public-goods')}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="round" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="당신의 수익" 
                            stroke="#8b5cf6" 
                            strokeWidth={2}
                            dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="당신의 기부액" 
                            stroke="#06b6d4" 
                            strokeWidth={2}
                            dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">아직 플레이한 게임이 없습니다.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trust-game-receiver" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>신뢰 게임 - 당신이 Trustee인 버전</CardTitle>
              <CardDescription>
                총 {trustGameReceiverData.length}라운드 완료 (최대 10라운드) - Bot이 투자하고 당신이 받아서 돌려주는 게임
              </CardDescription>
            </CardHeader>
            <CardContent>
              {trustGameReceiverData.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                    {calculateTrusteeGameStats(trustGameReceiverData).map((stat, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg text-center ${
                          stat.highlight 
                            ? 'bg-purple-200 text-purple-800' 
                            : 'bg-purple-100 text-purple-700'
                        }`}
                      >
                        <div className="text-sm font-medium whitespace-pre-line mb-2">
                          {stat.title}
                        </div>
                        <div className="text-xl font-bold">
                          {stat.value} <span className="text-sm font-normal">{stat.unit}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">보낸 포인트와 돌려준 포인트</h3>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={formatChartData(trustGameReceiverData, 'trust-game', 'trustee', 'left')}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="round" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line 
                              type="monotone" 
                              dataKey="보낸 포인트" 
                              stroke="#ef4444" 
                              strokeWidth={2}
                              dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="돌려준 포인트" 
                              stroke="#8b5cf6" 
                              strokeWidth={2}
                              dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4">당신과 Bot의 순수익 비교</h3>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={formatChartData(trustGameReceiverData, 'trust-game', 'trustee', 'right')}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="round" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line 
                              type="monotone" 
                              dataKey="당신의 순수익" 
                              stroke="#ef4444" 
                              strokeWidth={2}
                              dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="Bot의 순수익" 
                              stroke="#10b981" 
                              strokeWidth={2}
                              dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">아직 플레이한 게임이 없습니다.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trust-game-trustee" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>신뢰 게임 - 당신이 Trustor인 버전</CardTitle>
              <CardDescription>
                총 {trustGameTrusteeData.length}라운드 완료 (최대 40라운드) - 당신이 투자하고 Bot이 받아서 돌려주는 게임
              </CardDescription>
            </CardHeader>
            <CardContent>
              {trustGameTrusteeData.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                    {calculateTrustorGameStats(trustGameTrusteeData).map((stat, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg text-center ${
                          stat.highlight 
                            ? 'bg-purple-200 text-purple-800' 
                            : 'bg-purple-100 text-purple-700'
                        }`}
                      >
                        <div className="text-sm font-medium whitespace-pre-line mb-2">
                          {stat.title}
                        </div>
                        <div className="text-xl font-bold">
                          {stat.value} <span className="text-sm font-normal">{stat.unit}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">보낸 포인트와 돌려받은 포인트</h3>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={formatChartData(trustGameTrusteeData, 'trust-game', 'trustor', 'left')}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                              dataKey="round" 
                              type="number"
                              scale="linear"
                              domain={['dataMin', 'dataMax']}
                            />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line 
                              type="monotone" 
                              dataKey="보낸 포인트" 
                              stroke="#ef4444" 
                              strokeWidth={2}
                              dot={{ fill: '#ef4444', strokeWidth: 2, r: 3 }}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="돌려받은 포인트" 
                              stroke="#8b5cf6" 
                              strokeWidth={2}
                              dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 3 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4">당신과 Bot의 순수익 비교</h3>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={formatChartData(trustGameTrusteeData, 'trust-game', 'trustor', 'right')}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                              dataKey="round" 
                              type="number"
                              scale="linear"
                              domain={['dataMin', 'dataMax']}
                            />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line 
                              type="monotone" 
                              dataKey="당신의 순손익" 
                              stroke="#ef4444" 
                              strokeWidth={2}
                              dot={{ fill: '#ef4444', strokeWidth: 2, r: 3 }}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="Bot의 순수익" 
                              stroke="#10b981" 
                              strokeWidth={2}
                              dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">아직 플레이한 게임이 없습니다.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 