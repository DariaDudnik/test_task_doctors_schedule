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
      console.log('timeout fired')
      timeout = null;
      fn(...cachedArgs);
    }, delay);
  };
}

export function useThrottle(fn, delay) {
  const fun = useRef(normalThrottle(fn, delay)).current;

  return (...args) => {
    console.log('using my throttle')
    return fun(...args);
  }
}
