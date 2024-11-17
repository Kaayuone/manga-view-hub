export type SourceName = "remanga";

export type Source = {
  name: SourceName;
  text: string;
  description: string;
  iconPath: string;
};

export type Story = {
  // TODO: add id
  title: string;
  cover: string;
  sourceMediaLink: string;
};
