# eth-event-reader
Small utility to read/scan Ethereum smart contract events

## Installation 
```sh
npm install eth-event-reader --save
yarn add eth-event-reader
bower install eth-event-reader --save
```
## Usage
### Javascript
```javascript
const readerModule = require('eth-event-reader');
const reader = new readerModule.EventReader('http://localhost:8545');
reader.read('contract address', contractAbi, "your event name", function (data) {
                return new Promise(((resolve, reject) => {
                    // Your handle code here
                }))
            })
            .then(rs => {
                // rs is an array of handling result
            });
```

### TypeScript
```typescript
import * as ethEventReader from 'eth-event-reader';
const reader = new ethEventReader.EventReader('http://localhost:8545');
reader.read('contract address', contractAbi, "your event name", data => {
                return new Promise(((resolve, reject) => {
                    // Your handle code here
                }))
            })
            .then(rs => {
                // rs is an array of handling result (EventHandlingResult[])
            });
````

## Test 
```sh
npm run test
```

