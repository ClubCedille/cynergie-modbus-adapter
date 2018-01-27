"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DatasetHelper {
    /** Flatten an array */
    static flatten(arrays) {
        return [].concat.apply([], arrays);
    }
    /** Summarize a dataset by returning one line with average values */
    static summarize(dataset) {
        if (dataset.length === 0) {
            throw new Error('No data has been collected, can\'t summarize');
        }
        const finalData = {
            time: dataset[0].time,
            name: dataset[0].name,
            data: []
        };
        dataset[0].data.forEach(d => {
            finalData.data.push({
                label: d.label,
                data: 0,
                unit: d.unit
            });
        });
        // Sum
        dataset.forEach(d => {
            for (let i = 0; i < d.data.length; i++) {
                finalData.data[i].data += d.data[i].data;
            }
        });
        // Mean 
        for (let i = 0; i < finalData.data.length; i++) {
            finalData.data[i].data /= dataset.length;
        }
        return finalData;
    }
}
exports.DatasetHelper = DatasetHelper;
