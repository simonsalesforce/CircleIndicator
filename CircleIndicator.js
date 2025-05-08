import { LightningElement, api, track } from 'lwc';
import { FlowAttributeChangeEvent } from 'lightning/flowSupport';

export default class CircleIndicator extends LightningElement {
  @api circleLabels;
  @api circleCounts;
  @api visibilityKeys;
  @api selectedKey;
  @api defaultSelectedKey;
  @api enablePulse;

  @track circles = [];

  connectedCallback() {
    this.buildCircles();
  }

  buildCircles() {
    const labels = (this.circleLabels || '').split(',');
    const counts = (this.circleCounts || '').split(',');
    const keys = (this.visibilityKeys || '').split(',');

    const result = [];

    for (let i = 0; i < labels.length; i++) {
      const label = labels[i]?.trim() || '';
      const count = Number(counts[i]?.trim()) || 0;
      const key = keys[i]?.trim() || `circle${i}`;
      const isSelected = (this.selectedKey || '').toLowerCase() === key.toLowerCase();

      let classNames = `circle ${isSelected ? 'selected' : ''}`;
      if (count > 0 && this.enablePulse !== false) {
        classNames += ' attention';
      }

      result.push({
        label,
        count,
        key,
        class: classNames
      });
    }

    if (!this.selectedKey && result.length > 0) {
      const defaultMatch = result.find(c =>
        c.key.toLowerCase() === (this.defaultSelectedKey || '').toLowerCase()
      );

      const firstNonZero = result.find(c => c.count > 0);
      const fallback = result[0];
      const selected = defaultMatch || firstNonZero || fallback;

      this.selectedKey = selected.key;
      this.dispatchFlowValueChange();
    }

    this.circles = result;
  }

  handleCircleClick(event) {
    const key = event.currentTarget.dataset.key;
    this.selectedKey = key;

    this.circles = this.circles.map(circle => {
      let classNames = `circle ${circle.key.toLowerCase() === key.toLowerCase() ? 'selected' : ''}`;
      if (circle.count > 0 && this.enablePulse !== false) {
        classNames += ' attention';
      }

      return {
        ...circle,
        class: classNames
      };
    });

    this.dispatchFlowValueChange();
  }

  dispatchFlowValueChange() {
    this.dispatchEvent(
      new FlowAttributeChangeEvent('selectedKey', this.selectedKey)
    );
  }
}
