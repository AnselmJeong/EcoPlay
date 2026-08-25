"use client";

import { Blobatar } from '@blobatar/react';

import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

type GameAvatarProps = {
  alt: string;
  className?: string;
  imageClassName?: string;
  name?: string;
};

export function ParticipantAvatar({
  alt,
  className,
  imageClassName,
}: GameAvatarProps) {
  const { getMedicalRecordNumber } = useAuth();
  const participantId = getMedicalRecordNumber() ?? 'participant';

  return (
    <div
      className={cn(
        'relative isolate h-14 w-14 shrink-0 scale-[1.12] rounded-[34%] border-[3px] border-emerald-400 bg-white/95 p-0.5 shadow-[0_0_0_3px_rgba(255,255,255,0.95),0_14px_30px_rgba(16,185,129,0.3)]',
        className
      )}
    >
      <div
        aria-hidden="true"
        className="absolute -inset-2 -z-10 rounded-[42%] bg-emerald-300/24 blur-md"
      />
      <Blobatar
        name={`ecoplay-participant-${participantId}`}
        animate="always"
        background={false}
        palette={{ head: '#25c77a', eye: '#063b2a' }}
        title={alt}
        className={cn('h-full w-full drop-shadow-[0_6px_8px_rgba(6,95,70,0.2)]', imageClassName)}
      />
      <span
        aria-hidden="true"
        className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-emerald-400 shadow-[0_2px_7px_rgba(16,185,129,0.45)]"
      />
    </div>
  );
}

export function BotAvatar({
  alt,
  className,
  imageClassName,
  name,
}: GameAvatarProps) {
  return (
    <div
      className={cn(
        'relative isolate h-14 w-14 shrink-0 rounded-[34%] border-[3px] border-slate-200 bg-white/92 p-0.5 shadow-[0_12px_24px_rgba(66,86,110,0.2)] transition-transform duration-200 hover:-translate-y-0.5 hover:scale-105',
        className
      )}
    >
      <div
        aria-hidden="true"
        className="absolute -inset-1.5 -z-10 rounded-[40%] bg-slate-300/20 blur-md"
      />
      <Blobatar
        name={`ecoplay-bot-${name ?? alt}`}
        animate="hover"
        background={false}
        title={alt}
        className={cn('h-full w-full drop-shadow-[0_5px_7px_rgba(51,65,85,0.18)]', imageClassName)}
      />
    </div>
  );
}
