export interface Code {
  path: string;
  content: string;
  start: {
    line: number;
    column?: number;
    position?: number;
  };
  end: {
    line: number;
    column?: number;
    position?: number;
  };
  range: [number, number];
}

export interface Duplicate {
  paths: string[];
  codes: Code[];
}
