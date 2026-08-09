export interface EventImage {
  id: string;
  url: string;
  caption?: string;
  createdAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  state: string;
  stateCode: string;
  district?: string;
  location: string;
  mapUrl?: string;
  date: string;
  endDate?: string;
  time?: string;
  type: "social_activity" | "upcoming_event" | "past_event";
  images: EventImage[];
  createdAt: string;
  updatedAt: string;
}

export interface EventsData {
  events: Event[];
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt: string;
}
