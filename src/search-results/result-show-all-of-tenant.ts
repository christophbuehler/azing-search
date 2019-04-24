export class SearchResultShowAllOfTenantComponent extends HTMLElement {
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
        opacity: .8;
      }
      :host(:hover) {
        opacity: 1;
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
      :host .detail {
        display: inline-block;
        height: 12px;
        line-height: 12px;
        width: calc(480px - 44px - 16px);
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        box-sizing: border-box;
        color: #909aa6;
        text-decoration: none;
        font-size: 12px;
        transition: color .2s ease;
      }
    `;
    this.shadowRoot.appendChild(style);
  }

  connectedCallback() {
    this.shadowRoot.innerHTML += `
        <div class="icon">
          <span>search</span>
        </div>
        <div class="content">
          <span class="title">Show all of 2sic</span>
          <span class="detail">8 additional results found</span>
        </div>
      `;
  }
}
