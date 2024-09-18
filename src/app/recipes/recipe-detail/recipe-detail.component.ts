import { Component, Input, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../../service/recipe.service';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { compileClassDebugInfo } from '@angular/compiler';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrl: './recipe-detail.component.css',
})
export class RecipeDetailComponent implements OnInit {
  recipe!: Recipe;
  id!: number;
  private routerEventsSubscription!: Subscription;
  private recipeUpdateSubscription!: Subscription;

  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router
  ) {  console.log('the Details Recipe Constractor Was Called');
       this.recipe =new Recipe("recipe","d","d",[]);
}
  ngOnInit(): void {
    this.id=+this.route.snapshot.params['id'];
    this.routerEventsSubscription=this.router.events
    .pipe(filter((rs: any):rs is NavigationEnd=>rs instanceof NavigationEnd))
    .subscribe((event: { id: number; url: any; urlAfterRedirects: any; })=>{
      if(event.id===1 && event.url ===event.urlAfterRedirects){
        this.updateRecipe();
      }
    });
    this.route.params.subscribe((param: Params) => {
      this.id = +param['id']; //casting id to number
      this.updateRecipe();
    });

    // Initial load of recipe
    this.recipe = this.recipeService.getRecipe(this.id);
  }
  onAddToShoppingList() {
    this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
  }
  onEditRecipe() {
    this.router.navigate(['edit'], { relativeTo: this.route });
    //this.router.navigate(['../',this.id,'edit'], { relativeTo: this.route });
  }
  onDeleteRecipe() {
    this.recipeService.deleteRecipe(this.id);
    this.router.navigate(['../'], { relativeTo: this.route });
  }
  private updateRecipe(): void {
    this.recipe = this.recipeService.getRecipe(this.id);
  }
  ngOnDestroy(): void {
    if (this.routerEventsSubscription) {
      this.routerEventsSubscription.unsubscribe();
    }
  }
}
