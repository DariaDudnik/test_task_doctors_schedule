import { useRef } from 'react';

const normalThrottle = (fn, delay) => {
  let cachedArgs = [];
  let timeout = null;

  return function (...args) {
    cachedArgs = args;

    if (timeout) {
      return;
    }

    timeout = setTimeout(() => {
      timeout = null;
      fn(...cachedArgs);
    }, delay);
  };
}

export function useThrottle(fn, delay) {
  return useRef(normalThrottle(fn, delay)).current;
}
