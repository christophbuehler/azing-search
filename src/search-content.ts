import { SearchRecipePreviewComponent } from './recipe-preview/recipe-preview';
import * as styles from './search-content.scss';
import { SearchResultRecipeComponent } from './search-results/result-recipe';

declare const floaters: any;

export class SearchContentComponent extends HTMLElement {
  previewFloater: any;

  private contentEl = document.createElement('div');
  private previewEl = document.createElement(
    'recipe-preview',
  ) as SearchRecipePreviewComponent;
  private updatePreviewTimeout: number;
  private updatePreviewDebounce = 200;
  private updatePreviewRecipeQueue: any;
  private activeEl: HTMLElement = void 0;
  private showCount = 8;

  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    const style = document.createElement('style');

    style.textContent = styles.default;

    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(this.contentEl);
    this.previewEl.attachTo = this;
  }

  connectedCallback() {
    const positionStrategy = floaters.positionStrategies.ninja(
      'TOP_LEFT',
      {
        x: -20,
        y: 0,
      },
      true,
      false,
    );

    const arrowStrategy = () => {
      console.log(this.activeEl);
      return {
        size: 8,
        x: 0,
        y: this.activeEl ? this.activeEl.offsetTop + 19 : 0,
        fromRight: true,
      };
    };

    this.previewFloater = floaters.generic(this, this.previewEl, {
      hasBackdrop: false,
      positionStrategy,
      arrowStrategy,
      transition: () => 'bounce-right',
    });

    this.setInitialState();

    // Prevent event execution so that links can be clicked.
    this.addEventListener('mousedown', (ev) => {
      ev.stopPropagation();
      ev.preventDefault();
    });
  }

  setRecipes(recipes: any[], statistics: any, searchString: string) {
    this.previewFloater.hide();
    this.contentEl.innerHTML = '';
    if (recipes.length === 0) {
      this.contentEl.innerHTML = `<span class="nothing">(╯°□°)╯︵<br>Found nothing.</span>`;
      return;
    }

    const els = recipes
      .slice(0, this.showCount)
      .map((recipe) => this.createEntry(recipe, searchString))
      .concat([this.createGlobalResultsLink()]);
    this.setResultsMessage(els.length, statistics.Matches || 0);

    // Add elements to dom one after the other.
    els.forEach((el) => this.contentEl.appendChild(el));
    els.forEach((el, i) =>
      setTimeout(() => el.classList.toggle('loaded', true), i * 20),
    );
  }

  abortDebounce() {
    if (this.updatePreviewTimeout) {
      clearTimeout(this.updatePreviewTimeout);
    }
  }

  setInitialState() {
    this.contentEl.innerHTML = `<span class="nothing">recent recipes maybe?</span>`;
  }

  private createGlobalResultsLink(): HTMLElement {
    const el = document.createElement('search-result-all-of-tenant');
    return el;
  }

  private setResultsMessage(len: number, total: number): void {
    const notShowingCount = total - len;
    const el = document.createElement('div');
    el.classList.toggle('results', true);
    if (notShowingCount > 0) {
      el.innerHTML = `
      <span style="flex: 1 1;">recipes in › folder name</span>
      <span>show ${notShowingCount} more</span>
    `;
    } else {
      el.innerHTML = `
      <span style="flex: 1 1;">recipes in › folder name</span>
      <span>found ${len}</span>
    `;
    }

    this.contentEl.appendChild(el);
  }

  private createEntry(recipe: any, searchString: string): any {
    const el = document.createElement(
      'search-result-recipe',
    ) as SearchResultRecipeComponent;
    el.recipe = recipe;
    el.searchString = searchString;
    el.addEventListener('mouseover', () => {
      if (this.activeEl) {
        this.activeEl.classList.toggle('active', false);
      }
      this.activeEl = el;
      el.classList.toggle('active', true);
      this.updatePreview(recipe);
    });
    return el;
  }

  private updatePreview(recipe: any) {
    if (recipe === this.updatePreviewRecipeQueue) {
      return;
    }
    this.updatePreviewRecipeQueue = recipe;

    this.previewFloater.hide();
    this.abortDebounce();
    const updatePreviewTimeout = (this.updatePreviewTimeout = setTimeout(
      () =>
        fetch(
          `https://azing.org/api/catalog/live/2sic/browse/${recipe.ShortId}`,
        )
          .then((res) => res.json())
          .then((data) => {
            // Check if data is still relevant.
            if (this.updatePreviewTimeout !== updatePreviewTimeout) {
              return;
            }
            this.previewEl.update(data);
            this.previewFloater.boxComponent.reposition();
            this.previewFloater.show();
          }),
      this.updatePreviewDebounce,
    ));
  }
}
