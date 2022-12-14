import { useCallback, useRef } from 'react';
import { Event, Subscriber } from '../types/eventBus.types';

export const useEventBus = () => {
  const eventQueue = useRef<Array<Event>>([]);
  const busy = useRef(false);
  const subscribers = useRef<Array<{ notify: (event: Event) => void }>>([]);

  const _processNextEvent = useCallback(() => {
    if (!busy.current && eventQueue.current.length) {
      busy.current = true;

      // pop event and notify subscribers
      const event = eventQueue.current.pop();

      if (event) {
        subscribers.current.forEach((subscriber) => {
          subscriber.notify(event);
        });
      }

      busy.current = false;

      // if any events, recursively calls
      if (eventQueue.current.length) {
        _processNextEvent();
      }
    }
  }, []);

  const subscribe = useCallback((subscriber: Subscriber) => {
    subscribers.current = [...subscribers.current, subscriber];
  }, []);

  const unsubscribe = useCallback((subscriber: Subscriber) => {
    subscribers.current = subscribers.current.filter(
      (currentSubscriber) => currentSubscriber !== subscriber,
    );
  }, []);

  const post = useCallback(
    (event: Event) => {
      // push event on queue
      eventQueue.current.push(event);
      _processNextEvent();
    },
    [_processNextEvent],
  );

  return {
    post,
    subscribe,
    unsubscribe,
  };
};
