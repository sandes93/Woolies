const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const puppeteer = require('puppeteer');
const path = require("path");
const fs = require("fs");

let foodList ='';

async function scrapeProduct () {
	
	
	const browser = await puppeteer.launch({
		executablePath: '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
        headless: false,
        slowMo: 250,
        args: [
            '--disable-dev-shm-usage',
            '--disable-web-security'
        ],  
        defaultViewport: { width: 1280, height: 900 }
	  });

	const client = new Client({
	    authStrategy: new LocalAuth(),
	    puppeteer: { headless: true }
	});

	client.on('qr', (qr) => {
		// NOTE: This event will not be fired if a session is specified.
		qrcode.generate(qr, {small: true});
	});

	client.on('authenticated', () => {
		console.log('AUTHENTICATED');
	});

	client.on('auth_failure', msg => {
		// Fired if session restore was unsuccessful
		console.error('AUTHENTICATION FAILURE', msg);
	});

	client.on('ready', () => {
		console.log('READY');
	});

	client.initialize();

	client.on('message', message => {
		searchFood(message)
	}); 
	async function searchFood(foodList){
		const page = await browser.newPage();

	    await page.goto('https://www.woolworths.com.au/shop/search');

	    foodListArr = foodList.body.split("\n")
	    console.log(foodListArr);
	    console.log(typeof foodListArr);
	    for (var i = 0; i < foodListArr.length; i++) {
	    	let text = foodListArr[i].trim()
	    	console.log(text);
	    	await page.type('#wx-headerSearch', text);
			await page.keyboard.press('Enter')
			// await page.waitForNavigation({waitUntil: 'networkidle2'});
			// const [button] = await page.$x("//button[contains(., ' Add to cart ')]");
			// if (button) {
			//     await button.click();
			// }

			// const buttons = await page.$$('button[class*="ng-star-inserted"]')
			// .then(()=>console.log("got buttons"))
			// console.log(buttons);
			// await buttons[i].click();
			
			// let button = await page.$x('//*[@id="search-content"]/div/wow-product-search-container/shared-grid/div/div[1]/shared-product-tile/section/footer/div/shared-cart-controls/div/shared-cart-buttons/div/div/div/div/button/span')
			// console.log(button);
			
			// const linkHandlers = await page.$x("//a[contains(text(), ' Add to cart ')]");

			// if (linkHandlers.length > 0) {
			//   await linkHandlers[0].click();
			// } else {
			//   throw new Error("Link not found");
			// }


			// let input = await page.$('#wx-headerSearch');
			// await input.click({ clickCount: 3 })
			// await page.keyboard.press('Backspace');
			
    	}
	} 

}    



scrapeProduct();