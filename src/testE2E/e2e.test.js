import React from 'react';
import puppeteer from 'puppeteer-core';

describe('renders without crashing', () => {
    test(
        'We view the registration portal',
        async () => {
            let browser = await puppeteer.launch({
                executablePath: process.env.CHROME_EXECUTABLE_PATH,
                headless: false,
            });
            let page = await browser.newPage();

            await page.goto('http://localhost:3000/portal/registration');
            await page.waitForSelector('#root');

            const rootDiv = await page.$eval('div', e => e.innerHTML);
            // div element w/ id "root" should NOT be empty (if everything 
            // loads/renders properly)
            expect(rootDiv).not.toEqual('');

            browser.close();
        },
        16000
    );
});