"use client";

import boyAvatar from '../../resource/boy.png';
import botAvatar from '../../resource/bot.png';
import girlAvatar from '../../resource/girl.png';

import { useParticipantGender } from '@/hooks/useParticipantGender';
import { cn } from '@/lib/utils';

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

type GameAvatarProps = {
  alt: string;
  className?: string;
  imageClassName?: string;
  fallbackClassName?: string;
};

export function ParticipantAvatar({
  alt,
  className,
  imageClassName,
  fallbackClassName,
}: GameAvatarProps) {
  const gender = useParticipantGender();
  const avatarSrc = gender === 'female' ? girlAvatar.src : boyAvatar.src;

  return (
    <Avatar className={cn('overflow-hidden', className)}>
      <AvatarImage src={avatarSrc} alt={alt} className={cn('object-cover', imageClassName)} />
      <AvatarFallback className={cn('bg-[#ffe2d6] text-[#ff7a3c]', fallbackClassName)}>
        U
      </AvatarFallback>
    </Avatar>
  );
}

export function BotAvatar({
  alt,
  className,
  imageClassName,
  fallbackClassName,
}: GameAvatarProps) {
  return (
    <Avatar className={cn('overflow-hidden', className)}>
      <AvatarImage src={botAvatar.src} alt={alt} className={cn('object-cover', imageClassName)} />
      <AvatarFallback className={cn('bg-[#dde8ff] text-[#245fd1]', fallbackClassName)}>
        B
      </AvatarFallback>
    </Avatar>
  );
}
