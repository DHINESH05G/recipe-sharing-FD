import {
  Component,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { DataStorageService } from '../Shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
// @ts-ignore
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  private userSub!: Subscription;
  constructor(
    private dataStorageService: DataStorageService,
    private authservice: AuthService
  ) {}
  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
  ngOnInit() {
    this.userSub = this.authservice.user.subscribe((user: any) => {
      this.isAuthenticated = !!user;
    });
  }
  collapsed = true;
  @Output() featureSelected = new EventEmitter<string>();
  onSelect(feature: string) {
    this.featureSelected.emit(feature);
  }
  onLogout(){
    this.authservice.logout();
  }
  onSaveResipes() {
    this.dataStorageService.storeRecipes();
  }
  onFetchRecipes() {
    console.log("OnFetch..Start");
    this.dataStorageService.fetchRecipes();
    console.log("OnFetch..END");
  }
}
