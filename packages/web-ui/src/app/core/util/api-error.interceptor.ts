import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';

export const apiErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const errorMessage = error.error?.message || 'An unknown error occurred';

      messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: errorMessage,
        key: 'global'
      });

      return throwError(() => error);
    })
  );
}
