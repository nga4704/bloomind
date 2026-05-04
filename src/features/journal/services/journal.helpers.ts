import { JournalBlock } from "../types/journal";

export const buildPreviewData = (blocks: JournalBlock[]) => {
  const textBlocks = blocks.filter((b) => b.type === "text") as any[];

  const titleBlock = textBlocks.find(
    (b) => b.style?.variant === "title"
  );

  const bodyBlock = textBlocks.find(
    (b) => b.style?.variant === "body"
  );

  return {
    previewTitle: titleBlock?.text?.trim() || "",
    previewContent: bodyBlock?.text?.trim() || "",
  };
};

export const hasImageBlock = (blocks: JournalBlock[]) => {
  return blocks.some((b) => b.type === "image");
};

export const getLocalDateKey = (date: Date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};