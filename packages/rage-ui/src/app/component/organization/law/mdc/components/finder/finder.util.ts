import type { FilterQuery } from 'mongoose';
import { ICharacter } from '@revolt-rp/common';

export function buildCitizenNameQuery(input: string): FilterQuery<ICharacter> {
  const parts = input.trim().split(/\s+/);

  if (parts.length === 2) {
    const [firstName, lastName] = parts;
    return {
      firstName: { $regex: `^${firstName}$`, $options: 'i' },
      lastName: { $regex: `^${lastName}$`, $options: 'i' }
    };
  }

  const name = parts[0];
  return {
    $or: [
      { firstName: { $regex: `^${name}$`, $options: 'i' } },
      { lastName: { $regex: `^${name}$`, $options: 'i' } }
    ]
  };
}
