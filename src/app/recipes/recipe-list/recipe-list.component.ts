import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../../service/recipe.service';
import { ActivatedRoute, Router } from '@angular/router';
import { relative } from 'path';
import { Subscription } from 'rxjs';
import { DataStorageService } from '../../Shared/data-storage.service';
import { ThisReceiver } from '@angular/compiler';
@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrl: './recipe-list.component.css',
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes!: Recipe[];
  subscription!: Subscription;

  constructor(
    private recipeService: RecipeService,
    private router: Router,
    private route: ActivatedRoute,
    private dataStorage: DataStorageService
  ) {
    console.log('the Recipe List Constractor Was Called');
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  ngOnInit() {
    if (!this.recipeService.intialFetch) {
      this.dataStorage.fetchRecipes();
      this.recipeService.intialFetch = true;
    }
     this.subscription = this.recipeService.recipesChanged.subscribe(
      (newRecipes: Recipe[]) => {
        this.recipes = newRecipes;
        console.log('update');
      }
    );
    this.recipes = this.recipeService.getRecipes();
  }
  onNewRecipe() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }
}
