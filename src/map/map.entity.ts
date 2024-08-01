export type MapCode = 'ph';

export type Map = {
  id: string;
  name: string;
  svg_path: string;
};

export type UserMap = Map & {
  has_post: boolean;
};
