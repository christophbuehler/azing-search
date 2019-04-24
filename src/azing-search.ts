import { Urls } from './main';
import { SearchContentComponent } from './search-content';

declare const floaters: any;

export class AzingSearch {
  visible = false;
  private floater: any;
  private contentComponent: SearchContentComponent;
  private updateNeedleTimeout: number;
  private updateNeedleDebounce = 200;
  private needle: string;

  constructor(
    private attachTo: HTMLElement,
    private resultCount: number,
    private urls: Urls,
  ) {
    this.contentComponent = document.createElement(
      'search-content',
    ) as SearchContentComponent;

    const positionStrategy = floaters.positionStrategies.ninja(
      'BOTTOM_RIGHT',
      {
        x: 0,
        y: 12,
      },
      true,
      false,
    );
    const arrowStrategy = floaters.arrowStrategies.topStart(8, 20);
    this.floater = floaters.generic(this.attachTo, this.contentComponent, {
      hasBackdrop: false,
      positionStrategy,
      arrowStrategy,
    });
  }

  update(needle: string) {
    if (this.needle === needle) {
      return;
    }
    this.needle = needle;

    if (this.updateNeedleTimeout) {
      clearTimeout(this.updateNeedleTimeout);
    }

    this.contentComponent.previewFloater.hide();
    this.contentComponent.abortDebounce();

    if (needle === '') {
      this.contentComponent.setInitialState();
      return;
    }

    const updateNeedleTimeout = (this.updateNeedleTimeout = setTimeout(
      () =>
        fetch(`https://azing.org/api/catalog/live/2sic/search/${needle}?p=1`)
          .then((res) => res.json())
          .then((res) => {
            // Check if data is still relevant.
            if (this.updateNeedleTimeout !== updateNeedleTimeout) {
              return;
            }
            this.contentComponent.previewFloater.hide();
            this.contentComponent.abortDebounce();
            this.contentComponent.setRecipes(
              res ? res.Recipes : [],
              res ? res.Statistics : {},
              needle,
            );
          }),
      this.updateNeedleDebounce,
    ));
  }

  show() {
    this.visible = true;
    this.floater.show();
  }

  hide() {
    this.visible = false;
    this.floater.hide();
    this.contentComponent.previewFloater.hide();
    this.contentComponent.abortDebounce();
  }
}
