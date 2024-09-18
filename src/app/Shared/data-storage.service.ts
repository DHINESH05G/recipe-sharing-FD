import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../service/recipe.service';
// @ts-ignore
import { exhaustMap, flatMap, map, mergeMap, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { resolve } from 'path';
import { rejects } from 'assert';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  url = 'https://recipe-book-2eae5-default-rtdb.firebaseio.com/recipes.json';
  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private authService: AuthService
  ) {}

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http.put(this.url, recipes).subscribe((responce: any) => {
      console.log(responce);
    });
  }

  fetchRecipes() {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        this.authService.user.pipe(
          tap((user: any) => console.log('User emission:', user)),
          take(1),
          exhaustMap((user: { token: string | number | boolean; email: string; id: string; }) => {
            if (!user || !user.token) {
              console.log('User or user token is null.');
              return [];
            }
            console.log('ExhaustMap:' + user.email, '>>>>userID:' + user.id);
            return this.http.get<Recipe[]>(this.url, {
              params: new HttpParams().set('auth', user.token),
            });
          }),
          map((recipes: Recipe[]) => {
            return recipes.map((recipe: Recipe) => {
              return {
                ...recipe,
                ingredient: recipe.ingredients ? recipe.ingredients : [],
              };
            });
          }),
          tap((recipes: Recipe[]) => {
            this.recipeService.setRecipes(recipes);
          })
        ).subscribe({
          next: () => resolve(),
          error: (err: any) => reject(err)
        });
      }, 0);
    });
  }
}
  /*fetchRecipes() {
    return this.authService.user.pipe(
      switchMap(user=>{
        if(!user||!user.token){
          console.error('User or user token is null.');
          return [];
        }
        return this.http.get<Recipe[]>(this.url,{
          params:new HttpParams().set('auth',user.token),
        }).pipe(
          map((recipes:Recipe[])=>{
            return recipes.map((recipe:Recipe)=>{
              return{
                ...recipe,
                ingredients:recipe.ingredients?recipe.ingredients:[],
              };
            });
          })
        );
      })
    );
    /*
    return this.http
      .get<Recipe[]>(this.url ,{
        params: new HttpParams().set('auth', "5555"),
      })
      .pipe(
        map((recipes) => {
          return recipes.map((recipe) => {
            return {
              ...recipe,
              ingredient: recipe.ingredients ? recipe.ingredients : [],
            };
          });
        })
      )
      .subscribe((response) => {
        this.recipeService.setRecipes(response);
      });
    /*
    return this.authService.user.pipe(
      map(user => {
        if (!user || !user.token) {
          // Handle the case where user or user token is null
          console.error('User or user token is null.');
          return []; // or return an observable that emits an empty array
        }
        console.log('User: ' + user.email, '>>>>userID: ' + user.id);
        return this.http.get<Recipe[]>(this.url, {
          params: new HttpParams().set('auth', user.token),
        })},
      tap((recipes: Recipe[]) => {
        this.recipeService.setRecipes(recipes);
      })
    ));*/
