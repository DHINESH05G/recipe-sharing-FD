import { Ingredient } from "../Shared/ingredient.model";

export class Recipe {
  constructor(public name: string, public description: string, public imagePath: string, public ingredients:Ingredient[]) {}
}
