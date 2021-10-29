const {base_url} = require('./src/config')
const fetch = require('node-fetch');

let options = {
    method: 'DELETE',
    headers: {'Content-Type': 'application/json'},
};

fetch(base_url+"/clear", options)
    .then(res => res.json())
    .then(json => ()=>{
        console.log(json)
    })
    .catch(err => console.error('error:' + err));
