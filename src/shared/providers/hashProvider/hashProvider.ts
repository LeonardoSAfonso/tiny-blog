import { compareSync, hashSync } from 'bcrypt';

class HashProvider {
  public to(password: string): string | null {
    return password ? hashSync(password, 10) : null;
  }

  public from(hash: string): string {
    return hash;
  }

  public compare(target: string, source: string): boolean {
    return compareSync(target, source);
  }
}

export default new HashProvider();
