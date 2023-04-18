import { Location } from "./MapViewClass";
export default 
class addressAutocomplete
{
    constructor(){
        this.currentTimeout=null;
        this.currentPromiseReject=null;
    }
    Run(Callback,str_address){
    
        const MIN_ADDRESS_LENGTH = 3;
        const DEBOUNCE_DELAY = 300;
    
        const currentValue=str_address;
        if (this.currentTimeout) {
            clearTimeout(this.currentTimeout);
          }
      
          // Cancel previous request promise
        if (this.currentPromiseReject) {
        this.currentPromiseReject({
            canceled: true
        });
        }
    
        if (!currentValue || currentValue.length < MIN_ADDRESS_LENGTH) {
            return false;
        }
        this.currentTimeout = setTimeout(() => {
            this.currentTimeout = null;
                
          /* Create a new promise and send geocoding request */
          const promise = new Promise((resolve, reject) => {
            this.currentPromiseReject = reject;
    
            // Get an API Key on https://myprojects.geoapify.com
            const apiKey = '8c413d560bbd42d481dc9d4112e5752a';
    
            var url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(currentValue)}&format=json&limit=5&apiKey=${apiKey}`;
    
            fetch(url)
              .then(response => {
                this.currentPromiseReject = null;
    
                // check if the call was successful
                if (response.ok) {
                  response.json().then(data => resolve(data));
                } else {
                  response.json().then(data => reject(data));
                }
              });
          });
    
          promise.then((data) => {
            // here we get address suggestions
            console.log(getNeedValue(data.results));
            Callback(getNeedValue(data.results));
          }, (err) => {
            if (!err.canceled) {
              console.log(err);
            }
          });
        }, DEBOUNCE_DELAY);
    }
}

function getNeedValue(list){
    return list.map(element => { 
        return new Location(element.formatted,
            element.lon,
            element.lat)
    });
}