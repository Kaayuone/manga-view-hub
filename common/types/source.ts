export type SourceName = "remanga";

export type Source = {
  name: SourceName;
  text: string;
  description: string;
  iconPath: string;
};

export type TitleListItem = {
  id: number;
  urlName: string;
  title: string;
  cover: string;
  sourceMediaLink: string;
};
