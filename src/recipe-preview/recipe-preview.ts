import * as styles from './recipe-preview.scss';

export class SearchRecipePreviewComponent extends HTMLElement {
  recipe: any;
  attachTo: HTMLElement;

  private contentEl = document.createElement('div');

  constructor() {
    super();

    this.attachShadow({ mode: 'open' }).innerHTML = '<slot></slot>';
    const style = document.createElement('style');

    style.textContent = styles.default;

    this.shadowRoot.appendChild(style);

    // Prevent event execution so that links can be clicked.
    this.addEventListener('mousedown', (ev) => {
      ev.stopPropagation();
      ev.preventDefault();
    });
  }

  connectedCallback() {
    // Append content to light dom!
    Object.assign(this.contentEl.style, {
      pointerEvents: 'none',
      width: '720px',
      height: '1200px',
      transformOrigin: '0 0',
      transform: 'scale(.55)',
      backgroundColor: '#fff',
    });
    this.appendChild(this.contentEl);
  }

  update(data: any) {
    const body = data.Current.Body;
    this.contentEl.innerHTML = '';
    this.previewActivity(body);
  }

  private previewRawHtml(body: string): void {
    const a = document.createElement('a');
    a.href = '#';
    a.target = '_blank';
    a.innerHTML = body;
    this.contentEl.appendChild(a);
  }

  private previewActivity(body: string): void {
    const activity = document.createElement('azing-activity') as any;
    activity.activityTemplate = body;
    activity.azingContext = { domainName: 'azing.org' };
    this.contentEl.appendChild(activity);
  }
}
