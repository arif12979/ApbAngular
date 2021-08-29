import { UpworkTemplatePage } from './app.po';

describe('Upwork App', function() {
  let page: UpworkTemplatePage;

  beforeEach(() => {
    page = new UpworkTemplatePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
