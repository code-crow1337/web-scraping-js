const puppeteer = require('puppeteer');


let books = [];


const scrapeData = async (page, xPath,prop) => {
  const [el] = await page.$x(xPath);
  const textProp = await el.getProperty(prop);
  const textTxt = await textProp.jsonValue();
  return textTxt;
}
const testXPath = async (page, xPath) => {
  const exist = await page.$x(xPath);
 return exist.length > 0 ? true : false;
}
async function scrapeProduct(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

let title = '';
let img = '';   

  if(! await testXPath(page, '/html/body/div[1]/div[2]/div/div/div/div[3]/div[3]/h1')) {
    title = await scrapeData(page,
      '/html/body/div[1]/div[2]/div/div/div/div[3]/div[2]/h1',
      'innerText');
    [img] = await scrapeData(page,
      '/html/body/div[1]/div[2]/div/div/div/div[3]/div[2]/img',
      'src');
  }else {
    title = await scrapeData(page,
      '/html/body/div[1]/div[2]/div/div/div/div[3]/div[3]/h1',
      'innerText');
   [img] = await scrapeData(page,'/html/body/div[1]/div[2]/div/div/div/div[3]/div[3]/img'
   ,'src');
  }

  const desc = await scrapeData(page,'//*[@id="product-description"]/div[1]/div/div','innerText');
  
  return {title, img, desc}
  browser.close();

}
const getBooks = () => {
  Promise.all([
    scrapeProduct('https://www.bokus.com/bok/9789129697704/harry-potter-och-de-vises-sten/'),
   scrapeProduct('https://www.bokus.com/bok/9789129701364/harry-potter-och-hemligheternas-kammare/'),
    scrapeProduct('https://www.bokus.com/bok/9789129704211/harry-potter-och-fangen-fran-azkaban/'),
  scrapeProduct('https://www.bokus.com/bok/9789129717204/harry-potter-och-den-flammande-bagaren/'),
   scrapeProduct('https://www.bokus.com/bok/9789129723922/harry-potter-och-fenixorden/'),
   scrapeProduct('https://www.bokus.com/bok/9789129723908/harry-potter-och-halvblodsprinsen/'),
   scrapeProduct('https://www.bokus.com/bok/9789129723939/harry-potter-och-dodsrelikerna/')
  ,])
    .then((values) => saveToObject(values))
    .catch(err => console.log(err))

}
const saveToObject = (books) => {
  books = [...books];
  books.forEach(element => {
    console.log('Title: ', element.title);
    console.log('\n Desc:', element.desc);
  });
}


getBooks();
