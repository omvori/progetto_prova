import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RagSource{
  content:string;
  metadata:Record <string,unknown>;
}

export interface RagChatResponse{
  answer:string;
  sources:RagSource[]
}

@Injectable({
  providedIn: 'root',
})
export class RagService {
  private readonly baseUrl = 'http://127.0.0.1:5001';
    
  constructor(private http:HttpClient){}
  
  chat(query:string): Observable<RagChatResponse>{
    return this.http.post<RagChatResponse>(`${this.baseUrl}/chat`, { query });
  }

}
