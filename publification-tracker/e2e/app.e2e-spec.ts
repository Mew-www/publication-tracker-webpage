import { PublificationTrackerPage } from './app.po';

describe('publification-tracker App', function() {
  let page: PublificationTrackerPage;

  beforeEach(() => {
    page = new PublificationTrackerPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
