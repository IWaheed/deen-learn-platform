import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn utility', () => {
  it('merges basic classes correctly', () => {
    expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white');
  });

  it('resolves tailwind conflicts correctly', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });

  it('handles conditional classes', () => {
    expect(cn('base-class', true && 'active', false && 'inactive')).toBe('base-class active');
  });

  it('handles objects for conditional classes', () => {
    expect(cn('base', { active: true, inactive: false })).toBe('base active');
  });

  it('handles arrays of classes', () => {
    expect(cn(['bg-red-500', 'text-white'], 'p-4')).toBe('bg-red-500 text-white p-4');
  });

  it('ignores null and undefined values', () => {
    expect(cn('base', null, undefined, 'active')).toBe('base active');
  });
});
