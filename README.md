# Démo exposing metrics to Prometheus with prom-client

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
- Start prometheus with  `docker-compose up`

### Source
- https://github.com/gcolajan/modbus-reading
- https://github.com/siimon/prom-client
- https://github.com/vegasbrianc/prometheus
