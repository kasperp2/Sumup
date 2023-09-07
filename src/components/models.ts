export interface Todo {
  id: number;
  content: string;
}

export interface Meta {
  totalCount: number;
}

export interface Transcript {
  id: number;
  date: string;
  content: Array<Paragraph>;
}

export interface Paragraph {
  id: number;
  content: string;
  time: number;
}
