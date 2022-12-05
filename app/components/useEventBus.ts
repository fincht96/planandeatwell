import { useCallback, useRef } from 'react';

export interface Event {
  name: string;
  data: string;
}

export interface Subscriber {
  notify: (event: Event) => void;
}

export const useEventBus = () => {
  const subscribers = useRef<Array<{ notify: (event: Event) => void }>>([]);

  const subscribe = useCallback((subscriber: Subscriber) => {
    subscribers.current = [...subscribers.current, subscriber];
  }, []);

  const unsubscribe = useCallback((subscriber: Subscriber) => {
    subscribers.current = subscribers.current.filter(
      (currentSubscriber) => currentSubscriber !== subscriber,
    );
  }, []);

  const post = useCallback((event: Event) => {
    subscribers.current.forEach((subscriber) => {
      subscriber.notify(event);
    });
  }, []);

  return {
    post,
    subscribe,
    unsubscribe,
  };
};
