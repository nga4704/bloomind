export type TextStyle = {
  variant?: "title" | "body";
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  color?: string;
  font?: string;
  size?: "small" | "normal" | "large";
};

export type JournalBlock =
  | {
      id: string;
      type: "text";
      text: string;
      style?: TextStyle;
    }
  | {
      id: string;
      type: "image";
      url: string;
    }
  | {
      id: string;
      type: "audio";
      url: string;
    };

    export type Journal = {
  id: string;
  userId: string;
  date: Date;
  year: number;
  month: number;
  day: number;
  dateKey: string;

  blocks: JournalBlock[];

  previewTitle?: string;
  previewContent?: string;
  hasImage?: boolean;

  createdAt?: any;
  updatedAt?: any;
};