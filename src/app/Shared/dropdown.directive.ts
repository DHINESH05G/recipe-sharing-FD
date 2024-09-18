import { Directive, ElementRef, HostBinding, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appDropdown]',
  exportAs:"appDropdown"
})
export class DropdownDirective {
  @HostBinding("class.show") isOpen = false;

  @HostListener("document:click",['$event']) toggleOpen(event:Event) {
    //this.isOpen = !this.isOpen;
    this.isOpen=this.elRef.nativeElement.contains(event.target)?!this.isOpen:false;
  }
  constructor(private elRef:ElementRef) {

  }
}


