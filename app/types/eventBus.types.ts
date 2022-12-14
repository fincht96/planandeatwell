export interface Event {
  name: string;
  data: string;
}

export interface Subscriber {
  notify: (event: Event) => void;
}
