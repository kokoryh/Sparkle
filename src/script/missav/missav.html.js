import * as cheerio from 'cheerio';

// import * as fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';
// const __dirname = path.dirname(fileURLToPath(import.meta.url));
// const $response = {
//     headers: { 'content-type': 'text/html' },
//     body: fs.readFileSync(path.join(__dirname, './input.html'), 'utf-8'),
// };
// const $done = ({ body }) => {
//     fs.writeFileSync(path.join(__dirname, './output.html'), body);
// };

const headers = $response.headers;
const contentType = headers['content-type'];
if (!contentType?.includes('text/html')) $done({});

const scriptElement = `<script>(function(){'use strict';document.addEventListener('ready',()=>{window.open=()=>{};if(window.player?.pause){const pause=window.player.pause;window.player.pause=()=>{if(document.hasFocus()){pause()}}}})})();</script>`;
const styleElement = `<style>.lg\\:block,.lg\\:hidden,a[href*="//bit.ly/"],div:has(a[href*='go.myavlive.com']),div[style*='width: 300px; height: 250px;'],.relative>div[x-init*='campaignId=under_player'],div[x-show^='recommendItems']~div[class]:has(>div>div.mx-auto>div.flex>a[rel^='sponsored']){display:none!important}</style>`;
const scriptElementFilter = (i, element) => {
    if (element.attribs?.src?.includes('cdn.tsyndicate.com')) {
        return true;
    }
    if (element.children?.[0]?.data?.includes('TSOutstreamVideo')) {
        return true;
    }
    if (element.children?.[0]?.data?.includes('htmlAds')) {
        return true;
    }
    return false;
};
const handleResponse = ({ body }) => {
    try {
        const $ = cheerio.load(body);
        $('script').filter(scriptElementFilter).remove();
        $('head').append(scriptElement, styleElement);
        return { body: $.html() };
    } catch (e) {
        console.log(e.toString());
        return null;
    }
};

$done(handleResponse($response) || {});
