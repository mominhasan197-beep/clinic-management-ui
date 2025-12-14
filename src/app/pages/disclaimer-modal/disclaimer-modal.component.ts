import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { DisclaimerService } from '../../services/disclaimer.service';

@Component({
  selector: 'app-disclaimer-modal',
  templateUrl: './disclaimer-modal.component.html',
  styleUrls: ['./disclaimer-modal.component.css']
})
export class DisclaimerModalComponent implements OnInit {
  @Input() featureKey = 'generic-ai';
  @Input() title = '⚠️ Disclaimer';
  @Input() extraNote = '';
  @Output() accepted = new EventEmitter<void>();

  show = false;
  agreeChecked = false;

  constructor(private ds: DisclaimerService) {}

  ngOnInit(): void {
    this.show = !this.ds.hasAccepted(this.featureKey);
  }

  onAccept() {
    if (!this.agreeChecked) return;
    this.ds.accept(this.featureKey);
    this.show = false;
    this.accepted.emit();
  }
}
