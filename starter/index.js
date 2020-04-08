// The name of the variables is usually same as the name of the packages.
const fs = require('fs');
const http = require('http');
const url = require('url');

const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
const laptopData = JSON.parse(json);

const server = http.createServer((req, res) => {

    // console.log('The request was recieved.');

    const pathName = url.parse(req.url, true).pathname;
    const id = url.parse(req.url, true).query.id;

    // PRODUCT OVERVIEW
    if(pathName === '/products' || pathName === '/') {
        res.writeHead(200, { 'Content-Type': 'text/HTML'});
        fs.readFile(`${__dirname}/data/templates/template-overview.html`, 'utf-8', (err, data) => {
            let overviewOutput = data;
            fs.readFile(`${__dirname}/data/templates/template-card.html`, 'utf-8', (err, data) => {

                const cardsOutput = laptopData.map(el => replaceTemplate(data, el)).join('');
                overviewOutput = overviewOutput.replace('{%CARD%}', cardsOutput);
                res.end(overviewOutput);
            });
            
        });
    }
    // PRODUCT DETAIL
    else if (pathName === '/laptop' && id < laptopData.length ) {
        res.writeHead(200, { 'Content-Type': 'text/HTML'});
        fs.readFile(`${__dirname}/data/templates/template-laptop.html`, 'utf-8', (err, data) => {
            const laptop = laptopData[id];
            let output = replaceTemplate(data, laptop);
            res.end(output);

        });
    }
    // IMAGES
    else if((/\.(jpg|jped|png|gif)$/i).test(pathName)) {
        fs.readFile(`${__dirname}/data/img/${pathName}`, (err, data) => {
            res.writeHead(200, { 'Content-type' : 'image/jpg'});
            res.end(data);
        });
    }
    // URL NOT FOUND 
    else {
        res.writeHead(404, { 'Content-Type': 'text/HTML'});
        res.end('URL not found ');
    }

});

server.listen(1337, '127.0.0.1', () => {

    console.log('The request was sent.');
});

function replaceTemplate(originalHtml, laptop) {
    let output = originalHtml.replace(/{%PRODUCTNAME%}/g, laptop.productName);
    output = output.replace(/{%PRICE%}/g, laptop.price);
    output = output.replace(/{%IMAGE%}/g, laptop.image);
    output = output.replace(/{%RAM%}/g, laptop.ram);
    output = output.replace(/{%CPU%}/g, laptop.cpu);
    output = output.replace(/{%SCREEN%}/g, laptop.screen);
    output = output.replace(/{%STORAGE%}/g, laptop.storage);
    output = output.replace(/{%DESCRIPTION%}/g, laptop.description);
    output = output.replace(/%ID%/g, laptop.id);
    return output;
};