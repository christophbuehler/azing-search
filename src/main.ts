import { AzingSearch } from './azing-search';
import { SearchRecipePreviewComponent } from './recipe-preview/recipe-preview';
import { SearchContentComponent } from './search-content';
import { SearchResultRecipeComponent } from './search-results/result-recipe';
import { SearchResultShowAllOfTenantComponent } from './search-results/result-show-all-of-tenant';

// Define custom elements of this app.
window.customElements.define('search-content', SearchContentComponent);
window.customElements.define(
  'search-result-recipe',
  SearchResultRecipeComponent,
);
window.customElements.define(
  'search-result-all-of-tenant',
  SearchResultShowAllOfTenantComponent,
);
window.customElements.define('recipe-preview', SearchRecipePreviewComponent);

// Entry point.
export default (attachTo: HTMLElement, resultCount: number, urls: Urls) =>
  new AzingSearch(attachTo, resultCount, urls);

export interface Urls {
  searchInFolder: (needle: string) => string;
  searchInTenant: (needle: string) => string;
  getPreview: ({ ShortId }: any) => string;
}

const a = [1, 2];
