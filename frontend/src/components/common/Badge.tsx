import React from 'react';

interface BadgeProps {
  variant:
    | 'critical'
    | 'warning'
    | 'passed'
    | 'fail'
    | 'corrected'
    | 'added'
    | 'updated'
    | 'needs_note'
    | 'not_submitted'
    | 'blocking';
  label?: string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant, label, className = '' }) => {
  switch (variant) {
    case 'critical':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200/60 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
          {label || 'Critical'}
        </span>
      );

    case 'warning':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100/90 text-amber-800 border border-amber-200 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          {label || 'Warning'}
        </span>
      );

    case 'passed':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
          {label || 'Passed'}
        </span>
      );

    case 'fail':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-red-50 text-red-600 border border-red-200 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
          {label || 'Fail'}
        </span>
      );

    case 'corrected':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
          {label || 'Corrected'}
        </span>
      );

    case 'added':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
          {label || 'Added'}
        </span>
      );

    case 'updated':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
          {label || 'Updated'}
        </span>
      );

    case 'needs_note':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
          {label || 'Needs note'}
        </span>
      );

    case 'not_submitted':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
          {label || 'Not submitted'}
        </span>
      );

    case 'blocking':
      return (
        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
          {label || 'Blocking'}
        </span>
      );

    default:
      return null;
  }
};

