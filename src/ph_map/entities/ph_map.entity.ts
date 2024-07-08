export type PhMap = {
  id: string;
  name: string;
  svg_path: string;
};

export type UserPhMap = PhMap & {
  hasPost: boolean;
};
