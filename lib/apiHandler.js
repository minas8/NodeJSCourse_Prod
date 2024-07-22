// 1- Insert http module
const http = require('http');
const url = require('url');

// 'customers' - Resource database

const customers = [
    { id: 1, name: 'John Doe', address: '123 Main St, Cityville', balance: 1000.00 },
    { id: 2, name: 'Jane Smith', address: '456 Elm St, Townsville', balance: 1500.50 },
    { id: 3, name: 'Michael Johnson', address: '789 Oak St, Villageton', balance: 500.25 },
    { id: 4, name: 'Emily Davis', address: '101 Pine St, Hamletville', balance: 3000.75 },
    { id: 5, name: 'David Brown', address: '222 Maple St, Suburbia', balance: 750.20 },
    { id: 7, name: 'Robert Taylor', address: '444 Birch St, Townville', balance: 800.60 },
    { id: 8, name: 'Jennifer Martinez', address: '555 Oak St, Cityville', balance: 2200.30 },
    { id: 9, name: 'William Garcia', address: '666 Pine St, Hamletville', balance: 1750.10 },
    { id: 10, name: 'Mary Hernandez', address: '777 Elm St, Countryside', balance: 900.45 }
];

// 2- Create a server
const handleApiRequest = (request, response) => {
    // API structure
    // -- 'http://localhost:3003/api/v1/customers'
    // /api/v1/customers - POST --> {body: {name:, address:, ...}}
    // /api/v1/customers/{id} - PUT --> {body: {id:, name:, address:, ...}}
    // /api/v1/customers/{id} - PATCH --> {body: {id:, name:, address:, ...}}
    // /api/v1/customers/{id} - DELETE

    // 1. Break-down URL to components
    const parsedUrl = url.parse(request.url, true);
    const pathname = parsedUrl.pathname; // --> /api/v1/customers
    const method = request.method; // --> GET

    // A. Extract id from URL based on standard REST API
    // 1. Identify the resource --> customers --> default
    // 2. Identify the id --> /{id}
    const arrUrlParts = pathname.split('/');
    const lastPart = arrUrlParts[arrUrlParts.length - 1];
    const lastlastPart = arrUrlParts[arrUrlParts.length - 2];

    // --customers--GET--
    // --customers--x--GET--
    // --customers--POST--
    let customer = '';
    let body = '';
    let route = '';
    if (lastPart === 'customers' || lastlastPart === 'customers') {
        route = lastlastPart === 'customers' ? '--customers--x' : '--customers';
    }
    console.log(`${route}--${method}--`);

    switch (`${route}--${method}--`) {
        case '--customers--GET--':
            if (customers) {
                response.writeHead(200, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify(customers));
            } else {
                response.writeHead(404, { 'Content-Type': 'text/plain' });
                response.end(JSON.stringify({ message: `Customers not found!` }));
            }
            break;
        case '--customers--POST--':
            request.on('data', chunk => body += chunk.toString());
            request.on('end', () => {
                // - Create a unique ID for the new record
                const newID = customers.length + 1;
                // - When finished, create the new resource
                const newCustomer = JSON.parse(body);
                newCustomer.id = newID;
                customers.push(newCustomer);

                // - Send a response to the client
                response.writeHead(201, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify(newCustomer));
            })
            break;
        case '--customers--x--GET--':
            customer = customers.find(c => c.id === parseInt(lastPart));

            if (customer) {
                response.writeHead(200, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify(customer));
            } else {
                response.writeHead(404, { 'Content-Type': 'text/plain' });
                response.end(JSON.stringify({ message: `Customer ${lastPart} not found!` }));
            }
            break;
        case '--customers--x--PUT--':
            request.on('data', chunk => body += chunk.toString());
            request.on('end', () => {
                // - When finished, create the new resource
                const customer = JSON.parse(body);
                const idx = customers.findIndex(c => c.id === customer.id);
                customers.splice(idx, 1, customer);

                // - Send a response to the client
                response.writeHead(202, { 'Content-Type': 'application/json' });
                response.end(`${customer.name} was updated`);

            })
            break;
        case '--customers--x--DELETE--':
            customer = JSON.parse(body);
            const idx = customers.findIndex(c => c.id === customer.id);
            customers.slice(idx);

            response.writeHead(204, { 'Content-Type': 'application/json' });
            response.end(`${customer.name} was deleted`);
            break;

        default:
            response.writeHead(404, { 'Content-Type': 'text/plain' });
            response.end('API endpoint not found!');
            break;
    }
};

module.exports = { handleApiRequest };