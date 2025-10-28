import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs';
import { IAuthorizationState } from '../store/auth/auth.state';
import { selectAuthState } from '../store/auth/auth.selector';

export const authGuard: CanActivateFn = (route, state) => {
  const store = inject(Store<IAuthorizationState>);
  const router = inject(Router);

  return store.select(selectAuthState).pipe(
    take(1),
    map(authState => {
      if (authState.isAuthenticated) {
        return true;
      } else {
        router.navigate(['/']);
        return false;
      }
    })
  );
};
