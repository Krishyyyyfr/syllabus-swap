import { describe, expect, it } from 'vitest';
import {
  collectAuthEmails,
  getAttemptedEmail,
  hasSchoolHostedDomain,
  isAllowedSchoolEmail,
  resolveSchoolEmail,
  type AuthUserLike,
} from './auth';

describe('school Google account matching', () => {
  it('accepts the numeric St John’s student email', () => {
    expect(isAllowedSchoolEmail('27043@stjohnscollege.co.za')).toBe(true);
    expect(isAllowedSchoolEmail('27043@STJOHNSCOLLEGE.CO.ZA')).toBe(true);
  });

  it('rejects personal Gmail addresses', () => {
    expect(isAllowedSchoolEmail('someone@gmail.com')).toBe(false);
    expect(isAllowedSchoolEmail('')).toBe(false);
  });

  it('uses the school email even when Google’s primary email is Gmail', () => {
    const sbUser: AuthUserLike = {
      id: 'abc',
      email: 'personal@gmail.com',
      user_metadata: { email: 'personal@gmail.com', full_name: 'Student' },
      identities: [
        {
          email: 'personal@gmail.com',
          identity_data: {
            email: '27043@stjohnscollege.co.za',
            hd: 'stjohnscollege.co.za',
          },
        },
      ],
    };
    expect(resolveSchoolEmail(sbUser)).toBe('27043@stjohnscollege.co.za');
    expect(collectAuthEmails(sbUser)).toContain('27043@stjohnscollege.co.za');
  });

  it('accepts Workspace accounts via hosted domain even if the address shape is unusual', () => {
    const sbUser: AuthUserLike = {
      id: 'abc',
      email: '27043@stjohnscollege.co.za',
      user_metadata: { hd: 'stjohnscollege.co.za' },
    };
    expect(hasSchoolHostedDomain(sbUser)).toBe(true);
    expect(resolveSchoolEmail(sbUser)).toBe('27043@stjohnscollege.co.za');
  });

  it('rejects a Gmail login with no school identity', () => {
    const sbUser: AuthUserLike = {
      id: 'abc',
      email: 'personal@gmail.com',
      user_metadata: { email: 'personal@gmail.com' },
      identities: [{ identity_data: { email: 'personal@gmail.com' } }],
    };
    expect(resolveSchoolEmail(sbUser)).toBeNull();
    expect(getAttemptedEmail(sbUser)).toBe('personal@gmail.com');
  });
});
