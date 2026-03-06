import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { WifiPoint } from '../../../shared/models/wifi-point.model';

@Injectable({
  providedIn: 'root'
})
export class WifiService {

  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getWifiPoints(): Observable<WifiPoint[]> {
    return this.http.get<WifiPoint[]>(this.apiUrl);
  }
}
