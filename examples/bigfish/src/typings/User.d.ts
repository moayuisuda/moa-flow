export interface User {
  id: string;
  name: string;
  age: number;
  like: string;
  processId: string;
  role: 'admin' | 'common';
}
