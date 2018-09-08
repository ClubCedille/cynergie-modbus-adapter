# Cynergie adapter 

![](http://cedille.etsmtl.ca/img/portfolio/cynergie-project.jpg)

## Usage
- Dans le dossier modbus-adapter `mv config.exemple.json  config.json`
- Ajouter les controlleurs avec leur addresse IP et leurs liste des [registres](https://github.com/ClubCedille/cynergie-modbus-adapter/tree/master/Doc/ION_Meter_Modbus.pdf).
- Démarrer avec  `docker-compose up`

Ports | APP
------------ | -------------
3002/metrics | les Données envoyés par le modbus-adapter 
9090 | Prometheus DB
3000 | Grafana

Pour plus d'infomation visitez le [wiki](https://github.com/ClubCedille/cynergie-modbus-adapter/wiki) où https://cynergie.cedille.club/

