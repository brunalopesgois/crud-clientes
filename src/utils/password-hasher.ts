import * as bcrypt from 'bcrypt';

export const hasher = {
  async hashPassword(text: string): Promise<string> {
    return bcrypt.hash(text, 10);
  },

  async validatePassword(password, hash) {
    return bcrypt.compare(password, hash);
  },
};
