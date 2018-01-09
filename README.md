# Démo exposing metrics to Prometheus with prom-client

### Usage
- need docker and docker-compose to work
- ntart prometheus with  `docker-compose up`
- the metrics are in http://localhost:3002/metrics
- prometheus is in http://localhost:9090
- open grafana is in http://localhost:3000 
  - user: ` admin` 
  - password: ` cynergie` 
### Source
- https://github.com/gcolajan/modbus-reading
- https://github.com/siimon/prom-client
- https://github.com/vegasbrianc/prometheus
