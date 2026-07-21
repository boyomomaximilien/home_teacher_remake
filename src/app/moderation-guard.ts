import { CanActivateFn } from '@angular/router';

export const moderationGuard: CanActivateFn = (route, state) => {
  return true;
};
