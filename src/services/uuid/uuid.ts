import { v4 } from 'uuid';

const generateUUID = () => {
  return v4();
};

export const uuid = {
  generateUUID,
};
