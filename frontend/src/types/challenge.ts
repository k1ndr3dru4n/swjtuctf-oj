export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type Category =
  | 'Web'
  | 'Pwn'
  | 'Crypto'
  | 'Misc'
  | 'Reverse'
  | 'Mobile'
  | 'Blockchain'
  | 'AI';
export type Status = 'solved' | 'unsolved';
export type ContainerState = 'idle' | 'loading' | 'running';

export interface ContainerInfo {
  ip: string;
  port: number;
  timeLeft: string;
}

export interface Challenge {
  id: number;
  title: string;
  category: Category;
  description: string;
  points: number;
  solvedCount: number;
  difficulty: Difficulty;
  status: Status;
  containerState: ContainerState;
  containerInfo?: ContainerInfo;
}
