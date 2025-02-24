import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private base_url = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getAllProducts(): Observable<any> {
    return this.http.get(`${this.base_url}/products`, { headers: this.getHeaders() })
  }

  getHeaders(){
    let headerOption = new HttpHeaders ();
    headerOption.append('Content-Type', 'application/json');
    headerOption.append('X-Requested-With', 'XMLHttpRequest');
    return headerOption;
    }
}
