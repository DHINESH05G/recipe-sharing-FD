import { inject, Injectable } from '@angular/core';
import { Recipe } from '../recipes/recipe.model';
import { Ingredient } from '../Shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  /* private recipes: Recipe[] = [

    new Recipe(
      'Basic Crêpes',
      'This simple but delicious crêpe recipe can be made in minutes from ingredients that everyone has on hand.',
      'https://www.allrecipes.com/thmb/p1mPvCVGnd6cy3SGmZAIHEoSI2Y=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/16383-basic-crepes-mfs_003-f1033a4dbed74bc2b0d465c8de6026e2.jpg',
      [
        new Ingredient('Strawberries', 5),
        new Ingredient('Blackberries', 5),
        new Ingredient('Vanilla', 1),
        new Ingredient('Cream chante', 1),
      ]
    ),
    new Recipe(
      'French Crêpes',
      'French crêpes are good for weekend breakfasts, or even for desserts. Serve rolled up and filled with jam or fruit and whipped cream.',
      'https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fpublic-assets.meredithcorp.io%2Fab8c0f42ec7fb37f95c736214abc7e6f%2F165705069620220705_125229.jpg&q=60&c=sc&orient=true&poi=auto&h=512',
      [
        new Ingredient('Nutella', 1),
        new Ingredient('Blueberries', 1),
        new Ingredient('Honey', 1),
        new Ingredient('Coconut', 1),
      ]
    ),
    new Recipe(
      'Creamy Strawberry Crepes',
      'This strawberry crepe recipe has been a family favorite for over 30 years! These crepes are delicious and very rich! Be sure you have at least 1 hour to prepare them; they are worth every minute!',
      'https://www.allrecipes.com/thmb/3zQFQdtmZMsRS3QJADaXEZCfNj0=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/7725389-creamy-strawberry-crepes-Christine-Johanson-1x1-1-775b425615bd408698fc3688b35ddf12.jpg',
      [
        new Ingredient('Strawberries', 5),
        new Ingredient('Hazelnut', 1),
        new Ingredient('Honey', 1),
        new Ingredient('Cream chante', 1),
      ]
    ),
    new Recipe(
      'Corned Beef and Cabbage',
      "Corned Beef and Cabbage is a beloved dish that captures the essence of Irish-American cuisine. It's a meal that’s both satisfying and symbolic of the holiday\ncozy enough to warm you up in the last few days of chilly weather and hearty enough to keep full you through a few celebratory rounds of Guinness.",
      'https://www.allrecipes.com/thmb/mte7GTJNI2lb3XLfW8uKtj2cMR8=/800x533/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/16310-Corned-Beef-and-Cabbage-I-4x3-cropped-c59bbef3e2944b6dac06226e05079fbe.jpg',
      [
        new Ingredient('corned beef brisket', 2),
        new Ingredient('Pickling spices ', 1),
        new Ingredient('cabbage', 1),
        new Ingredient('potatoes', 1),
        new Ingredient('carrots', 1),
        new Ingredient('onion', 1),
        new Ingredient('Mustard', 1),
        new Ingredient('Black peppercorns', 1),
      ]
    ),
    new Recipe(
      'Buffalo Cauliflower',
      'Though we haven\'t tested this ourselves, one helpful idea comes from Allrecipes user Pauline who put her own spin on the dish: "I added the hot sauce & honey to the batter (skipped the butter) and roasted the florets at 450 for about 13 minutes. Sheer greatness! The batter stuck to the pieces well and cooked up just right."',
      'https://www.allrecipes.com/thmb/0Q_2q0fAex8Qjq1Nf8wiANxnWFI=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/239616-buffalo-cauliflower-DDMFS-4x3-dbc3ece590024fa0bb3f45773f1d511a.jpg',
      [
        new Ingredient('cauliflower', 2),
        new Ingredient('Garlic powder', 1),
        new Ingredient('Onion powder', 1),
        new Ingredient('paprika', 1),
        new Ingredient('Salt ', 1),
        new Ingredient('pepper ', 1),
      ]
    ),
  ];
  */

  private recipes: Recipe[] = [];
  intialFetch: Boolean = false;
  recipesChanged = new Subject<Recipe[]>();
  constructor(private slService: ShoppingListService) {
    console.log('the RecipeService List Constractor Was Called');
  }
  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }
  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.recipesChanged.next(this.recipes.slice());
  }
  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }
  getRecipes() {
    return this.recipes.slice();
  }
  getRecipe(index: number) {
    if (this.recipes === null) {
      this.recipes = []; // Initialize to an empty array
    }
    return this.recipes[index];
  }
  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.slService.addIngredients(ingredients);
  }
  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }
}
