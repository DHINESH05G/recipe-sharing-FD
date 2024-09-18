import { Directive, ElementRef, HostListener, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appBetterHighlight]'
})
export class BetterHighlightDirective implements OnInit {
  @Input() defaultColor:string='transparent';
  @Input('appBetterHighlight') highlightColor:string='green';
  constructor(private elmentRef:ElementRef,private renderer:Renderer2) {

  }
  ngOnInit(): void {
  }
  @HostListener('mouseenter') mouseover(eventData:Event){
    this.renderer.setStyle(this.elmentRef.nativeElement,'background-color',this.highlightColor);
    this.renderer.setStyle(this.elmentRef.nativeElement,'color','white');
  }
  @HostListener('mouseleave') mouseleave(eventData:Event){
    this.renderer.setStyle(this.elmentRef.nativeElement,'background-color',this.defaultColor);
    this.renderer.setStyle(this.elmentRef.nativeElement,'color','black');
  }
}
