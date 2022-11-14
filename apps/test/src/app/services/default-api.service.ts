import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ILoadResponse {
  count: string,
  delay: string
}

@Injectable({
  providedIn: 'root'
})
export class DefaultApiService {

  constructor(private _http: HttpClient) { }

  public load(): Observable<ILoadResponse> {
    return this._http.post<ILoadResponse>('/api', {
      action: 'params',
    });
  }

  public process(): Observable<{ status: string }> {
    return this._http.post<{ status: string }>('/api', {
      action: 'process',
    })
  }
}
