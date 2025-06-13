"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Clock, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getGameProgress } from '@/services/gameService';

interface GameProgressProps {
  className?: string;
}

export default function GameProgress({ className = "" }: GameProgressProps) {
  const [progressData, setProgressData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { getMedicalRecordNumber } = useAuth();

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const medicalRecordNumber = getMedicalRecordNumber();
        if (!medicalRecordNumber) {
          setIsLoading(false);
          return;
        }

        const progress = await getGameProgress(medicalRecordNumber);
        setProgressData(progress);
      } catch (error) {
        console.error('게임 진행률 로딩 오류:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProgress();
  }, [getMedicalRecordNumber]);

  if (isLoading) {
    return (
      <Card className={`animate-pulse ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            게임 진행률
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!progressData) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            게임 진행률
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">진행률 정보를 불러올 수 없습니다.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`shadow-lg ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <TrendingUp className="w-5 h-5" />
          나의 게임 진행률
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 전체 진행률 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">전체 진행률</span>
            <Badge variant={progressData.overall.percentage === 100 ? "default" : "secondary"}>
              {progressData.overall.percentage}%
            </Badge>
          </div>
          <Progress value={progressData.overall.percentage} className="h-3" />
          <p className="text-xs text-gray-500">
            {progressData.overall.completed} / {progressData.overall.total} 라운드 완료
          </p>
        </div>

        {/* 신뢰 게임 진행률 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <Users className="w-4 h-4" />
              신뢰 게임
            </span>
            <Badge variant={progressData.trustGame.percentage === 100 ? "default" : "outline"}>
              {progressData.trustGame.percentage}%
            </Badge>
          </div>
          <Progress value={progressData.trustGame.percentage} className="h-2" />
          <p className="text-xs text-gray-500">
            {progressData.trustGame.completed} / {progressData.trustGame.total} 라운드 완료
          </p>
        </div>

        {/* 공공재 게임 진행률 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <Clock className="w-4 h-4" />
              공공재 게임
            </span>
            <Badge variant={progressData.publicGoods.percentage === 100 ? "default" : "outline"}>
              {progressData.publicGoods.percentage}%
            </Badge>
          </div>
          <Progress value={progressData.publicGoods.percentage} className="h-2" />
          <p className="text-xs text-gray-500">
            {progressData.publicGoods.completed} / {progressData.publicGoods.total} 라운드 완료
          </p>
        </div>

        {/* 완료 상태 */}
        {progressData.overall.percentage === 100 && (
          <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-800">
              모든 게임을 완료했습니다!
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 