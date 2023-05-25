import {Directive, ElementRef, HostListener, Input, OnInit, Renderer2} from '@angular/core';

@Directive({
  selector: '[appButtonHover]'
})
export class ButtonHoverDirective implements OnInit{

  constructor(private element: ElementRef, private renderer: Renderer2) { }

  defaultColor: string = '';
  tagName: string = ''
  @Input() highlightColor:string = '';

  ngOnInit(): void {
    this.renderer.setStyle(this.element.nativeElement, 'cursor', 'pointer');

    const domElement = this.element.nativeElement;
    this.tagName = this.element.nativeElement.tagName.toLowerCase();
    this.defaultColor = (this.tagName == 'a' || this.tagName == 'i') ?
      window.getComputedStyle(domElement).color : window.getComputedStyle(domElement).backgroundColor;


  }

  @HostListener('mouseenter') mouseenter(){
    if(this.tagName=='a' || this.tagName == 'i')
      this.renderer.setStyle(this.element.nativeElement, 'color', this.highlightColor);
    else
      this.renderer.setStyle(this.element.nativeElement, 'backgroundColor', this.highlightColor);
  }

  @HostListener('mouseleave') mouseleave(){
    if(this.tagName=='a' || this.tagName == 'i')
      this.renderer.setStyle(this.element.nativeElement, 'color', this.defaultColor);
    else
      this.renderer.setStyle(this.element.nativeElement, 'backgroundColor', this.defaultColor);
  }

}
