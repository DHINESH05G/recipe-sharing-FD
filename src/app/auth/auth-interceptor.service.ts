import { HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
// @ts-ignore
import { exhaustMap, Observable, take } from "rxjs";
import { AuthService } from "./auth.service";
import { Injectable } from "@angular/core";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor{
  constructor(private authService:AuthService){}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.authService.user.pipe(take(1),
  exhaustMap((user: { token: string | number | boolean; })=>{
    if (!user || !user.token){
      console.log('User or user token is null.');
      return [];
    }
    const modifiedreq=req.clone({params:new HttpParams().set('auth',user.token)})
    return next.handle(req);
  }));
    return next.handle(req);
  }
}
