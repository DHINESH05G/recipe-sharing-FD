import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Ingredient } from '../../Shared/ingredient.model';
import { ShoppingListService } from '../../service/shopping-list.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrl: './shopping-edit.component.css',
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f') slForm!: NgForm;
  subscription!: Subscription;
  editMode = false;
  editIndex!: number;
  editedIngredient!: Ingredient;
  constructor(private slService: ShoppingListService) {}
  ngOnInit(): void {
    this.subscription = this.slService.startedEditing.subscribe(
      (index: number) => {
        this.editIndex = index;
        this.editMode = true;
        const ingredient = this.slService.getIngredient(index);
        if(ingredient!==undefined)
          this.editedIngredient = ingredient;
        this.slForm.setValue({
          name: this.editedIngredient.name,
          amount: this.editedIngredient.amount,
        });
      }
    );
  }

  onAddItem(form: NgForm) {
    const ingredient = form.value;
    const newIngredient = new Ingredient(ingredient.name, ingredient.amount);
    if (this.editMode) {
      this.slService.updateIngredient(this.editIndex, newIngredient);
    } else {
      this.slService.addIngredient(newIngredient);
    }
    this.editMode = false;
    form.reset();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  onClear() {
    this.slForm.reset();
    this.editMode = false;
  }
  onDelete(){
    this.slService.deleteIngredient(this.editIndex);
    this.onClear();
  }
}
