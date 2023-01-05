export interface Event<NameType = string, DataType = string> {
  name: NameType;
  data: DataType;
}

export interface Subscriber<EventType = Event> {
  notify: (event: EventType) => void;
}
