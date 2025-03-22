import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ImgurUploadResponse } from '../model/imgur/imgur.model';


@Injectable()
export class ImgurClientService {
  private readonly API_URL = environment.IMGUR.API_URL;
  private readonly CLIENT_ID = environment.IMGUR.CLIENT_ID;

  constructor(private http: HttpClient) {
  }

  /**
   * Upload an image to Imgur
   * @param image - File, Blob, or base64 string
   * @param title - Optional title for the image
   * @param description - Optional description for the image
   * @returns Observable with upload response
   */
  uploadImage(
    image: File | Blob | string,
    title?: string,
    description?: string
  ): Observable<ImgurUploadResponse> {
    const formData = new FormData();

    formData.append('image', image,);
    formData.append('type', typeof image === 'string' ? 'base64' : 'file');

    if (title) formData.append('title', title);
    if (description) formData.append('description', environment.SERVER_NAME);

    const headers = new HttpHeaders({
      'Authorization': `Client-ID ${this.CLIENT_ID}`,
    });

    console.log('formData.type', formData.get('type'))

    return this.http.post(`${this.API_URL}/image`, formData, { headers })
      .pipe(
        map((response: any) => response.data as ImgurUploadResponse),
        catchError(this.handleError)
      );
  }

  /**
   * Delete an image from Imgur
   * @param deleteHash - The image's deletion hash
   * @returns Observable with deletion result
   */
  deleteImage(deleteHash: string): Observable<boolean> {
    const headers = new HttpHeaders({
      'Authorization': `Client-ID ${this.CLIENT_ID}`
    });

    return this.http.delete(`${this.API_URL}/image/${deleteHash}`, { headers })
      .pipe(
        map((response: any) => response.success),
        catchError(this.handleError)
      );
  }

  /**
   * Convert file to base64 string
   * @param file - The file to convert
   * @returns Promise with base64 result
   */
  fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  /**
   * Error handler for API requests
   */
  private handleError(error: any): Observable<never> {
    let errorMessage = 'Unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    console.error(JSON.stringify(error));
    return throwError(() => new Error(errorMessage));
  }
}
