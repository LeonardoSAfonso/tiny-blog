import { compareSync, hashSync } from 'bcrypt';

const HashProvider = {
  to(password: string): string | null {
    return password ? hashSync(password, 10) : null;
  },
  from(hash: string): string {
    return hash;
  },
  compare(target: string, source: string): boolean {
    return compareSync(target, source);
  },
};

export default HashProvider;
