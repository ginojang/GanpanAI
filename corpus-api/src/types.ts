export interface WikiNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
}

export interface WikiPage {
  path: string;
  title: string;
  content: string;
  exists: boolean;
}