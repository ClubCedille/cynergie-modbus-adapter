#Cynergie adapter with Prometheus and Grafana

### Usage
- need docker and docker-compose to work
- create config file in the modbus-adapter directory `config.json` and add controllers IP adresse in it , Example :

```
{
	"controllers": [
		{
			"name": "DEMO",
			"address": "",
			"port": "502",
			"slaveId": 1,
			"valueItemInfos": [
				{"label": "Vln_avg", "address": 171, "type": "UINT32", "unit": "V", "coefficient": 1, "recurrence": "*/5 * * * * *"},
				{"label": "I_avg", "address": 154, "type": "UINT16", "unit": "A", "coefficient": 0.1, "recurrence": "*/5 * * * * *"},
				{"label": "kW_tot", "address": 203, "type": "INT32", "unit": "kW", "coefficient": 1, "recurrence": "*/5 * * * * *"},
				{"label": "Freq", "address": 158, "type": "UINT16", "unit": "Hz", "coefficient": 0.1, "recurrence": "*/5 * * * * *"}
			]
		},
		{
			"name": "DEMO2",
			"address": "",
			"port": "502",
			"slaveId": 1,
			"valueItemInfos": [
				{"label": "Vln_avg", "address": 171, "type": "UINT32", "unit": "V", "coefficient": 1, "recurrence": "*/5 * * * * *"},
				{"label": "Freq", "address": 158, "type": "UINT16", "unit": "Hz", "coefficient": 0.1, "recurrence": "*/5 * * * * *"}
			]
		}
	]
}


```

- start   with  `docker-compose up`
	- Modbus metrics are in http://localhost:3002/metrics
	- Prometheus is in http://localhost:9090
	- Grafana is open  in http://localhost:3000 
	- Cadvisor is open  in http://localhost:8080

