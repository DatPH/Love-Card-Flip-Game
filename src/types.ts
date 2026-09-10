export type LevelKey = 'level_1' | 'level_2' | 'level_3';

export interface LevelData {
  title: string;
  description: string;
  badge?: string;
  accent?: string;
  questions: string[];
}

export interface CardDeck {
  level_1: LevelData;
  level_2: LevelData;
  level_3: LevelData;
}

export type GameScreen = 'welcome' | 'level_select' | 'gameplay';
