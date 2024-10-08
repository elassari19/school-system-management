export const handleChaptersContent = (chapters: any) => {
  return chapters.map((chapter: any) => {
    const newContent = chapter.content.map((item: any) => {
      const newItem = {
        ...item,
        data: JSON.stringify(item.data),
      };
      return newItem;
    });
    const newChapter = {
      ...chapter,
      content: {
        create: newContent,
      },
    };
    return newChapter;
  });
};
