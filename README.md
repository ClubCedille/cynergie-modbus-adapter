# Démo exposing metrics to ptometheus with node.js lib

### Usage
- Install Prometheus and change the config file `prometheus.yml` to this 

 ```
 global:
  scrape_interval: 15s
  
scrape_configs:
  - job_name: 'cynergie'
    scrape_interval: 10s
    static_configs:
      - targets: ['localhost:3000']

  ```
 - Clone the node.js client lib [nprom-client ](https://github.com/siimon/prom-client)
  
 - Install Modules 
 
 ```
 npm install
 ```
- config the debug to test

```
./node_modules/.bin/tsc

```
- start the service , metrics should be available in `http://localhost:3000/metrics`

```
npm run start:service debug

```
- Start prometheus , in  `http://localhost:9090`  execute `voltage_gauge` 


