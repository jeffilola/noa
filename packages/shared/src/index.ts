export const API_PREFIX = '/api/v1';

export interface ApiErrorBody {
  message: string;
  issueInPacs?: boolean;
  errors?: Partial<Record<'phoneNumber' | 'dateOfBirth', string>>;
}

export {
  normalizeProfilePhone,
  normalizeProfileUpdate,
  validateProfileDateOfBirth,
  validateProfilePhone,
  validateProfileUpdate,
  type ProfileFieldErrors,
} from './profile-validation';
