export class SearchResultRecipeComponent extends HTMLElement {
  recipe: any;
  searchString: any;

  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: flex;
        flex-direction: row;
        box-sizing: border-box;
        line-height: 44px;
        height: 44px;
        font-size: 14px;
        padding: 0 16px 0 0;
        color: #617082;
        cursor: pointer;
        overflow: hidden;
        opacity: 0;
        transition: opacity .4s ease;
      }
      :host(.loaded) {
        opacity: 1;
      }
      :host(.active) {
        background-color: #ede7f9;
        color: #2122bd;
      }
      :host .icon {
        font-family: 'Material Icons';
        text-align: center;
        font-size: 27px;
        width: 44px;
      }
      :host .content {
        display: flex;
        flex-direction: column;
        flex: 1 1;
        padding: 6px 0;
      }
      :host .title {
        height: 20px;
        line-height: 20px;
        font-weight: 600;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        width: calc(480px - 44px - 16px);
      }
      :host .title .found {
        color: #ff3939;
      }
      :host .breadcrumb {
        height: 12px;
        line-height: 12px;
        width: calc(480px - 44px - 16px);
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        box-sizing: border-box;
      }
      :host .breadcrumb a {
        color: #909aa6;
        text-decoration: none;
        font-size: 12px;
        transition: color .2s ease;
      }
      :host .breadcrumb a:hover {
        color: #617082;
      }
      :host .breadcrumb span {
        display: inline-block;
        font-family: 'Material Icons';
        vertical-align: middle;
      }
    `;
    this.shadowRoot.appendChild(style);

    this.shadowRoot.addEventListener('click', (ev) => {
      if ((ev.target as HTMLElement).tagName === 'A') {
        return;
      }
      window.open(this.recipe.ShortId, '_blank');
    });
  }

  connectedCallback() {
    const breadcrumb = this.getBreadcrumb(this.recipe.Path);

    this.shadowRoot.innerHTML += `
      <div class="icon">
        <span>check_circle_outline</span>
      </div>
      <div class="content">
        <span class="title">${this.wrapFoundInTags(this.recipe.Title)}</span>
        <span class="breadcrumb">${breadcrumb}</span>
      </div>
    `;
  }

  private wrapFoundInTags(title: string): string {
    const searchString = this.searchString.toLowerCase();
    const searchPartsLower = searchString.toLowerCase().split(' ');
    const searchParts = searchString.split(' ');
    const regex = new RegExp('(' + searchParts.join('|') + ')', 'i');
    const parts = title.split(regex);
    return parts
      .map((part: string) => {
        if (searchPartsLower.includes(part.toLowerCase())) {
          return `<span class="found">${part}</span>`;
        }
        return part;
      })
      .join('');
  }

  private getBreadcrumb(path: string) {
    const asLink = ({ ShortId, Title }: any) =>
      `<a href="${ShortId}" title="${Title}" target="_blank">${Title}</a>`;

    const first = asLink(path[0]);
    const len = path.length;
    if (len === 1) {
      return first;
    }
    const last = asLink(path[len - 1]);
    const dots = `<span>more_horiz</span>`;
    return (len === 2 ? [first, last] : [first, dots, last]).join(' › ');
  }
}
