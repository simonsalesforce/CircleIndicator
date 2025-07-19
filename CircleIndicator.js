import { LightningElement, api, track } from 'lwc';
import { FlowAttributeChangeEvent } from 'lightning/flowSupport';

export default class CircleIndicator extends LightningElement {
  @api selectedKey;
  @api defaultKeyPriorityList;
  @api enablePulse;
  @api actionNeededKeys;

  @track circles = [];

  // Backing variables
  _labelsRaw;
  _countsRaw;
  _keysRaw;

  @api
  set circleLabels(value) {
    this._labelsRaw = value;
    this.tryBuildCircles();
  }
  get circleLabels() {
    return this._labelsRaw;
  }

  @api
  set circleCounts(value) {
    this._countsRaw = value;
    this.tryBuildCircles();
  }
  get circleCounts() {
    return this._countsRaw;
  }

  @api
  set visibilityKeys(value) {
    this._keysRaw = value;
    this.tryBuildCircles();
  }
  get visibilityKeys() {
    return this._keysRaw;
  }

  tryBuildCircles() {
    if (this._labelsRaw && this._countsRaw && this._keysRaw) {
      this.buildCircles();
    }
  }

  buildCircles() {
    const labels = this._labelsRaw.split(',').map(s => s.trim());
    const counts = this._countsRaw.split(',').map(s => Number(s.trim()) || 0);
    const keys = this._keysRaw.split(',').map(s => s.trim());

    const actionNeededSet = new Set(
      (this.actionNeededKeys || '')
        .split(',')
        .map(k => k.trim().toLowerCase())
        .filter(k => k)
    );

    const result = [];

    for (let i = 0; i < labels.length; i++) {
      const label = labels[i] || '';
      const count = counts[i] || 0;
      const key = keys[i] || `circle${i}`;
      const isSelected = (this.selectedKey || '').toLowerCase() === key.toLowerCase();
      const showActionNeeded = actionNeededSet.has(key.toLowerCase()) && count > 0;

      let classNames = `circle ${isSelected ? 'selected' : ''}`;
      if (count > 0 && this.enablePulse !== false) {
        classNames += ' attention';
      }

      result.push({
        label,
        count,
        key,
        class: classNames,
        isSelected,
        showActionNeeded
      });
    }

    // Set default selectedKey if none yet
    if (!this.selectedKey && result.length > 0) {
      const priorityKeys = (this.defaultKeyPriorityList || '')
        .split(',')
        .map(k => k.trim().toLowerCase())
        .filter(k => k);

      const matchFromPriority = result.find(c => priorityKeys.includes(c.key.toLowerCase()) && c.count > 0);
      const firstNonZero = result.find(c => c.count > 0);
      const fallback = result[0];
      const selected = matchFromPriority || firstNonZero || fallback;

      this.selectedKey = selected.key;
      this.dispatchFlowValueChange();
      this.buildCircles(); // Rebuild with updated selectedKey
      return;
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
        class: classNames,
        isSelected: circle.key.toLowerCase() === key.toLowerCase()
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
